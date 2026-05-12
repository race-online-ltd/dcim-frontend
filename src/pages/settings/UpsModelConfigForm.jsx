import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import { fetchUpsModelConfig, createUpsModelConfig, updateUpsModelConfig } from '../../api/settings/upsModelConfigApi';
import { fetchUpsList } from '../../api/settings/upsApi';
import { fetchUpsModels } from '../../api/settings/upsModelApi';
import { fetchDataCenters } from '../../api/settings/dataCenterApi';

const UpsModelConfigSchema = Yup.object().shape({
  ups_id: Yup.string().required('UPS is required'),
  model_id: Yup.string().required('Model is required'),
  datacenter_id: Yup.string().required('Datacenter is required'),
});

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

.text-danger {
    color: var(--btn-danger);
    font-size: 0.875rem; 
    margin-top: 4px;
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

const UpsModelConfigForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    ups_id: '',
    model_id: '',
    datacenter_id: '',
  });
  const [upsList, setUpsList] = useState([]);
  const [upsModels, setUpsModels] = useState([]);
  const [datacenters, setDatacenters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isEditMode = !!id;

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [upsData, modelData, dcData] = await Promise.all([
          fetchUpsList(),
          fetchUpsModels(),
          fetchDataCenters(),
        ]);
        setUpsList(upsData);
        setUpsModels(modelData);
        setDatacenters(dcData);

        if (isEditMode) {
          const data = await fetchUpsModelConfig(id);
          setInitialValues({
            ups_id: data.ups_id || '',
            model_id: data.model_id || '',
            datacenter_id: data.datacenter_id || '',
          });
        }
      } catch (err) {
        console.error('Failed to load form data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadOptions();
  }, [id, isEditMode]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const dataToSend = {
        ups_id: Number(values.ups_id),
        model_id: Number(values.model_id),
        datacenter_id: Number(values.datacenter_id),
      };

      if (isEditMode) {
        await updateUpsModelConfig(id, dataToSend);
      } else {
        await createUpsModelConfig(dataToSend);
      }
      navigate('/admin/settings/ups-model-config');
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/settings/ups-model-config');
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  const formTitle = isEditMode ? 'Edit UPS Model Config' : 'UPS Model Config Registration';
  const formSubtitle = isEditMode
    ? 'Modify the existing config details.'
    : 'Register a new UPS model config.';

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
                aria-label="Back to config list"
              >
              </Button>
              {formTitle}
            </h1>
            <p>{formSubtitle}</p>
          </div>
        </header>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={UpsModelConfigSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="form-grid">
              <div className="form-group">
                <label htmlFor="ups_id">UPS Name</label>
                <Field
                  as="select"
                  id="ups_id"
                  name="ups_id"
                  className="form-control"
                >
                  <option value="">Select UPS</option>
                  {upsList.map((ups) => (
                    <option key={ups.id} value={ups.id}>
                      {ups.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="ups_id" component="div" className="text-danger" />
              </div>

              <div className="form-group">
                <label htmlFor="model_id">Model Name</label>
                <Field
                  as="select"
                  id="model_id"
                  name="model_id"
                  className="form-control"
                >
                  <option value="">Select Model</option>
                  {upsModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="model_id" component="div" className="text-danger" />
              </div>

              <div className="form-group">
                <label htmlFor="datacenter_id">Datacenter Name</label>
                <Field
                  as="select"
                  id="datacenter_id"
                  name="datacenter_id"
                  className="form-control"
                >
                  <option value="">Select Datacenter</option>
                  {datacenters.map((dc) => (
                    <option key={dc.id} value={dc.id}>
                      {dc.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="datacenter_id" component="div" className="text-danger" />
              </div>

              <div className="form-actions">
                <Button type="button" intent="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  intent="primary"
                  loading={isSubmitting}
                  disabled={isSubmitting || !isValid}
                >
                  {isEditMode ? 'Update' : 'Save'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

const ErrorMessage = ({ name, component, className }) => (
  <Field name={name}>
    {({ meta }) => meta.touched && meta.error ? (
      React.createElement(component || 'div', { className }, meta.error)
    ) : null}
  </Field>
);

export default UpsModelConfigForm;
