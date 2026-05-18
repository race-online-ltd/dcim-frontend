

// export default RoleList;
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { usePermissions } from "../context/PermissionContext";
import { apiClient } from "../api/api-config/config";
import DataTable from "../components/table/DataTable"; 
import Button from "../components/ui/Button"; // Use the standard Button component
import { Plus, Pencil, Trash2, Eye, Edit, RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import ExportButton from "../components/ui/ExportButton"; 
import { FaFileExcel } from 'react-icons/fa'; 

// 🔑 NEW: A consolidated style block to match the modern KAM dashboard aesthetic 
// and fix the button outline issue.
const styles = {
    // Mimics p-4 lg:p-6
    container: {
        padding: '1.5rem', 
        backgroundColor: 'white',
    },
    // Header section styling
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #e5e7eb',
    },
    title: {
        fontSize: '1.875rem', 
        fontWeight: '800', 
        color: '#111827', 
        lineHeight: '2.25rem',
    },
    subtitle: {
        fontSize: '0.875rem', 
        color: '#6b7280', 
    },
    actions: {
        display: 'flex',
        gap: '0.5rem',
        paddingRight: '1.5rem',
    }
};

// 🔑 NEW: CSS for the Icon Buttons to fix the border/outline issue
const iconButtonStyles = `
    .data-table-btn-icon {
        background: transparent;
        border: none;
        padding: 0.25rem; /* Small padding around the icon */
        cursor: pointer;
        transition: background-color 0.15s ease-in-out;
        /* --- FIXES THE CARTOONISH BORDER --- */
        outline: none; 
        box-shadow: none;
        /* ----------------------------------- */
    }
    .data-table-btn-icon:hover {
        background-color: #f3f4f6; /* Light gray background on hover */
        border-radius: 0.25rem;
    }
    .data-table-btn-icon:focus {
        outline: 2px solid #6366f1; /* Custom focus ring for accessibility */
        outline-offset: 2px;
        box-shadow: none;
    }
`;

