import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uploadImages } from "../../mocks/mockApi";

interface ImagePreview {
  name: string;
  previewUrl: string;
}

interface TaskState {
  taskId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  imagePreviews: {
    houseTreePerson: ImagePreview | null;
    nonexistentAnimal: ImagePreview | null;
    selfPortrait: ImagePreview | null;
  };
}

const initialState: TaskState = {
  taskId: null,
  status: 'idle',
  error: null,
  imagePreviews: {
    houseTreePerson: null,
    nonexistentAnimal: null,
    selfPortrait: null,
  },
};

export const uploadTaskImages = createAsyncThunk(
  'task/uploadImages',
  async ( files: {
    houseTreePerson: File | null;
    nonexistentAnimal: File | null;
    selfPortrait: File | null;
  }, _) => {
    const formData = new FormData();
    if (files.houseTreePerson) formData.append('files', files.houseTreePerson)
    if (files.nonexistentAnimal) formData.append('files', files.nonexistentAnimal)
    if (files.selfPortrait) formData.append('files', files.selfPortrait)

    const response = await uploadImages(formData);
    return response.task_id;
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setImagePreview: (state, action: PayloadAction<{ 
      type: keyof typeof initialState.imagePreviews;
      preview: ImagePreview | null;
    }>) => {
      const { type, preview } = action.payload;
      state.imagePreviews[type] = preview;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetTask: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadTaskImages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadTaskImages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.taskId = action.payload;
      })
      .addCase(uploadTaskImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Upload failed';
      });
  },
});

export const { setImagePreview, clearError, resetTask } = taskSlice.actions;
export default taskSlice.reducer;