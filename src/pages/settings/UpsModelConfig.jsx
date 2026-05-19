import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Download } from 'lucide-react';
import Button from "../../components/ui/Button";
import DataTable from "../../components/table/DataTable";
import { fetchUpsModelConfigs, deleteUpsModelConfig } from '../../api/settings/upsModelConfigApi';
import { exportToCSV } from '../../utils/exportUtils';
import { successMessage, errorMessage } from '../../api/api-config/apiResponseMessage';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import UpsTabs from '../../components/UpsTabs';

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
    .ups-model-config-container {
        padding: 1.5rem;
        background-color: #f9fafb;
    }
    .ups-model-config-header {
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

const UpsModelConfig = () => {
  const [configData, setConfigData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUpsModelConfigs();
      setConfigData(data);
    } catch (error) {
      console.error('Failed to fetch configs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = useCallback((id) => {
    navigate(`/admin/settings/ups-model-config-edit/${id}`);
  }, [navigate]);

  const handleDelete = useCallback((id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this UPS model config?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const res = await deleteUpsModelConfig(id);
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
  }, [loadData, deleteUpsModelConfig, successMessage, errorMessage]);

  const handleExport = () => {
    const exportData = configData.map(item => ({
      ID: item.id,
      'Datacenter Name': item.datacenter_name,
      'Ups Name': item.ups_name,
      'Model Name': item.model_name,
    }));
    exportToCSV(exportData, 'ups_model_configs.csv');
  };

  const columns = useMemo(() => [
    { key: "id", header: "ID" },
    { key: "datacenter_name", header: "Datacenter Name" },
    { key: "ups_name", header: "Ups Name" },
    { key: "model_name", header: "Model Name" },
    {
      key: "actions",
      header: "Actions",
      isSortable: false,
      render: (v, row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button 
            className="data-table-btn-icon text-indigo-500 hover:text-indigo-700" 
            onClick={() => handleEdit(row.id)} 
            title="Edit Config"
          >
            <Edit size={16} />
          </button>
          <button 
            className="data-table-btn-icon text-red-500 hover:text-red-700" 
            onClick={() => handleDelete(row.id)} 
            title="Delete Config"
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

      <div className="ups-model-config-container">
        <UpsTabs />
        <header className="ups-model-config-header">
            <h2 className="text-xl font-bold">Ups Model Config</h2>
            <div className="d-flex gap-2">
                <Button
                    intent="primary"
                    leftIcon={Plus}
                    onClick={() => navigate('/admin/settings/ups-model-config-create')}
                >
                    Add New
                </Button>
                <Button
                    intent="secondary"
                    leftIcon={Download}
                    onClick={handleExport}
                    disabled={configData.length === 0}
                >
                    Export
                </Button>
            </div>
        </header>

        <div className="p-4 bg-white rounded-lg shadow-sm">
            <DataTable
              title="Config Records"
              data={configData} 
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

export default UpsModelConfig;
