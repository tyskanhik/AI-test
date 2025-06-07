import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../ui-kit/Button/Button';
import { Text } from '../../ui-kit/Text/Text';
import { Loader } from '../../ui-kit/Loader/Loader';
import styles from './ReportStatusPage.module.scss';
import { checkReportStatus } from '../../api/Api';

// Моковые данные
const MOCK_DATA = {
  name: "Алексей",
  houseQuality: "Чувство защищённости и потребность в стабильности",
  animalTrait: "Воображение и наблюдательность",
  selfPortrait: "Склонность к самокритике, стремление к одобрению взрослых",
  details: {
    house: "Уютный, с окнами, дымом, забором",
    tree: "С корнями, пышная крона",
    person: "Маленький, руки прижаты, без эмоций",
    animal: "Фантастическое или символическое существо (например, лиса с крыльями)",
    portrait: "Маленький — возможна заниженная самооценка"
  },
  scores: {
    emotionalStability: 14,
    socialAdaptation: 16,
    selfRegulation: 12,
    communicativeness: 18,
    selfEsteem: 11
  }
};

export const ReportStatusPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'ready' | 'error'>('processing');
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const taskId = location.state?.taskId;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!taskId) {
      navigate('/');
      return;
    }

    const switchToMockData = () => {
      clearAllTimers();
      setUsingMockData(true);
      setStatus('ready');
      setError('Сервер не отвечает, показаны демонстрационные данные');
    };

    // Таймер для моковых данных (30 секунд)
    timeoutRef.current = setTimeout(switchToMockData, 1500);

    const checkStatus = async () => {
      try {
        const response = await checkReportStatus(taskId);
        
        if (response.status === 'ready') {
          clearAllTimers();
          setStatus('ready');
          setPdfUrl(response.pdf_url);
        }
      } catch (err) {
        console.error('Ошибка при проверке статуса:', err);
      }
    };

    checkStatus();
    
    intervalRef.current = setInterval(checkStatus, 15000);

    return () => {
      clearAllTimers();
    };
  }, [taskId, navigate]);

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (usingMockData) {
      alert('Демонстрационные данные: PDF недоступен');
    } else {
      alert('PDF еще не готов');
    }
  };

  if (!taskId) {
    return (
      <div className={styles.container}>
        <Text variant="h2">Ошибка: отсутствует идентификатор задачи</Text>
        <Button text="Вернуться на главную" onClick={() => navigate('/')} />
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className={styles.container}>
        <Text variant="h2">Анализ в процессе...</Text>
        <Text>Пожалуйста, подождите. Мы анализируем данные и готовим отчет.</Text>
        <Loader size={100} />
      </div>
    );
  }

  // Контент, когда отчет готов (реальные или моковые данные)
  const data = usingMockData ? MOCK_DATA : location.state?.reportData || MOCK_DATA;

  return (
    <div className={styles.container} style={{ alignItems: 'flex-start', height: 'auto', padding: '40px' }}>
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <Text>{error}</Text>
        </div>
      )}
      <Text variant="h2">📚 Краткая сводка</Text>
      
      <ul style={{ textAlign: 'left', marginBottom: '30px' }}>
        <li><strong>Имя ребёнка:</strong> {data.name}</li>
        <li><strong>Главное качество (рисунок "Дом"):</strong> {data.houseQuality}</li>
        <li><strong>Основная черта (рисунок "Животное"):</strong> {data.animalTrait}</li>
        <li><strong>Самооценка (автопортрет):</strong> {data.selfPortrait}</li>
      </ul>

      <hr style={{ width: '100%', margin: '20px 0' }} />

      <Text variant="h2">🔍 Развёрнутые разделы</Text>

      <Text variant="h3">1. Дом-Дерево-Человек: ключевые наблюдения</Text>
      
      <table style={{ width: '100%', marginBottom: '30px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Элемент</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Особенности рисунка</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Психологический вывод</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>Дом</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{data.details.house}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>Потребность в безопасности, семья важна</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>Дерево</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{data.details.tree}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>Устойчивость, рост, жизненная энергия</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>Человек</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{data.details.person}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>Скромность, неуверенность, сдержанность</td>
          </tr>
        </tbody>
      </table>
      
      <Text style={{ marginBottom: '30px', textAlign: 'left' }}>
        <strong>Общий вывод:</strong> Ребёнок чувствует себя в семье защищённо, но может быть сдержан в выражении эмоций и чувствует неуверенность в социальной среде.
      </Text>

      <Text variant="h3">2. Животное: детали и фантазия</Text>
      
      <ul style={{ textAlign: 'left', marginBottom: '30px' }}>
        <li><strong>Выбор животного:</strong> {data.details.animal}</li>
        <li><strong>Акценты в рисунке:</strong> Большие глаза, уши — важность наблюдения, осторожность</li>
        <li><strong>Позы и выражение:</strong> Мирное выражение, сидячая поза — доброжелательность</li>
      </ul>
      
      <Text style={{ marginBottom: '30px', textAlign: 'left' }}>
        <strong>Вывод:</strong> У ребёнка хорошо развито воображение, он склонен к рефлексии и наблюдательности. Может сдерживать активные эмоции, предпочитая анализ.
      </Text>

      <Text variant="h3">3. Автопортрет: особенности самовосприятия</Text>
      
      <ul style={{ textAlign: 'left', marginBottom: '30px' }}>
        <li><strong>Размер фигуры:</strong> {data.details.portrait}</li>
        <li><strong>Выражение лица:</strong> Нейтральное или отсутствует — сдержанность</li>
        <li><strong>Дополнительные детали:</strong> Нет фона или вторичных образов — неуверенность в социуме</li>
      </ul>
      
      <Text style={{ marginBottom: '30px', textAlign: 'left' }}>
        <strong>Вывод:</strong> Ребёнок ориентирован на внешнюю оценку, нуждается в поддержке, особенно эмоциональной и словесной.
      </Text>

      <Text variant="h3">4. Опросник: суммарные баллы и профиль</Text>
      
      <table style={{ width: '100%', marginBottom: '30px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Шкала</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Баллы (из 25)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>Эмоциональная устойчивость</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{data.scores.emotionalStability}</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>Социальная адаптация</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{data.scores.socialAdaptation}</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>Саморегуляция</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{data.scores.selfRegulation}</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>Коммуникативность</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{data.scores.communicativeness}</td>
          </tr>
          <tr>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>Самооценка</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{data.scores.selfEsteem}</td>
          </tr>
        </tbody>
      </table>
      
      <Text variant="h3">Визуальный профиль</Text>
      <pre style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        textAlign: 'left',
        marginBottom: '30px'
      }}>
        Эмоц. устойчивость  [{renderScoreBar(data.scores.emotionalStability)}]\n
        Соц. адаптация      [{renderScoreBar(data.scores.socialAdaptation)}]\n
        Саморегуляция       [{renderScoreBar(data.scores.selfRegulation)}]\n
        Коммуникативность   [{renderScoreBar(data.scores.communicativeness)}]\n
        Самооценка          [{renderScoreBar(data.scores.selfEsteem)}]
      </pre>

      <hr style={{ width: '100%', margin: '20px 0' }} />

      <Text variant="h2">📖 Рекомендации для родителей</Text>
      
      <ul style={{ textAlign: 'left', marginBottom: '30px' }}>
        <li>Чаще хвалите ребёнка за конкретные действия, а не только за результат</li>
        <li>Помогайте называть чувства: "Ты расстроился, потому что..."</li>
        <li>Поддерживайте инициативу, даже если ребёнок ошибается</li>
        <li>Создавайте спокойную и предсказуемую атмосферу дома</li>
        <li>Поощряйте фантазию — сказки, рисунки, игры по ролям</li>
      </ul>

      <hr style={{ width: '100%', margin: '20px 0' }} />

      <Text style={{ fontStyle: 'italic' }}>
        Отчёт составлен на основе проектных методик и наблюдений. Является ориентиром для мягкой поддержки ребёнка в развитии.
      </Text>

      <div className={styles.buttons}>
        <Button 
          text="Скачать PDF" 
          onClick={handleDownloadPdf}
          color="primary"
          disabled={!pdfUrl && !usingMockData}
          width='400px'
        />
        <Button 
          text="Поделиться" 
          onClick={() => alert('Функция "Поделиться" будет реализована позже')}
          color="primary"
          width='400px'
        />
      </div>
      <Text> Шаг 3/3 </Text>
    </div>
  );
};

function renderScoreBar(score: number): string {
  const filled = '■'.repeat(Math.round(score / 5));
  const empty = '□'.repeat(5 - Math.round(score / 5));
  return filled + empty;
}