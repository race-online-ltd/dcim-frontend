import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UpsTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'Ups', path: '/admin/settings/ups' },
    { name: 'Ups Model', path: '/admin/settings/ups-model' },
    { name: 'Register Address', path: '/admin/settings/register-address' },
    { name: 'Ups Model Config', path: '/admin/settings/ups-model-config' },
    { name: 'Model Wise Address Mapping', path: '/admin/settings/model-wise-address-mapping' },
  ];

  const getActiveTab = (pathname) => {
    if (pathname.includes('/admin/settings/ups-model-config')) return '/admin/settings/ups-model-config';
    if (pathname.includes('/admin/settings/model-wise-address-mapping')) return '/admin/settings/model-wise-address-mapping';
    if (pathname.includes('/admin/settings/ups-model')) return '/admin/settings/ups-model';
    if (pathname.includes('/admin/settings/register-address')) return '/admin/settings/register-address';
    if (pathname.includes('/admin/settings/ups')) return '/admin/settings/ups';
    return '';
  };

  const activePath = getActiveTab(location.pathname);

  return (
    <div className="card-header d-flex justify-content-start align-items-center mb-4" style={{ padding: '0.25rem 1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <div className="dashboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            role="tab"
            aria-selected={activePath === tab.path}
            className={`tab-item ${activePath === tab.path ? 'tab-active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="tab-text">{tab.name}</span>
            <span className="tab-indicator" aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
};

export default UpsTabs;
