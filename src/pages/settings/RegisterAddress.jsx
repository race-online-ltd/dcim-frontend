import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Download } from 'lucide-react';
import Button from "../../components/ui/Button";
import DataTable from "../../components/table/DataTable";
import { fetchRegisterAddresses, deleteRegisterAddress } from "../../api/settings/registerAddressApi";
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
    .register-address-list-container {
        padding: 1.5rem;
        background-color: #f9fafb;
    }
    .register-address-header {
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

const RegisterAddress = () => {
  const [registerAddressData, setRegisterAddressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadRegisterAddresses();
  }, []);

  const loadRegisterAddresses = async () => {
    try {
      setLoading(true);
      const data = await fetchRegisterAddresses();
      setRegisterAddressData(data);
    } catch (err) {
      setError('Failed to load Register Address data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = useCallback((id) => {
    navigate(`/admin/settings/register-address-edit/${id}`);
  }, [navigate]);

  const handleDelete = useCallback((id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this Register Address?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteRegisterAddress(id);
              setRegisterAddressData(prev => prev.filter(item => item.id !== id));
            } catch (err) {
              setError('Failed to delete Register Address.');
            }
          },
        },
        { label: 'No' },
      ],
    });
  }, []);

  const handleExport = () => {
    console.log('Export Register Address data');
  };

  const columns = useMemo(() => [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    {
      key: "actions",
      header: "Actions",
      isSortable: false,
      render: (v, row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button 
            className="data-table-btn-icon text-indigo-500 hover:text-indigo-700" 
            onClick={() => handleEdit(row.id)} 
            title="Edit Register Address"
          >
            <Edit size={16} />
          </button>
          <button 
            className="data-table-btn-icon text-red-500 hover:text-red-700" 
            onClick={() => handleDelete(row.id)} 
            title="Delete Register Address"
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

      <div className="register-address-list-container">
        <header className="register-address-header">
            <h2 className="text-xl font-bold">Register Address</h2>
            <div className="d-flex gap-2">
                <Button
                    intent="primary"
                    leftIcon={Plus}
                    onClick={() => navigate('/admin/settings/register-address-create')}
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
              title="Register Address Records"
              data={registerAddressData} 
              columns={columns} 
              showId={false}
              initialPageSize={10}
              searchable={true} 
              selection={false}
              isBackendPagination={false}
            />
        </div>
      </div>
    </>
  );
};

export default RegisterAddress;
