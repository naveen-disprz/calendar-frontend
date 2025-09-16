// src/components/CustomInput.js
import React from 'react';
import styles from './CustomInput.module.sass'; // Ensure you have a corresponding Sass file for styling

const CustomInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  autoComplete,
  error,
  ...rest // Capture any additional props
}) => {
  return (
    <div className={styles.field}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={error ? styles.inputError : ''}
        {...rest} // Spread additional props onto the input element
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default CustomInput;
