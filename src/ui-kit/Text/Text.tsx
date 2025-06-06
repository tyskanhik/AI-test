import React from 'react';
import styles from './Text.module.scss';
import classNames from 'classnames';

// Типы для вариантов текста
type TextVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'  // Заголовки
  | 'body' | 'caption';          // Текстовые варианты

// Типы для начертания
type TextWeight = 
  | 'thin'       // 100
  | 'light'      // 300
  | 'regular'    // 400
  | 'medium'     // 500
  | 'bold'       // 700
  | 'black';     // 900

interface TextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  color?: string;        // HEX, RGB или название цвета
  weight?: TextWeight;
  size?: string | number; // Можно указать px, rem, em
  lineHeight?: string | number;
  className?: string;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  children,
  color,
  weight = 'regular',
  size,
  lineHeight,
  className,
  align = 'left',
  style,
}) => {
  // Определяем HTML-тег на основе variant
  const Tag = variant.startsWith('h') 
    ? variant 
    : variant === 'body' 
      ? 'p' 
      : 'span';

  // Собираем стили
  const textStyle = {
    ...(color && { color }),
    ...(size && { 
      fontSize: typeof size === 'number' ? `${size}px` : size 
    }),
    ...(lineHeight && { 
      lineHeight: typeof lineHeight === 'number' 
        ? `${lineHeight}px` 
        : lineHeight 
    }),
    ...style,
  };

  // Собираем классы
  const textClasses = classNames(
    styles.text,
    styles[`text--${variant}`],
    styles[`text--${weight}`],
    styles[`text--align-${align}`],
    className
  );

  return (
    <Tag 
      className={textClasses}
      style={textStyle}
    >
      {children}
    </Tag>
  );
};