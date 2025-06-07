import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uploadImages } from "../../api/Api";

interface TaskState {
  taskId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  images: {
    houseTreePerson: File | null;
    nonexistentAnimal: File | null;
    selfPortrait: File | null;
  };
}

const initialState: TaskState = {
  taskId: null,
  status: 'idle',
  error: null,
  images: {
    houseTreePerson: null,
    nonexistentAnimal: null,
    selfPortrait: null,
  },
};

export const uploadTaskImages = createAsyncThunk(
  'task/uploadImages',
  async (_, { getState }) => {
    const state = getState() as { task: TaskState };
    const { images } = state.task;
    
    const formData = new FormData();
    if (images.houseTreePerson) formData.append('files', images.houseTreePerson);
    if (images.nonexistentAnimal) formData.append('files', images.nonexistentAnimal);
    if (images.selfPortrait) formData.append('files', images.selfPortrait);
    
    const response = await uploadImages(formData);
    return response.task_id;
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setImage: (state, action: PayloadAction<{ 
      type: keyof typeof initialState.images;
      file: File 
    }>) => {
      const { type, file } = action.payload;
      state.images[type] = file;
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
        console.log(state.taskId);
      })
      .addCase(uploadTaskImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Upload failed';
      });
  },
});

export const { setImage, clearError, resetTask } = taskSlice.actions;
export default taskSlice.reducer;