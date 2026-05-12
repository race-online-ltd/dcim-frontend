import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Download } from 'lucide-react';
import Button from "../../components/ui/Button";
import DataTable from "../../components/table/DataTable";
import { fetchModelWiseAddressMappings, deleteModelWiseAddressMapping } from '../../api/settings/modelWiseAddressMappingApi';
import { exportToCSV } from '../../utils/exportUtils';
import { successMessage, errorMessage } from '../../api/api-config/apiResponseMessage';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

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
    .mapping-list-container {
        padding: 1.5rem;
        background-color: #f9fafb;
    }
    .mapping-header {
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

const ModelWiseAddressMapping = () => {
  const [mappingData, setMappingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchModelWiseAddressMappings();
      setMappingData(data);
    } catch (error) {
      console.error('Failed to fetch mappings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = useCallback((id) => {
    navigate(`/admin/settings/model-wise-address-mapping-edit/${id}`);
  }, [navigate]);

  const handleDelete = useCallback((id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this mapping?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const res = await deleteModelWiseAddressMapping(id);
              successMessage(res);
              loadData();
            } catch (err) {
              errorMessage(err);
            }
          },
        },
        { label: 'No' },
      ],
    });
  }, [loadData, deleteModelWiseAddressMapping, successMessage, errorMessage]);

  const handleExport = () => {
    const exportData = mappingData.map(item => ({
      ID: item.id,
      'Model Name': item.model_name,
      'Address Name': item.address_name,
    }));
    exportToCSV(exportData, 'model_wise_address_mappings.csv');
  };

  const columns = useMemo(() => [
    { key: "id", header: "ID" },
    { key: "model_name", header: "Model Name" },
    { key: "address_name", header: "Address Name" },
    {
      key: "actions",
      header: "Actions",
      isSortable: false,
      render: (v, row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button 
            className="data-table-btn-icon text-indigo-500 hover:text-indigo-700" 
            onClick={() => handleEdit(row.id)} 
            title="Edit Mapping"
          >
            <Edit size={16} />
          </button>
          <button 
            className="data-table-btn-icon text-red-500 hover:text-red-700" 
            onClick={() => handleDelete(row.id)} 
            title="Delete Mapping"
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

      <div className="mapping-list-container">
        <header className="mapping-header">
            <h2 className="text-xl font-bold">Model Wise Address Mapping</h2>
            <div className="d-flex gap-2">
                <Button
                    intent="primary"
                    leftIcon={Plus}
                    onClick={() => navigate('/admin/settings/model-wise-address-mapping-create')}
                >
                    Add New
                </Button>
                <Button
                    intent="secondary"
                    leftIcon={Download}
                    onClick={handleExport}
                    disabled={mappingData.length === 0}
                >
                    Export
                </Button>
            </div>
        </header>

        <div className="p-4 bg-white rounded-lg shadow-sm">
            <DataTable
              title="Mapping Records"
              data={mappingData} 
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

export default ModelWiseAddressMapping;
