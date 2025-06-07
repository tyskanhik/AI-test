import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui-kit/Button/Button';
import styles from './NotFoundPage.module.scss';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>Страница не найдена</p>
        <p className={styles.text}>
          Возможно, эта страница была удалена или вы перешли по неверной ссылке
        </p>
        <Button
          text="Вернуться на главную"
          onClick={handleGoHome}
          color="primary"
          width={220}
        />
      </div>
    </div>
  );
};