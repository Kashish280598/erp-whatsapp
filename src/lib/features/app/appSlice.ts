import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ErrorState, LoadingState } from '@/types/app.types';

interface AppState {
  initializing: boolean;
  loading: LoadingState;
  errors: ErrorState[];
  lastError: ErrorState | null;
  tourCompleted: boolean;
}

const initialState: AppState = {
  loading: {},
  errors: [],
  lastError: null,
  initializing: true,
  tourCompleted: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ key: string; isLoading: boolean }>) => {
      const { key, isLoading } = action.payload;
      if (isLoading) {
        state.loading[key] = true;
      } else {
        delete state.loading[key];
      }
    },
    getLoading: (state, action: PayloadAction<{ key: string }>) => {
      const { key } = action.payload;
      state.loading[key] = state.loading[key] || false;
    },
    addError: (state, action: PayloadAction<ErrorState>) => {
      state.errors.push(action.payload);
      state.lastError = action.payload;
    },
    clearError: (state, action: PayloadAction<number>) => {
      state.errors = state.errors.filter(error => error.timestamp !== action.payload);
      state.lastError = state.errors[state.errors.length - 1] || null;
    },
    clearAllErrors: (state) => {
      state.errors = [];
      state.lastError = null;
    },
    setInitializing: (state, action: PayloadAction<boolean>) => {
      state.initializing = action.payload
    },
    setTourCompleted(state, action) {
      state.tourCompleted = action.payload;
    },
  },
});

export const { setLoading, getLoading, addError, clearError, clearAllErrors, setInitializing, setTourCompleted } = appSlice.actions;
export default appSlice.reducer; 