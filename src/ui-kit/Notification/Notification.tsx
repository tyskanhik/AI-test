import React from 'react';
import styles from './Notification.module.scss';
import classNames from 'classnames';
import { Text } from '../Text/Text'; // Используем наш текстовый компонент

type NotificationVariant = 
  | 'info'
  | 'masseges'
  | 'success'
  | 'warning'
  | 'error'
  | 'custom';

interface NotificationProps {
  variant?: NotificationVariant;
  children: React.ReactNode;
  borderRadius?: number | string;
  width?: number | string;
  backgroundColor?: string; // Для variant="custom"
  textColor?: string;      // Для variant="custom"
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
  closable?: boolean;
}

export const Notification: React.FC<NotificationProps> = ({
  variant = 'info',
  children,
  borderRadius = 8,
  width = 20,
  backgroundColor,
  textColor,
  className,
  style,
  onClose,
  closable = false,
}) => {
  const isCustom = variant === 'custom';

  const notificationStyle = {
    ...(isCustom && backgroundColor ? { backgroundColor } : {}),
    ...(isCustom && textColor ? { color: textColor } : {}),
    borderRadius: typeof borderRadius === 'number' 
      ? `${borderRadius}px` 
      : borderRadius,
    ...style,
    width: typeof width === 'number' ? `${width}vw` : width
  };

  const notificationClasses = classNames(
    styles.notification,
    styles[`notification--${variant}`],
    className
  );

  return (
    <div 
      className={notificationClasses}
      style={notificationStyle}
    >
      <div className={styles.content}>
        {typeof children === 'string' ? (
          <Text color={isCustom ? textColor : undefined}>{children}</Text>
        ) : (
          children
        )}
      </div>

      {closable && (
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close notification"
        >
          &times;
        </button>
      )}
    </div>
  );
};