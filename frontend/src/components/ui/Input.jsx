import React from 'react';

const Input = ({ label, name, type, formik, rows, placeholder }) => {
  const { touched, errors, handleChange, handleBlur, values } = formik;

  // Determine whether the input is valid or has been touched
  const isError = touched[name] && errors[name];
  
  return (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[name]}
          className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isError ? 'border-red-500' : 'border-gray-300'}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[name]}
          className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isError ? 'border-red-500' : 'border-gray-300'}`}
        />
      )}

      {/* Display Error Message */}
      {isError && (
        <div className="absolute text-xs text-red-500 mt-1">{errors[name]}</div>
      )}
    </div>
  );
};

export default Input;
