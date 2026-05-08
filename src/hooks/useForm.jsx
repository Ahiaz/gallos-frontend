/*
Hook: useForm.jsx
Descripción: Hook personalizado para el formulario de boostrap
Autor: Jose Ahias Vargas
*/

import { useState } from "react";

const useForm = (initialState = {}, validateFn = null) => {
  const [formValues, setFormValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    setFormValues(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Limpia error cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validate = () => {
    if (!validateFn) return true;

    const validationErrors = validateFn(formValues);
    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (callback) => (e) => {
    e.preventDefault();

    if (validate()) {
      callback(formValues);
    }
  };

  const resetForm = () => {
    setFormValues(initialState);
    setErrors({});
  };

  return {
    formValues,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm,
    setFormValues,
    setErrors
  };
};

export default useForm;