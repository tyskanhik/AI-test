import React from 'react';
import styles from './Button.module.scss';

// Типы для цветовых вариантов кнопки
type ButtonColor = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'danger' 
  | 'warning'
  | 'custom';

// Пропсы компонента
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  width?: string | number;
  height?: string | number;
  color?: ButtonColor;
  customColor?: string; // Для color='custom'
  borderRadius?: string | number;
  fontSize?: string | number;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  width = 'auto',
  height = '44px',
  color = 'primary',
  customColor,
  borderRadius = '22px', 
  fontSize = '16px',
  disabled = false,
  icon,
  iconPosition = 'left',
  onClick,
  ...props
}) => {
  // Стили для кнопки
  const buttonStyles = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
     borderRadius: typeof borderRadius === 'number' 
      ? `${borderRadius}px` 
      : borderRadius,
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    ...(color === 'custom' && customColor 
      ? { backgroundColor: customColor } 
      : {}),
  };

  // Определяем классы для кнопки
  const buttonClasses = [
    styles.button,
    styles[`button--${color}`],
    disabled ? styles['button--disabled'] : ''
  ].join(' ');

  return (
    <button
      className={buttonClasses}
      style={buttonStyles}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={styles.iconLeft}>{icon}</span>
      )}
      {text}
      {icon && iconPosition === 'right' && (
        <span className={styles.iconRight}>{icon}</span>
      )}
    </button>
  );
};