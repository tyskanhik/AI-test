import React, { forwardRef, useState, useRef, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale/ru';
import styles from './DatePicker.module.scss';

registerLocale('ru', ru as any);

interface DatePickerProps {
  label?: string;
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  width?: string | number;
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      label,
      value,
      onChange,
      placeholder = 'Выберите дату',
      className,
      error,
      minDate,
      maxDate,
      width = '100%',
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const datePickerRef = useRef<ReactDatePicker>(null);

    useEffect(() => {
      setDefaultLocale('ru');
    }, []);

    const handleInputClick = () => {
      setIsOpen(!isOpen);
    };

    const handleDateChange = (date: Date | null) => {
      onChange(date);
      setIsOpen(false);
    };

    const formatDisplayDate = (date: Date | null) => {
      if (!date) return placeholder;
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    };

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className || ''} ${
          error ? styles.error : ''
        }`}
        style={{ width: typeof width === 'number' ? `${width}px` : width }}
      >
        {label && <label className={styles.label}>{label}</label>}

        <div className={styles.inputWrapper}>
          <div
            className={styles.customInput}
            onClick={handleInputClick}
          >
            <span className={value ? styles.dateText : styles.placeholder}>
              {formatDisplayDate(value!)}
            </span>
          </div>

          {isOpen && (
            <ReactDatePicker
              ref={datePickerRef}
              selected={value}
              onChange={handleDateChange}
              open={isOpen}
              onCalendarClose={() => setIsOpen(false)}
              minDate={minDate}
              maxDate={maxDate}
              inline
              locale="ru"
              calendarClassName={styles.calendar}
              wrapperClassName={styles.datePickerWrapper}
              onClickOutside={() => setIsOpen(false)}
              shouldCloseOnSelect={true}
            />
          )}
        </div>

        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';