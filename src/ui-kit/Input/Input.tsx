import React from 'react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  width?: number | string;
  height?: number | string;
  error?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
}

export const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ 
    label, 
    width = 300, 
    height = 'auto',
    error, 
    fullWidth = false, 
    multiline = false,
    rows = 3,
    className, 
    ...props 
  }, ref) => {
    const inputStyles = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      minHeight: multiline ? (typeof height === 'number' ? `${height}px` : height) : 'auto'
    };

    const inputClasses = [
      styles.input,
      error && styles.error,
      fullWidth && styles.fullWidth,
      multiline && styles.textarea,
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={styles.container} style={{ width: inputStyles.width }}>
        {label && <label className={styles.label}>{label}</label>}
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={inputClasses}
            style={{ height: inputStyles.height, minHeight: inputStyles.minHeight }}
            rows={rows}
            {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            className={inputClasses}
            {...props as React.InputHTMLAttributes<HTMLInputElement>}
          />
        )}
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';