import React from 'react';
import Select from 'react-select';

const MultiSelectField = ({
  options,
  field,
  form,
  placeholder = 'Select...',
  isMulti = true,
  isLoading = false,
}) => {
  const onChange = (option) => {
    form.setFieldValue(
      field.name,
      isMulti
        ? option ? option.map((item) => item.value) : []
        : option ? option.value : ''
    );
  };

  const getValue = () => {
    if (options) {
      return isMulti
        ? options.filter((option) => field.value.indexOf(option.value) >= 0)
        : options.find((option) => option.value === field.value);
    } else {
      return isMulti ? [] : '';
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '3rem',
      borderRadius: '0.375rem',
      border: state.isFocused ? '1px solid #3b82f6' : '1px solid #d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        border: '1px solid #d1d5db',
      },
      padding: '2px 0',
      fontSize: '1rem',
      backgroundColor: '#fff',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 0.75rem',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#6b7280',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#eff6ff',
      borderRadius: '0.25rem',
      border: '1px solid #bfdbfe',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#1e40af',
      fontSize: '0.875rem',
      padding: '2px 6px',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#1e40af',
      '&:hover': {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        cursor: 'pointer',
      },
    }),
  };

  return (
    <Select
      classNamePrefix="react-select"
      options={options}
      isMulti={isMulti}
      onChange={onChange}
      placeholder={placeholder}
      value={getValue()}
      styles={customStyles}
      isLoading={isLoading}
      onBlur={field.onBlur}
    />
  );
};

export default MultiSelectField;
