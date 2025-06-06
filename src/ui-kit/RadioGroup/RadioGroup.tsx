import React from 'react';
import styles from './RadioGroup.module.scss';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selectedValue?: string;
  onChange: (value: string) => void;
  label?: string;
  direction?: 'horizontal' | 'vertical';
  className?: string;
  optionClassName?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  selectedValue,
  onChange,
  label,
  direction = 'vertical',
  className,
  optionClassName,
}) => {
  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {label && <div className={styles.groupLabel}>{label}</div>}
      
      <div className={`${styles.options} ${styles[direction]}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`${styles.radioLabel} ${optionClassName || ''} ${
              option.disabled ? styles.disabled : ''
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => handleChange(option.value)}
              disabled={option.disabled}
              className={styles.radioInput}
            />
            <span 
              className={styles.customRadio}
            />
            <span className={styles.radioText}>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};