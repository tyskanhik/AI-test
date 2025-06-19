import React, { useEffect, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Text } from '../../ui-kit/Text/Text';
import { Notification } from '../../ui-kit/Notification/Notification';
import { Button } from '../../ui-kit/Button/Button';
import { Input } from '../../ui-kit/Input/Input';
import { DatePicker } from '../../ui-kit/DatePicker/DatePicker';
import { RadioGroup } from '../../ui-kit/RadioGroup/RadioGroup';
import { submitSurveyApi } from '../../mocks/mockApi';
import { RootState } from '../../store/index';
import styles from './SurveyPage.module.scss';
import { useNavigate } from 'react-router-dom';
import good from '../../assets/images/good.svg';
import flag from '../../assets/images/flag.svg';
import forward from '../../assets/images/Forward.svg';
import back from '../../assets/images/Back.svg';
import { SurveyForm } from '../../store/slices/surveySlice';
import { debounce } from 'lodash';


export const SurveyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { taskId } = useAppSelector((state: RootState) => state.task);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const { 
    control,
    handleSubmit,
    formState: { isValid },
    watch,
    setValue
  } = useForm<SurveyForm>({
    mode: 'onChange',
    defaultValues: {
      childName: '',
      childDOB: '',
      childGender: 'male',
      parentName: '',
      q1_1: '',
      q1_2: '',
      q1_3: '',
      q1_4: '',
      q2_1: '',
      q2_2: '',
      q2_3: '',
      q2_4: '',
      q3_1: '',
      q3_2: '',
      q3_3: '',
      q3_4: '',
      q4_1: '',
      q4_2: '',
      q4_3: '',
      q4_4: '',
      emotionalState: 'Удовлетворительное',
      additionalInfo1: '',
      additionalInfo2: '',
      additionalInfo3: '',
      additionalInfo4: '',
    }
  });

  const debouncedSave = useMemo(() => debounce((formData: SurveyForm) => {
    dispatch({ 
      type: 'survey/updateAnswer', 
      payload: formData
    });
  }, 500), [dispatch]);

  useEffect(() => {
    const subscription = watch((formData) => {
      debouncedSave(formData as SurveyForm);
    });
    return () => {
      subscription.unsubscribe();
      debouncedSave.cancel();
    }
  }, [watch, debouncedSave]);

  const onSubmit = async (data: SurveyForm) => {
  if (taskId) {
    setIsSubmitting(true);
    try {
      await submitSurveyApi(taskId, { survey: data });
      navigate('/report-status', { state: { taskId } });
    } catch (error) {
      console.error('Error submitting survey:', error);
      setIsSubmitting(false);
    }
  };
};

  const handleDateChange = useCallback((date: Date | null) => {
    const formattedDate = date?.toISOString().split('T')[0] || '';
    setValue('childDOB', formattedDate);
  }, [setValue]);

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <div className={styles.progressFilled} style={{ width: '33%' }} />
        <div className={styles.progressFilled} style={{ width: '33%' }} />
        <div className={styles.progressEmpty} style={{ width: '34%' }} />
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className={styles.containerContent}>
        <div className={styles.section}>
          <Text variant="h2" weight='bold'>Общая информация о ребенке</Text>
          
          <Controller
            name="childName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                label="Имя ребенка"
                value={field.value}
                onChange={field.onChange}
                width="100%"
              />
            )}
          />

          <Controller
            name="childDOB"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value ? new Date(field.value) : null}
                label="Дата рождения ребенка"
                onChange={handleDateChange}
                placeholder="Выберите дату"
                width="clamp(150px, 15vw, 250px)"
                className={styles.datePicker}
              />
            )}
          />

          <Controller
            name="childGender"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <RadioGroup
                name="childGender"
                options={[
                  { value: 'male', label: 'Мужской' },
                  { value: 'female', label: 'Женский' }
                ]}
                selectedValue={field.value}
                onChange={field.onChange}
                label="Пол ребенка"
                direction="horizontal"
              />
            )}
          />

          <Controller
            name="parentName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                label="Имя родителя, заполняющего анкету"
                value={field.value}
                onChange={field.onChange}
                width="100%"
              />
            )}
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

        {/* Раздел 1: Эмоциональная сфера */}
        <div className={styles.section}>
          <Text variant="h2" weight='bold'>Раздел 1. Эмоциональная сфера</Text>
          
          {[1, 2, 3, 4].map((num) => (
            <div key={`q1_${num}`} className={styles.question}>
              <Text variant="h3">
                {num === 1 || num === 2 
                  ? "Ребенок часто выражает радость и удовольствие:" 
                  : "Ребенок часто грустит или плачет без видимой причины:"}
              </Text>
              <Controller
                name={`q1_${num}` as keyof SurveyForm}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <RadioGroup
                    name={`q1_${num}`}
                    options={[
                      { value: '1', label: 'Очень редко' },
                      { value: '2', label: 'Редко' },
                      { value: '3', label: 'Иногда' },
                      { value: '4', label: 'Часто' },
                      { value: '5', label: 'Всегда' }
                    ]}
                    selectedValue={field.value}
                    onChange={field.onChange}
                    direction="horizontal"
                  />
                )}
              />
            </div>
          ))}
        </div>

        {/* Раздел 2: Социальное взаимодействие */}
        <div className={styles.section}>
          <Text variant="h2" weight='bold'>Раздел 2. Социальное взаимодействие</Text>
          
          {[1, 2, 3, 4].map((num) => (
            <div key={`q2_${num}`} className={styles.question}>
              <Text variant="h3">
                {num === 1 || num === 2 
                  ? "Ребенок легко заводит друзей:" 
                  : "Ребенок предпочитает играть один, а не с другими детьми:"}
              </Text>
              <Controller
                name={`q2_${num}` as keyof SurveyForm}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <RadioGroup
                    name={`q2_${num}`}
                    options={[
                      { value: '1', label: 'Очень редко' },
                      { value: '2', label: 'Редко' },
                      { value: '3', label: 'Иногда' },
                      { value: '4', label: 'Часто' },
                      { value: '5', label: 'Всегда' }
                    ]}
                    selectedValue={field.value}
                    onChange={field.onChange}
                    direction="horizontal"
                  />
                )}
              />
            </div>
          ))}
        </div>

        {/* Раздел 3: Саморегуляция и поведение */}
        <div className={styles.section}>
          <Text variant="h2" weight='bold'>Раздел 3. Саморегуляция и поведение</Text>
          
          {[1, 2, 3, 4].map((num) => (
            <div key={`q3_${num}`} className={styles.question}>
              <Text variant="h3">
                {num === 1 || num === 2 
                  ? "Ребенок умеет следовать правилам и инструкциям:" 
                  : "Ребенку трудно контролировать свои импульсы:"}
              </Text>
              <Controller
                name={`q3_${num}` as keyof SurveyForm}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <RadioGroup
                    name={`q3_${num}`}
                    options={[
                      { value: '1', label: 'Очень редко' },
                      { value: '2', label: 'Редко' },
                      { value: '3', label: 'Иногда' },
                      { value: '4', label: 'Часто' },
                      { value: '5', label: 'Всегда' }
                    ]}
                    selectedValue={field.value}
                    onChange={field.onChange}
                    direction="horizontal"
                  />
                )}
              />
            </div>
          ))}
        </div>

        {/* Раздел 4: Самооценка и уверенность в себе */}
        <div className={styles.section}>
          <Text variant="h2" weight='bold'>Раздел 4. Самооценка и уверенность в себе</Text>
          
          {[1, 2, 3, 4].map((num) => (
            <div key={`q4_${num}`} className={styles.question}>
              <Text variant="h3">
                {num === 1 || num === 2 
                  ? "Ребенок уверен в своих силах и способностях:" 
                  : "Ребенок часто сомневается в себе:"}
              </Text>
              <Controller
                name={`q4_${num}` as keyof SurveyForm}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <RadioGroup
                    name={`q4_${num}`}
                    options={[
                      { value: '1', label: 'Очень редко' },
                      { value: '2', label: 'Редко' },
                      { value: '3', label: 'Иногда' },
                      { value: '4', label: 'Часто' },
                      { value: '5', label: 'Всегда' }
                    ]}
                    selectedValue={field.value}
                    onChange={field.onChange}
                    direction="horizontal"
                  />
                )}
              />
            </div>
          ))}
        </div>

        {/* Раздел 5: Общие вопросы */}
        <div className={styles.section}>
          <Text variant="h2" weight='bold'>Раздел 5. Общие вопросы</Text>
          
          <div className={styles.question}>
            <Text variant="h3">Как Вы оцениваете общее эмоциональное состояние вашего ребенка?:</Text>
            <Controller
              name="emotionalState"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup
                  name="emotionalState"
                  options={[
                    { value: 'Отличное', label: 'Отличное' },
                    { value: 'Хорошее', label: 'Хорошее' },
                    { value: 'Удовлетворительное', label: 'Удовлетворительное' },
                    { value: 'Неудовлетворительное', label: 'Неудовлетворительное' },
                    { value: 'плохое', label: 'Очень плохое' }
                  ]}
                  selectedValue={field.value}
                  onChange={field.onChange}
                  direction="vertical"
                />
              )}
            />

            {[1, 2, 3, 4].map((num) => (
              <Controller
                key={`additionalInfo${num}`}
                name={`additionalInfo${num}` as keyof SurveyForm}
                control={control}
                render={({ field }) => (
                  <Input
                    label={
                      num === 1 ? "Есть ли у Вашего ребенка какие-либо особенности развития или поведения, о которых Вы хотели бы сообщить дополнительно?" :
                      num === 2 ? "Какие, на Ваш взгляд, сильные стороны и таланты есть у Вашего ребенка?" :
                      num === 3 ? "Какие, на Ваш взгляд, области требуют особого внимания и развития у Вашего ребенка?" :
                      "Обращались ли Вы ранее к специалистам (психологу, неврологу, логопеду) по поводу развития или поведения Вашего ребенка?"
                    }
                    value={field.value}
                    onChange={field.onChange}
                    width="100%"
                    height="clamp(150px, 10vh, 250px)"
                    multiline
                    fullWidth={true}
                  />
                )}
              />
            ))}
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
              type="submit"
              color="primary"
              disabled={!isValid || isSubmitting}
              icon={<img src={forward} alt="Далее" />}
              iconPosition='right'
            />
          </div>
        </div>
      </form>
    </div>
  );
};