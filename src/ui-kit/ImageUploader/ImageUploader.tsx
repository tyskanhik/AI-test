import React, { useState, useRef, ChangeEvent } from 'react';
import styles from './ImageUploader.module.scss';
import { Loader } from '../Loader/Loader';
import { Text } from '../Text/Text';
import { Notification } from '../Notification/Notification';
import uploadIcon from '../../assets/images/UploadIcon.svg'
import replaceIcon from '../../assets/images/ReplaceIcon.svg'

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  uploadText?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  showReplaceIcon?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileSelect,
  uploadText = 'Нажмите для загрузки',
  className,
  width = 100,
  height = 100,
  borderRadius = 12,
  showReplaceIcon = true,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): boolean => {
    if (!validTypes.includes(file.type)) {
      setError('Допустимые форматы: JPG, PNG, PDF');
      return false;
    }

    if (file.size > maxSize) {
      setError('Максимальный размер файла: 5MB');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    try {
      setIsLoading(true);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }

      onFileSelect(file);
    } catch (err) {
      setError('Ошибка при загрузке файла');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const containerStyle = {
    width: typeof width === 'number' ? `${width}%` : width,
  };

  const uploadAreaStyle = {
    width: '100%',
    height: typeof height === 'number' ? `${height}%` : height,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
  };

  // Закрытие уведомления об ошибке
  const handleCloseError = () => setError(null);

  return (
    <div 
      className={`${styles.container} ${className || ''}`}
      style={containerStyle}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.pdf"
        className={styles.fileInput}
      />

      <div 
        className={styles.uploadArea}
        onClick={triggerFileInput}
        style={{
          ...uploadAreaStyle,
          backgroundImage: previewUrl ? `url(${previewUrl})` : undefined,
        }}
      >
        {isLoading ? (
          <Loader size={48} color="#4e7fff"/>
        ) : (
          <>
            {!previewUrl && (
              <div className={styles.uploadIcon}>
                <img src={uploadIcon} alt="Добавить" className={styles.icon} />
              </div>
            )}
            {previewUrl && showReplaceIcon && (
              <div className={styles.replaceIcon}>
                <img src={replaceIcon} alt="Заменить" className={styles.icon} />
              </div>
            )}
          </>
        )}
      </div>

      {uploadText && (
        <Text variant="body" align="center" className={styles.uploadText}>
          {uploadText}
        </Text>
      )}

      {/* Уведомление об ошибке */}
      {error && (
        <Notification 
          variant="error" 
          closable 
          onClose={handleCloseError}
          className={styles.errorNotification}
        >
          {error}
        </Notification>
      )}
    </div>
  );
};

// Иконка загрузки
// const UploadIcon = () => (
//   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//     <polyline points="17 8 12 3 7 8" />
//     <line x1="12" y1="3" x2="12" y2="15" />
//   </svg>
// );

// // Иконка замены
// const ReplaceIcon = () => (
//   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff">
//     <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9z" />
//     <path d="M12 8v8" />
//     <path d="M8 12h8" />
//   </svg>
// );