const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [syncingRoute, setSyncingRoute] = useState(false);

    const [tableParams, setTableParams] = useState({
        page: 1,
        pageSize: 10,
        search: "",
        sort: "id",
        sort_dir: "asc",
    });

    const permissions = usePermissions();
    const canDeleteRole = permissions.includes("role-delete");
    const canCreateRole = permissions.includes("role-create");
    const canShowRole = permissions.includes("role-show"); 
    const canEditRole = permissions.includes("role-edit");

    // --- Data Fetching Logic (Server-Side Pagination) ---
    const fetchRoles = useCallback(async (params) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");
            
            const queryParams = new URLSearchParams({
                page: params.page,
                per_page: params.pageSize,
                search: params.search,
                sort: params.sort,
                sort_dir: params.sort_dir,
            }).toString();

            const response = await apiClient.get(`/roles?${queryParams}`, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });

            setRoles(response.data.data);
            setTotalRows(response.data.total || 0); 

        } catch (error) {
            console.error("Error fetching roles:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles(tableParams);
    }, [fetchRoles, tableParams]); 

    // --- Action Handlers ---
    const handleDelete = (id) => {
        confirmAlert({
            title: "Confirm to delete",
            message: "Are you sure you want to delete this role?",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => {
                        try {
                            const token = localStorage.getItem("access_token");
                            await apiClient.delete(`/roles/${id}`, {
                                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
                            });
                            fetchRoles(tableParams); 
                        } catch (error) {
                            console.error("Error deleting role:", error);
                        }
                    },
                },
                { label: "No" },
            ],
        });
    };

    const handleFilterChange = (newParams) => {
        setTableParams(prev => ({ 
            ...prev, 
            ...newParams, 
            page: 1, 
        }));
    };
    
    const handlePageSizeChange = (newSize) => {
        setTableParams(prev => ({
            ...prev,
            pageSize: newSize,
            page: 1,
        }));
    };

    const handlePageChange = (newPage) => {
        setTableParams(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleSyncRoute = async () => {
        try {
            setSyncingRoute(true);
            const token = localStorage.getItem("access_token");
            const response = await apiClient.get(`/my-new-endpoint`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            toast.success(response?.data?.message || "Route synced successfully.");
        } catch (error) {
            console.error("Error syncing route:", error);
            const message = error?.response?.data?.message || error.message || "Sync failed.";
            toast.error(`Route sync failed: ${message}`);
        } finally {
            setSyncingRoute(false);
        }
    };
    
    // --- DATATABLE COLUMN CONFIGURATION ---
    const columns = useMemo(() => [
        { key: "id", header: "ID", isSortable: true },
        { key: "name", header: "Role Name", isSortable: true },
        {
            key: "actions",
            header: "Actions",
            isSortable: false,
            render: (v, role) => (
                <div className="flex justify-start gap-2">
                    {canShowRole && (
                        <Link to={`/admin/roles/${role.id}`} title="Show Details">
                            <button className="data-table-btn-icon">
                                <Eye className="h-4 w-4 text-blue-500 hover:text-blue-700" />
                            </button>
                        </Link>
                    )}
                    {canEditRole && (
                        <Link to={`/admin/roles/${role.id}/edit`} title="Edit Role">
                             <button className="data-table-btn-icon">
                                <Edit size={16} />
                            </button>
                        </Link>
                    )}
                    {canDeleteRole && (
                        <button 
                            className="data-table-btn-icon" 
                            onClick={() => handleDelete(role.id)}
                            title="Delete Role"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            ),
        },
    ], [canShowRole, canEditRole, canDeleteRole, handleDelete]);
    // --- END DATATABLE COLUMN CONFIGURATION ---

    if (loading && roles.length === 0) {
        return (
             <div style={styles.container} className="flex justify-center items-center py-20 text-gray-500">
                <p>Loading Role Management data...</p>
             </div>
        );
    }

    return (
        // 🔑 1. Apply the inline CSS styles for the icon buttons
        <>
            <style>{iconButtonStyles}</style>
            
            {/* 1. Page Container */}
            <div style={styles.container}> 
                {/* 2. Header Section */}
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.title}>
                            Role Management
                        </h1>
                        <p style={styles.subtitle}>
                            View and manage user roles and permissions.
                        </p>
                    </div>
                    
                    {/* 2. Right (Actions) */}
                    <div style={styles.actions}>
                        <ExportButton 
                            data={roles} 
                            columns={columns} 
                            fileName="roles_export" 
                            intent="primary" 
                            leftIcon={FaFileExcel} 
                            className="text-white bg-green-700 hover:bg-green-800 border-none"
                        >
                            Export
                        </ExportButton>
                        
                        {canCreateRole && (
                            <Link to="/admin/roles/create">
                                <Button intent="primary" leftIcon={Plus}>
                                    Add Role
                                </Button>
                            </Link>
                        )}
                        <Button
                            intent="secondary"
                            leftIcon={RefreshCcw}
                            onClick={handleSyncRoute}
                            disabled={syncingRoute}
                        >
                            {syncingRoute ? "Syncing..." : "Sync Route"}
                        </Button>
                    </div>
                </header>

                {/* 3. Data Presentation - DataTable */}
                <DataTable
                    title="Role List"
                    data={roles}
                    columns={columns}
                    isBackendPagination={true}
                    totalRows={totalRows}
                    page={tableParams.page}
                    pageSize={tableParams.pageSize}
                    setPage={handlePageChange} 
                    setPageSize={handlePageSizeChange} 
                    onFilterChange={handleFilterChange} 
                    initialSort={{ key: tableParams.sort, dir: tableParams.sort_dir }} 
                    searchable={true}
                    showId={true} 
                    selection={false}
                    pageSizeOptions={[5, 10, 25, 50]} 
                    initialPageSize={10}
                />
            </div>
        </>
    );
};

export default RoleList;