import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import { fetchUpsModel, createUpsModel, updateUpsModel } from '../../api/settings/upsModelApi';
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

const UpsModelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [upsModel, setUpsModel] = useState({
    name: '',
    protocol: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      const loadUpsModel = async () => {
        try {
          const data = await fetchUpsModel(id);
          setUpsModel({
            name: data.name || '',
            protocol: data.protocol || '',
          });
        } catch (err) {
          setError('Failed to load UPS Model data: ' + err.message);
        }
      };
      loadUpsModel();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpsModel((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let res;
      if (isEditMode) {
        res = await updateUpsModel(id, upsModel);
      } else {
        res = await createUpsModel(upsModel);
      }
      successMessage(res);
      navigate('/admin/settings/ups-model');
    } catch (err) {
      errorMessage(err);
      setError('Save failed: ' + err.message);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/settings/ups-model');
  };

  const formTitle = isEditMode ? 'Edit UPS Model Details' : 'UPS Model Registration';
  const formSubtitle = isEditMode
    ? 'Modify the existing UPS Model details.'
    : 'Register a new UPS Model.';

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
                aria-label="Back to UPS Model list"
              >
              </Button>
              {formTitle}
            </h1>
            <p>{formSubtitle}</p>
          </div>
        </header>

        {error && <div className="alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={upsModel.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="protocol">Protocol</label>
              <input
                type="text"
                id="protocol"
                name="protocol"
                value={upsModel.protocol}
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

export default UpsModelForm;
