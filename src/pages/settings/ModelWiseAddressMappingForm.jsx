import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import { fetchModelWiseAddressMapping, createModelWiseAddressMapping, updateModelWiseAddressMapping } from '../../api/settings/modelWiseAddressMappingApi';
import { fetchUpsModels } from '../../api/settings/upsModelApi';
import { fetchRegisterAddresses } from '../../api/settings/registerAddressApi';

const ModelWiseAddressMappingSchema = Yup.object().shape({
  model_id: Yup.string().required('Model is required'),
  address_id: Yup.string().required('Address is required'),
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

const ModelWiseAddressMappingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    model_id: '',
    address_id: '',
  });
  const [upsModels, setUpsModels] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isEditMode = !!id;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [modelData, addressData] = await Promise.all([
          fetchUpsModels(),
          fetchRegisterAddresses(),
        ]);
        setUpsModels(modelData);
        setAddresses(addressData);

        if (isEditMode) {
          const data = await fetchModelWiseAddressMapping(id);
          setInitialValues({
            model_id: data.model_id || '',
            address_id: data.address_id || '',
          });
        }
      } catch (err) {
        console.error('Failed to load mapping data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, isEditMode]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const dataToSend = {
        model_id: Number(values.model_id),
        address_id: Number(values.address_id),
      };

      if (isEditMode) {
        await updateModelWiseAddressMapping(id, dataToSend);
      } else {
        await createModelWiseAddressMapping(dataToSend);
      }
      navigate('/admin/settings/model-wise-address-mapping');
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/settings/model-wise-address-mapping');
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  const formTitle = isEditMode ? 'Edit Model Wise Address Mapping' : 'Model Wise Address Mapping Registration';
  const formSubtitle = isEditMode
    ? 'Modify the existing mapping details.'
    : 'Register a new model wise address mapping.';

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
                aria-label="Back to mapping list"
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
          validationSchema={ModelWiseAddressMappingSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="form-grid">
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
                <label htmlFor="address_id">Address Name</label>
                <Field
                  as="select"
                  id="address_id"
                  name="address_id"
                  className="form-control"
                >
                  <option value="">Select Address</option>
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="address_id" component="div" className="text-danger" />
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

export default ModelWiseAddressMappingForm;
