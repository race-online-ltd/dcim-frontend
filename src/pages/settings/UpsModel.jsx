import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Download } from 'lucide-react';
import Button from "../../components/ui/Button";
import DataTable from "../../components/table/DataTable";
import { fetchUpsModels, deleteUpsModel } from "../../api/settings/upsModelApi";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { successMessage, errorMessage } from '../../api/api-config/apiResponseMessage';

const iconButtonStyles = `
    .data-table-btn-icon {
        background: transparent;
        border: none;
        padding: 0.25rem;
        cursor: pointer;
        transition: background-color 0.15s ease-in-out;
        outline: none;
        box-shadow: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
    .data-table-btn-icon:hover {
        background-color: #e5e7eb;
        border-radius: 0.25rem;
    }
    .data-table-btn-icon:focus {
        outline: 2px solid #6366f1;
        outline-offset: 2px;
        box-shadow: none;
    }
`;

const pageLayoutStyles = `
    .ups-model-list-container {
        padding: 1.5rem;
        background-color: #f9fafb;
    }
    .ups-model-header {
        background-color: transparent; 
        padding: 0; 
        border-radius: 0; 
        margin-bottom: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e5e7eb; 
        padding-bottom: 1rem;
    }
`;

const UpsModel = () => {
  const [upsModelData, setUpsModelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUpsModels();
  }, []);

  const loadUpsModels = async () => {
    try {
      setLoading(true);
      const data = await fetchUpsModels();
      setUpsModelData(data);
    } catch (err) {
      setError('Failed to load UPS Model data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = useCallback((id) => {
    navigate(`/admin/settings/ups-model-edit/${id}`);
  }, [navigate]);

  const handleDelete = useCallback((id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this UPS Model?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const res = await deleteUpsModel(id);
              successMessage(res);
              setUpsModelData(prev => prev.filter(item => item.id !== id));
            } catch (err) {
              errorMessage(err);
            }
          },
        },
        { label: 'No' },
      ],
    });
  }, [deleteUpsModel, successMessage, errorMessage]);

  const handleExport = () => {
    console.log('Export UPS Model data');
  };

  const columns = useMemo(() => [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "protocol", header: "Protocol" },
    {
      key: "actions",
      header: "Actions",
      isSortable: false,
      render: (v, row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button 
            className="data-table-btn-icon text-indigo-500 hover:text-indigo-700" 
            onClick={() => handleEdit(row.id)} 
            title="Edit UPS Model"
          >
            <Edit size={16} />
          </button>
          <button 
            className="data-table-btn-icon text-red-500 hover:text-red-700" 
            onClick={() => handleDelete(row.id)} 
            title="Delete UPS Model"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ], [handleEdit, handleDelete]);

  return (
    <>
      <style>{iconButtonStyles}</style>
      <style>{pageLayoutStyles}</style>

      <div className="ups-model-list-container">
        <header className="ups-model-header">
            <h2 className="text-xl font-bold">Ups Model</h2>
            <div className="d-flex gap-2">
                <Button
                    intent="primary"
                    leftIcon={Plus}
                    onClick={() => navigate('/admin/settings/ups-model-create')}
                >
                    Add New
                </Button>
                <Button
                    intent="secondary"
                    leftIcon={Download}
                    onClick={handleExport}
                >
                    Export
                </Button>
            </div>
        </header>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="p-4 bg-white rounded-lg shadow-sm">
            <DataTable
              title="Ups Model Records"
              data={upsModelData} 
              columns={columns} 
              showId={false}
              initialPageSize={10}
              searchable={true} 
              selection={false}
              isBackendPagination={false}
              isLoading={loading}
            />
        </div>
      </div>
    </>
  );
};

export default UpsModel;
