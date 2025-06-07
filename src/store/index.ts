import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';
import surveyReducer from './slices/surveySlice';

export const store = configureStore({
  reducer: {
    task: taskReducer,
    survey: surveyReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;