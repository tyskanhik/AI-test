import React from 'react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  width?: number | string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, width = 300, error, fullWidth = false, className, ...props }, ref) => {
    const inputStyles = {
        width: typeof width === 'number' ? `${width}px` : width,
    }
    const inputClasses = [
      styles.input,
      error && styles.error,
      fullWidth && styles.fullWidth,
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={styles.container} style={inputStyles}>
        {label && <label className={styles.label}>{label}</label>}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';