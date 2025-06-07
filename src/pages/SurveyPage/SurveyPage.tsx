import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '../../ui-kit/Text/Text';
import { Notification } from '../../ui-kit/Notification/Notification';
import { Button } from '../../ui-kit/Button/Button';
import { Input } from '../../ui-kit/Input/Input';
import { DatePicker } from '../../ui-kit/DatePicker/DatePicker';
import { RadioGroup } from '../../ui-kit/RadioGroup/RadioGroup';

import { submitSurvey } from '../../api/Api';
import { RootState } from '../../store/index';
import styles from './SurveyPage.module.scss';
import { useNavigate } from 'react-router-dom';

import good from '../../assets/images/good.svg';
import flag from '../../assets/images/flag.svg';
import forward from '../../assets/images/Forward.svg';
import back from '../../assets/images/Back.svg';

export const SurveyPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { taskId } = useSelector((state: RootState) => state.task);
  const { survey } = useSelector((state: RootState) => state.survey);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const debounceTimer = React.useRef<NodeJS.Timeout | null>(null);
  
  const [localState, setLocalState] = useState({
    childName: survey.childName || '',
    parentName: survey.parentName || '',
    additionalInfo1: survey.additionalInfo1 || '',
    additionalInfo2: survey.additionalInfo2 || '',
    additionalInfo3: survey.additionalInfo3 || '',
    additionalInfo4: survey.additionalInfo4 || ''
  });

  const debounceReduxUpdate = useCallback((field: string, value: string) => {
    setLocalState(prev => ({ ...prev, [field]: value }));

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      dispatch({ type: 'survey/updateAnswer', payload: { field, value } });
    }, 500);
  }, [dispatch]);

  const handleInputChange = (field: string, value: string) => {
    dispatch({ type: 'survey/updateAnswer', payload: { field, value } });
  };

  React.useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const isFormValid = () => {
    const requiredFields = {
      childName: survey.childName,
      childDOB: survey.childDOB,
      childGender: survey.childGender,
      parentName: survey.parentName,

      q1_1: survey.q1_1,
      q1_2: survey.q1_2,
      q1_3: survey.q1_3,
      q1_4: survey.q1_4,

      q2_1: survey.q2_1,
      q2_2: survey.q2_2,
      q2_3: survey.q2_3,
      q2_4: survey.q2_4,

      q3_1: survey.q3_1,
      q3_2: survey.q3_2,
      q3_3: survey.q3_3,
      q3_4: survey.q3_4,

      q4_1: survey.q4_1,
      q4_2: survey.q4_2,
      q4_3: survey.q4_3,
      q4_4: survey.q4_4,
      
      emotionalState: survey.emotionalState
    };

    return Object.values(requiredFields).every(
      value => value !== undefined && value !== null && value.toString().trim() !== ''
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      console.error('Form is not valid');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const fullSurveyData = {
        ...survey,
        emotionalState: survey.emotionalState || 'Удовлетворительное'
      };

      await submitSurvey(taskId!, { survey: fullSurveyData });

      console.log(taskId, {survey: fullSurveyData});
      
      navigate('/report-status', { state: { taskId } });
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    const formattedDate = date?.toISOString().split('T')[0] || '';
    dispatch({ type: 'survey/updateAnswer', payload: { field: 'childDOB', value: formattedDate } });
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div className={styles.progressFilled} style={{ width: '33%' }} />
        <div className={styles.progressFilled} style={{ width: '33%' }} />
        <div className={styles.progressEmpty} style={{ width: '34%' }} />
      </div>
      <div className={styles.containerContent}>
        <div className={styles.section}>
          <Text variant="h2" weight='bold'>Общая информация о ребенке</Text>
          
          <Input
            label="Имя ребенка"
            value={localState.childName}
            onChange={(e) => debounceReduxUpdate('childName', e.target.value)}
            width="100%"
          />

          <DatePicker
            value={selectedDate}
            label="Дата рождения ребенка"
            onChange={handleDateChange}
            placeholder="Выберите дату"
            width="clamp(150px, 15vw, 250px)"
            className={styles.datePicker}
          />

          <RadioGroup
            name="childGender"
            options={[
              { value: 'male', label: 'Мужской' },
              { value: 'female', label: 'Женский' }
            ]}
            selectedValue={survey.childGender}
            onChange={(value) => handleInputChange('childGender', value)}
            label="Пол ребенка"
            direction="horizontal"
          />

          <Input
            label="Имя родителя, заполняющего анкету"
            value={localState.parentName}
            onChange={(e) => debounceReduxUpdate('parentName', e.target.value)}
            width="100%"
          />
        </div>

        <div className={styles.section}>
          <Notification variant="custom" width={'100%'} backgroundColor='rgb(253, 238, 239)' textColor='rgba(41, 50, 68, 1)'>
            <div className={styles.notificationSection}>
              <div className={styles.notificationSectionElement}>
                <img src={good} alt="палец вверх" />
                <Text>
                  Пожалуйста, внимательно прочитайте каждый вопрос и выберите наиболее 
                  подходящий вариант ответа, отражающий поведение и эмоциональное состояние 
                  вашего ребенка в течение последних 2-4 недель. Отвечайте максимально честно 
                  и искренне, так как от этого зависит точность оценки психоэмоционального 
                  развития Вашего ребенка.
                </Text>
              </div>
              <div className={styles.notificationSectionElement}>
                <img src={flag} alt="Флаг" />
                <Text>Все вопросы обязательны к заполнению</Text>
              </div>
            </div>
          </Notification>
        </div>

        <div className={styles.section}>
          <Text variant="h2" weight='bold'>Раздел 1. Эмоциональная сфера</Text>
          
          <div className={styles.question}>
            <Text variant="h3">Ребенок часто выражает радость и удовольствие:</Text>
            <RadioGroup
              name="q1_1"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q1_1}
              onChange={(value) => handleInputChange('q1_1', value)}
              direction="horizontal"
            />
            <Text variant="h3">Ребенок часто выражает радость и удовольствие:</Text>
            <RadioGroup
              name="q1_2"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q1_2}
              onChange={(value) => handleInputChange('q1_2', value)}
              direction="horizontal"
            />
            <Text variant="h3">Ребенок часто грустит или плачет без видимой причины:</Text>
            <RadioGroup
              name="q1_3"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q1_3}
              onChange={(value) => handleInputChange('q1_3', value)}
              direction="horizontal"
            />
            <Text variant="h3">Ребенок часто грустит или плачет без видимой причины:</Text>
            <RadioGroup
              name="q1_4"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q1_4}
              onChange={(value) => handleInputChange('q1_4', value)}
              direction="horizontal"
            />
          </div>
        </div>

        <div className={styles.section}>
          <Text variant="h2" weight='bold'>Раздел 2. Социальное взаимодействие</Text>
          
          <div className={styles.question}>
            <Text variant="h3">Ребенок легко заводит друзей:</Text>
            <RadioGroup
              name="q2_1"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q2_1}
              onChange={(value) => handleInputChange('q2_1', value)}
              direction="horizontal"
            />
            <Text variant="h3">Ребенок легко заводит друзей:</Text>
            <RadioGroup
              name="q2_2"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q2_2}
              onChange={(value) => handleInputChange('q2_2', value)}
              direction="horizontal"
            />
            <Text variant="h3">Ребенок предпочитает играть один, а не с другими детьми:</Text>
            <RadioGroup
              name="q2_3"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q2_3}
              onChange={(value) => handleInputChange('q2_3', value)}
              direction="horizontal"
            />
            <Text variant="h3">Ребенок предпочитает играть один, а не с другими детьми:</Text>
            <RadioGroup
              name="q2_4"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q2_4}
              onChange={(value) => handleInputChange('q2_4', value)}
              direction="horizontal"
            />
          </div>
        </div>
      
        <div className={styles.section}>
          <Text variant="h2" weight='bold'>Раздел 3. Саморегуляция и поведение</Text>
          
          <div className={styles.question}>
            <Text variant="h3">Ребенок умеет следовать правилам и инструкциям:</Text>
            <RadioGroup
              name="q3_1"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q3_1}
              onChange={(value) => handleInputChange('q3_1', value)}
              direction="horizontal"
            />
            <Text variant="h3">Ребенок умеет следовать правилам и инструкциям:</Text>
            <RadioGroup
              name="q3_2"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q3_2}
              onChange={(value) => handleInputChange('q3_2', value)}
              direction="horizontal"
            />
            <Text variant="h3">Ребенку трудно контролировать свои импульсы:</Text>
            <RadioGroup
              name="q3_3"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q3_3}
              onChange={(value) => handleInputChange('q3_3', value)}
              direction="horizontal"
            />
            <Text variant="h3">Ребенку трудно контролировать свои импульсы:</Text>
            <RadioGroup
              name="q3_4"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q3_4}
              onChange={(value) => handleInputChange('q3_4', value)}
              direction="horizontal"
            />
          </div>
        </div>

        <div className={styles.section}>
          <Text variant="h2" weight='bold'>Раздел 4. Самооценка и уверенность в себе</Text>
          
          <div className={styles.question}>
            <Text variant="h3">Ребенок уверен в своих силах и способностях:</Text>
            <RadioGroup
              name="q4_1"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q4_1}
              onChange={(value) => handleInputChange('q4_1', value)}
              direction="horizontal"
            />
            <Text variant="h3">Ребенок уверен в своих силах и способностях:</Text>
            <RadioGroup
              name="q4_2"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q4_2}
              onChange={(value) => handleInputChange('q4_2', value)}
              direction="horizontal"
            />
            <Text variant="h3">Ребенок часто сомневается в себе:</Text>
            <RadioGroup
              name="q4_3"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q4_3}
              onChange={(value) => handleInputChange('q4_3', value)}
              direction="horizontal"
            />
            <Text variant="h3">Ребенок часто сомневается в себе:  </Text>
            <RadioGroup
              name="q4_4"
              options={[
                { value: '1', label: 'Очень редко' },
                { value: '2', label: 'Редко' },
                { value: '3', label: 'Иногда' },
                { value: '4', label: 'Часто' },
                { value: '5', label: 'Всегда' }
              ]}
              selectedValue={survey.q4_4}
              onChange={(value) => handleInputChange('q4_4', value)}
              direction="horizontal"
            />
          </div>
        </div>

        <div className={styles.section}>
          <Text variant="h2" weight='bold'>Раздел 5. Общие вопросы</Text>
          
          <div className={styles.question}>
            <Text variant="h3">Как Вы оцениваете общее эмоциональное состояние вашего ребенка?:</Text>
            <RadioGroup
              name="emotionalState"
              options={[
                { value: 'Отличное', label: 'Отличное' },
                { value: 'Хорошее', label: 'Хорошее' },
                { value: 'Удовлетворительное', label: 'Удовлетворительное' },
                { value: 'Неудовлетворительное', label: 'Неудовлетворительное' },
                { value: 'плохое', label: 'Очень плохое' }
              ]}
              selectedValue={survey.emotionalState}
              onChange={(value) => handleInputChange('emotionalState', value)}
              direction="vertical"
            />
            <Input
              label="Есть ли у Вашего ребенка какие-либо особенности развития или поведения, о которых Вы хотели бы сообщить дополнительно?"
              value={localState.additionalInfo1}
              onChange={(e) => debounceReduxUpdate('additionalInfo1', e.target.value)}
              width="100%"
              height="clamp(150px, 10vh, 250px)"
              multiline
              fullWidth={true}
            />

            <Input
              label="Какие, на Ваш взгляд, сильные стороны и таланты есть у Вашего ребенка?"
              value={localState.additionalInfo2}
              onChange={(e) => debounceReduxUpdate('additionalInfo2', e.target.value)}
              width="100%"
              height="clamp(150px, 10vh, 250px)"
              multiline
              fullWidth={true}
            />

            <Input
              label="Какие, на Ваш взгляд, области требуют особого внимания и развития у Вашего ребенка?"
              value={localState.additionalInfo3}
              onChange={(e) => debounceReduxUpdate('additionalInfo3', e.target.value)}
              width="100%"
              height="clamp(150px, 10vh, 250px)"
              multiline
              fullWidth={true}
            />

            <Input
              label="Обращались ли Вы ранее к специалистам (психологу, неврологу, логопеду) по поводу развития или поведения Вашего ребенка?"
              value={localState.additionalInfo4}
              onChange={(e) => debounceReduxUpdate('additionalInfo4', e.target.value)}
              width="100%"
              height="clamp(150px, 10vh, 250px)"
              multiline
              fullWidth={true}
            />
          </div>
        </div>

        <div className={styles.navigation}>
          <Text variant="body" color="muted">
            Шаг 2/3
          </Text>
          <div className={styles.navigationButton}>
            <Button 
              text="К загрузке рисунков"
              color="custom"
              customColor='rgba(218, 237, 253, 1)'
              onClick={() => window.history.back()}
              icon={<img src={back} alt="Назад" />}
            />
          
            <Button 
              text={isSubmitting ? 'Отправка...' : 'Узнать результаты'}
              color="primary"
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              icon={<img src={forward} alt="Далее" />}
              iconPosition='right'
            />
          </div>
        </div>
      </div>
    </div>
  );
};