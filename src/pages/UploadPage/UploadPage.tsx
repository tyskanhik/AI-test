import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setImage, uploadTaskImages } from '../../store/slices/taskSlice';
import { Text } from '../../ui-kit/Text/Text';
import { Notification } from '../../ui-kit/Notification/Notification';
import { ImageUploader } from '../../ui-kit/ImageUploader/ImageUploader';
import { Button } from '../../ui-kit/Button/Button';
import styles from './UploadPage.module.scss';
import icon from '../../assets/images/Icon.svg'
import next from '../../assets/images/Next.svg'

export const UploadPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { images, status, error } = useAppSelector((state) => state.task);

  const handleImageUpload = (type: keyof typeof images, file: File) => {
    dispatch(setImage({ type, file }));
  };

  const allImagesUploaded = Object.values(images).every(img => img !== null);

  const handleSubmit = async () => {
    if (!allImagesUploaded) return;
    
    const result = await dispatch(uploadTaskImages());
    
    if (uploadTaskImages.fulfilled.match(result)) {
      navigate('/survey');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div className={styles.progressFilled} style={{ width: '30%' }} />
        <div className={styles.progressEmpty} style={{ width: '70%' }} />
      </div>
      <div className={styles.containerContent}>
        <Text variant="h3" weight="bold" align="left" className={styles.title}>
          Загрузите фотографии рисунков
        </Text>
        
        <div className={styles.notificationWrapper}>
          <Notification variant="info" width={60}>
            <img src={icon} alt="Внимание" />Допустимые форматы файлов: jpg, jpeg, png, pdf. Размер не более 5 Мб
          </Notification>
        </div>

        <div className={styles.uploadGrid}>
          {/* Дом/Дерево/Человек */}
          <div className={styles.uploadBlock}>
            <ImageUploader
              onFileSelect={(file) => handleImageUpload('houseTreePerson', file)}
              uploadText="Дом/Дерево/Человек"
              height="clamp(150px, 20vw, 250px)"
            />
          </div>

          {/* Несуществующее животное */}
          <div className={styles.uploadBlock}>
            <ImageUploader
              onFileSelect={(file) => handleImageUpload('nonexistentAnimal', file)}
              uploadText="Несуществующее животное"
              height="clamp(150px, 20vw, 250px)"
            />
          </div>

          {/* Автопортрет */}
          <div className={styles.uploadBlock}>
            <ImageUploader
              onFileSelect={(file) => handleImageUpload('selfPortrait', file)}
              uploadText="Автопортрет"
              height="clamp(150px, 20vw, 250px)"
            />
          </div>
        </div>

        <div className={styles.footer}>
          <Text variant="body" color="muted">
            Шаг 1/3
          </Text>
          <Button
            text={status === 'loading' ? 'Отправка...' : 'Далее ' }
            onClick={handleSubmit}
            color="primary"
            width={200}
            disabled={!allImagesUploaded || status === 'loading'}
            icon={<img src={next} alt="Далее" />}
            iconPosition="right"
          />
        </div>
        
        {error && (
          <div className={styles.errorWrapper}>
            <Notification 
              variant="error" 
              closable
              width={20}
              onClose={() => dispatch({ type: 'task/clearError' })}
            >
              {error}
            </Notification>
          </div>
        )}
      </div>
    </div>
  );
};