import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: string;
}

interface BreadcrumbState {
  items: BreadcrumbItem[];
}

const initialState: BreadcrumbState = {
  items: [],
};

export const breadcrumbSlice = createSlice({
  name: 'breadcrumb',
  initialState,
  reducers: {
    setBreadcrumbs: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.items = action.payload;
    },
    clearBreadcrumbs: (state) => {
      state.items = [];
    },
    addBreadcrumb: (state, action: PayloadAction<BreadcrumbItem>) => {
      state.items.push(action.payload);
    },
    removeBreadcrumb: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.path !== action.payload);
    },
  },
});

export const { setBreadcrumbs, clearBreadcrumbs, addBreadcrumb, removeBreadcrumb } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer; 