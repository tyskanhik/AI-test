import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { submitSurveyApi } from "../../mocks/mockApi";

export interface SurveyForm {
  childName: string;
  childDOB: string;
  childGender: string;
  parentName: string;
  q1_1: string;
  q1_2: string;
  q1_3: string;
  q1_4: string;
  q2_1: string;
  q2_2: string;
  q2_3: string;
  q2_4: string;
  q3_1: string;
  q3_2: string;
  q3_3: string;
  q3_4: string;
  q4_1: string;
  q4_2: string;
  q4_3: string;
  q4_4: string;
  emotionalState: string;
  additionalInfo1?: string;
  additionalInfo2?: string;
  additionalInfo3?: string;
  additionalInfo4?: string;
}

interface SurveyState {
  taskId: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentSection: number;
  survey: SurveyForm;
  lastSaved?: string;
};

const initialState: SurveyState = {
  taskId: '',
  status: 'idle',
  error: null,
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
    emotionalState: 'Удовлетворительное'
  }
};

type UpdateAnswerPayload = {
  [K in keyof SurveyForm]?: SurveyForm[K];
};

export const submitSurvey = createAsyncThunk(
  'survey/submit',
  async ({ taskId, surveyData}: {taskId: string, surveyData: {survey: any}}) => {
       const response = await submitSurveyApi(taskId, { survey: surveyData });
       return response
  }
)

export const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setTaskId: (state, action: PayloadAction<string>) => {
      state.taskId = action.payload;
    },
    updateAnswer: (state, action: PayloadAction<UpdateAnswerPayload>) => {
      Object.assign(state.survey, action.payload);
      state.lastSaved = new Date().toISOString();
    },
    updateField: (state, action: PayloadAction<{ field: keyof SurveyForm; value: string }>) => {
      const { field, value } = action.payload;
      state.survey[field] = value;
      state.lastSaved = new Date().toISOString();
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
    },
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (bilder) => {
    bilder
      .addCase(submitSurvey.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitSurvey.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(submitSurvey.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Ошибка при отправке опроса';
      });
  }
});

export const selectSurvey = (state: { survey: SurveyState }) => state.survey.survey;
export const selectSurveyStatus = (state: { survey: SurveyState }) => state.survey.status;
export const selectSurveyError = (state: { survey: SurveyState }) => state.survey.error;
export const selectCurrentSection = (state: { survey: SurveyState }) => state.survey.currentSection;
export const selectLastSaved = (state: { survey: SurveyState }) => state.survey.lastSaved;

export const { 
  setTaskId, 
  updateAnswer, 
  updateField,
  nextSection, 
  prevSection, 
  resetSurvey,
  resetStatus
} = surveySlice.actions;

export default surveySlice.reducer;