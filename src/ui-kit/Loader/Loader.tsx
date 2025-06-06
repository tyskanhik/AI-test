import React from 'react';
import styles from './Loader.module.scss';

interface LoaderProps {
  size?: number | string;
  color?: string;
  topColor?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 40,
  color = '#4e7fff',
  topColor = '#000',
  className
}) => {
  const loaderStyle = {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
    borderColor: color,
    borderTopColor: topColor
  };

  return (
    <div className={`${styles.loader} ${className || ''}`} style={loaderStyle}>
      <div className={styles.inner}></div>
    </div>
  );
};