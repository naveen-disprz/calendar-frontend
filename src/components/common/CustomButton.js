// src/components/CustomButton.js
import React from 'react';
import styles from './CustomButton.module.sass'; // Create a corresponding Sass file for styling

const CustomButton = ({
                          children,
                          onClick,
                          type = 'button',
                          disabled = false,
                          className = '',
                          variant = 'primary', // 'primary', 'secondary', etc.
                          ...rest
                      }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${styles.button} ${styles[variant]} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default CustomButton;
