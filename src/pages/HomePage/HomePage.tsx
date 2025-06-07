import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui-kit/Button/Button';
import styles from './HomePage.module.scss';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/upload');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        ИИ-психодиагностика эмоционального состояния ребенка
      </h1>
      
      <div className={styles.content}>
        <p className={styles.description}>
          Наш тест поможет оценить психоэмоциональное состояние вашего ребенка 
          через анализ рисунков. Для точного результата потребуется загрузить 
          3 рисунка и ответить на несколько вопросов.
        </p>
        
        <div className={styles.imagePlaceholder}>
          <span>Пример рисунка</span>
        </div>
        
        <div className={styles.instructions}>
          <p className={styles.instructionsTitle}>Подготовьте:</p>
          <ul className={styles.instructionsList}>
            <li>Рисунок "Дом, дерево, человек"</li>
            <li>Рисунок несуществующего животного</li>
            <li>Автопортрет ребенка</li>
          </ul>
        </div>
        
        <Button 
          text="Начать тест"
          onClick={handleStart}
          color="primary"
          width={200}
          height={50}
          borderRadius={25}
        />
      </div>
    </div>
  );
};