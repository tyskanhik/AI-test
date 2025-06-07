import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SurveyState {
  taskId: string;
  currentSection: number;
  survey: {
    childName: string;
    childDOB: string;
    childGender: string;
    parentName: string;

    q1_1: string;
    q1_2: string;
    q1_3: string;
    q1_4: string;
    q1_5: string;
    q1_6: string;
    q1_7: string;
    q1_8: string;
    q1_9: string;
    q1_10: string;

    q2_1: string;
    q2_2: string;
    q2_3: string;
    q2_4: string;
    q2_5: string;
    q2_6: string;
    q2_7: string;
    q2_8: string;
    q2_9: string;
    q2_10: string;


    q3_1: string;
    q3_2: string;
    q3_3: string;
    q3_4: string;
    q3_5: string;
    q3_6: string;
    q3_7: string;
    q3_8: string;
    q3_9: string;
    q3_10: string;

    q4_1: string;
    q4_2: string;
    q4_3: string;
    q4_4: string;
    q4_5: string;
    q4_6: string;
    q4_7: string;
    q4_8: string;
    q4_9: string;
    q4_10: string;

    emotionalState: string;

    additionalInfo1?: string;
    additionalInfo2?: string
    additionalInfo3?: string
    additionalInfo4?: string
  };
}

const initialState: SurveyState = {
  taskId: '',
  currentSection: 0,
  survey: {
    childName: '',
    childDOB: '',
    childGender: 'male',
    parentName: '',

    q1_1: '',
    q1_2: '',
    q1_3: '',
    q1_4: '',
    q1_5: '3',
    q1_6: '3',
    q1_7: '3',
    q1_8: '3',
    q1_9: '3',
    q1_10: '3',

    q2_1: '',
    q2_2: '',
    q2_3: '',
    q2_4: '',
    q2_5: '3',
    q2_6: '3',
    q2_7: '3',
    q2_8: '3',
    q2_9: '3',
    q2_10: '3',

    q3_1: '',
    q3_2: '',
    q3_3: '',
    q3_4: '',
    q3_5: '3',
    q3_6: '3',
    q3_7: '3',
    q3_8: '3',
    q3_9: '3',
    q3_10: '3',

    q4_1: '',
    q4_2: '',
    q4_3: '',
    q4_4: '',
    q4_5: '3',
    q4_6: '3',
    q4_7: '3',
    q4_8: '3',
    q4_9: '3',
    q4_10: '3',

    emotionalState: 'Удовлетворительное'
  }
};

export const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setTaskId: (state, action: PayloadAction<string>) => {
      state.taskId = action.payload;
    },
    updateAnswer: (state, action: PayloadAction<{field: string; value: string}>) => {
      (state.survey as any)[action.payload.field] = action.payload.value;
    },
    nextSection: (state) => {
      state.currentSection += 1;
    },
    prevSection: (state) => {
      state.currentSection = Math.max(0, state.currentSection - 1);
    },
    resetSurvey: (state) => {
      const currentTaskId = state.taskId;
      return {
        ...initialState,
        taskId: currentTaskId
      };
    }
  }
});

export const { setTaskId, updateAnswer, nextSection, prevSection, resetSurvey } = surveySlice.actions;
export default surveySlice.reducer;