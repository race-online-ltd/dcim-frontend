import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import { fetchUps, createUps, updateUps } from '../../api/settings/upsApi';
import { successMessage, errorMessage } from '../../api/api-config/apiResponseMessage';

const buttonStyles = `
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 1rem;
  min-height: 3rem;
  font-size: 0.875rem; 
  line-height: 1.25rem;
  border-radius: 0.5rem; 
  border-width: 1px;
  border-style: solid;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  font-weight: 600; 
}

:root {
  --btn-primary: #3b82f6; 
  --btn-secondary: #f97316; 
  --base-content: #1f2937; 
  --base-200: #f3f4f6; 
  --base-300: #e5e7eb; 
  --btn-danger: #ef4444; 
}

.btn--primary {
  background-color: var(--btn-primary);
  border-color: var(--btn-primary);
  color: white;
}
.btn--primary:hover {
  background-color: #2563eb; 
  border-color: #2563eb;
}

.btn--secondary {
  background-color: var(--base-200);
  border-color: var(--base-300);
  color: var(--base-content);
}
.btn--secondary:hover {
  background-color: var(--base-300); 
  border-color: var(--base-300);
}

.btn--ghost {
  background-color: transparent;
  border-color: transparent;
  color: var(--base-content);
}
.btn--ghost:hover {
  background-color: var(--base-200);
}

.btn[disabled], [aria-disabled="true"] {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}
.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  animation: spin 1s ease-in-out infinite;
  display: inline-block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`;

const formLayoutStyles = `
.form-container {
    width: 100%;
    min-height: 100vh;
    padding: 24px;
    background-color: #fff;
}

.form-header {
    margin-bottom: 40px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}

.form-title-group h1 {
    font-size: 30px;
    font-weight: 800;
    color: #1f2937;
    display: flex;
    align-items: center;
}

.form-title-group p {
    font-size: 14px;
    color: #6b7280;
    margin-top: 4px;
    margin-left: 40px;
}

.header-back-button {
    color: #1f2937 !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    margin-left: -16px; 
    padding: 0 4px;
    min-height: 30px;
    line-height: 30px;
}
.header-back-button:hover {
    background-color: transparent !important;
    text-decoration: none;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px 56px;
}

@media (min-width: 768px) { 
    .form-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

.form-group label {
    display: block;
    font-size: 0.875rem; 
    font-weight: 500;
    color: #374151; 
    margin-bottom: 4px; 
}

.form-control {
    width: 100%;
    padding: 0.75rem; 
    border: 1px solid #d1d5db; 
    border-radius: 0.375rem; 
    box-sizing: border-box;
    font-size: 1rem;
}

.alert-danger {
    color: var(--btn-danger);
    background-color: #fef2f2; 
    border: 1px solid #fca5a5; 
    padding: 1rem;
    border-radius: 0.375rem;
    margin-bottom: 24px;
}

.form-actions {
    grid-column: 1 / -1; 
    display: flex;
    justify-content: flex-end; 
    gap: 16px; 
    padding-top: 24px; 
    border-top: 1px solid #e5e7eb; 
    margin-top: 24px; 
}
`;

const UpsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ups, setUps] = useState({
    name: '',
    ip: '',
    slave_id: '',
  });
  const [loading, setLoading] = useState(false);

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      const loadUps = async () => {
        try {
          const data = await fetchUps(id);
          setUps({
            name: data.name || '',
            ip: data.ip || '',
            slave_id: data.slave_id || '',
          });
        } catch (err) {
          console.error('Failed to load UPS data:', err);
        }
      };
      loadUps();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUps((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let res;
      if (isEditMode) {
        res = await updateUps(id, ups);
      } else {
        res = await createUps(ups);
      }
      successMessage(res);
      navigate('/admin/settings/ups');
    } catch (err) {
      errorMessage(err);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/settings/ups');
  };

  const formTitle = isEditMode ? 'Edit UPS Details' : 'UPS Registration';
  const formSubtitle = isEditMode
    ? 'Modify the existing UPS details.'
    : 'Register a new UPS for monitoring.';

  return (
    <>
      <style>{buttonStyles}</style>
      <style>{formLayoutStyles}</style>

      <div className="form-container">
        <header className="form-header">
          <div className="form-title-group">
            <h1>
              <Button
                type="button"
                variant="ghost"
                leftIcon={ArrowLeft}
                onClick={handleCancel}
                className="header-back-button"
                aria-label="Back to UPS list"
              >
              </Button>
              {formTitle}
            </h1>
            <p>{formSubtitle}</p>
          </div>
        </header>


        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={ups.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ip">IP Address</label>
              <input
                type="text"
                id="ip"
                name="ip"
                value={ups.ip}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="slave_id">Slave Id</label>
              <input
                type="text"
                id="slave_id"
                name="slave_id"
                value={ups.slave_id}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <Button type="button" intent="secondary" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              intent="primary"
              loading={loading}
              loadingText={isEditMode ? 'Updating...' : 'Saving...'}
              disabled={loading}
            >
              {isEditMode ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpsForm;
