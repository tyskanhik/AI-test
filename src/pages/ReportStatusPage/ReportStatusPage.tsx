import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../ui-kit/Button/Button';
import { Text } from '../../ui-kit/Text/Text';
import { Loader } from '../../ui-kit/Loader/Loader';
import { Notification } from '../../ui-kit/Notification/Notification';
import styles from './ReportStatusPage.module.scss';
import { checkReportStatus } from '../../mocks/mockApi';

export const ReportStatusPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const taskId = location.state?.taskId;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const fetchReportData = async () => {
    try {
      const response = await checkReportStatus(taskId);
      
      if (response.status === 'ready') {
        clearTimers();
        setStatus('ready');
        setReportData(response.report);
      }
    } catch (err) {
      handleLoadError();
    }
  };

  const handleLoadError = () => {
    clearTimers();
    setStatus('error');
    setError('Не удалось загрузить отчет. Пожалуйста, попробуйте позже.');
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(handleLoadError, 30000);
    
    fetchReportData();

    return () => {
      clearTimers();
    };
  }, []);

  const handleRetry = () => {
    setStatus('loading');
    setError(null);
  };

  const renderScoreBar = (score: number) => {
    const filled = '■'.repeat(Math.round(score / 5));
    const empty = '□'.repeat(5 - Math.round(score / 5));
    return filled + empty;
  };

  if (!taskId) {
    return (
      <div className={styles.container}>
        <Text variant="h2">Ошибка: отсутствует идентификатор задачи</Text>
        <Button text="Вернуться на главную" onClick={() => navigate('/')} />
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <Text variant="h2">Анализ в процессе...</Text>
        <Text>Пожалуйста, подождите. Мы анализируем данные и готовим отчет.</Text>
        <Loader size={100} />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.container}>
        <Notification variant="error" width="50%">
          {error}
        </Notification>
        <div className={styles.buttons}>
          <Button 
            text="Вернуться на главную" 
            onClick={() => navigate('/')} 
            color="primary"
          />
          <Button 
            text="Попробовать снова" 
            onClick={handleRetry}
            color="secondary"
          />
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className={styles.container}>
        <Text variant="h2">Данные отчета не загружены</Text>
        <Button text="Попробовать снова" onClick={handleRetry} />
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${styles.reportView}`}>
      <Text variant="h2">📚 Краткая сводка</Text>
      
      <ul className={styles.summaryList}>
        <li><strong>Имя ребёнка:</strong> {reportData.childName}</li>
        <li><strong>Главное качество (рисунок "Дом"):</strong> {reportData.mainQualities.house}</li>
        <li><strong>Основная черта (рисунок "Животное"):</strong> {reportData.mainQualities.animal}</li>
        <li><strong>Самооценка (автопортрет):</strong> {reportData.mainQualities.portrait}</li>
      </ul>

      <hr className={styles.divider} />

      <Text variant="h2">🔍 Развёрнутые разделы</Text>

      <Text variant="h3">1. Дом-Дерево-Человек: ключевые наблюдения</Text>
      
      <Text className={styles.conclusionText}>
        <strong>Общий вывод:</strong> {reportData.detailedSections.houseTreePerson.generalConclusion}
      </Text>

      <Text variant="h3">2. Животное: детали и фантазия</Text>
      
      <Text className={styles.conclusionText}>
        <strong>Вывод:</strong> {reportData.detailedSections.animal.conclusion}
      </Text>

      <Text variant="h3">3. Автопортрет: особенности самовосприятия</Text>
      
      <Text className={styles.conclusionText}>
        <strong>Вывод:</strong> {reportData.detailedSections.selfPortrait.conclusion}
      </Text>

      <Text variant="h3" className={styles.subsectionTitle}>4. Опросник: суммарные баллы и профиль</Text>
      
      <table className={styles.scoresTable}>
        <thead>
          <tr>
            <th>Шкала</th>
            <th>Баллы (из 25)</th>
            <th>График</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Эмоциональная устойчивость</td>
            <td>{reportData.scores.emotionalStability}</td>
            <td className={styles.scoreBar}>{renderScoreBar(reportData.scores.emotionalStability)}</td>
          </tr>
          <tr>
            <td>Социальная адаптация</td>
            <td>{reportData.scores.socialAdaptation}</td>
            <td className={styles.scoreBar}>{renderScoreBar(reportData.scores.socialAdaptation)}</td>
          </tr>
          <tr>
            <td>Саморегуляция</td>
            <td>{reportData.scores.selfRegulation}</td>
            <td className={styles.scoreBar}>{renderScoreBar(reportData.scores.selfRegulation)}</td>
          </tr>
          <tr>
            <td>Коммуникативность</td>
            <td>{reportData.scores.communication}</td>
            <td className={styles.scoreBar}>{renderScoreBar(reportData.scores.communication)}</td>
          </tr>
          <tr>
            <td>Самооценка</td>
            <td>{reportData.scores.selfEsteem}</td>
            <td className={styles.scoreBar}>{renderScoreBar(reportData.scores.selfEsteem)}</td>
          </tr>
        </tbody>
      </table>

      <hr className={styles.divider} />

      <Text variant="h2">📖 Рекомендации для родителей</Text>
      
      <ul className={styles.recommendationsList}>
        <li>Чаще хвалите ребёнка за конкретные действия, а не только за результат</li>
        <li>Помогайте называть чувства: "Ты расстроился, потому что..."</li>
        <li>Поддерживайте инициативу, даже если ребёнок ошибается</li>
        <li>Создавайте спокойную и предсказуемую атмосферу дома</li>
        <li>Поощряйте фантазию — сказки, рисунки, игры по ролям</li>
      </ul>

      <div className={styles.buttons}>
        <Text>Шаг 3/3</Text>
        <Button 
          text="Вернуться на главную" 
          onClick={() => navigate('/')}
          color="primary"
        />
      </div>
    </div>
  );
};