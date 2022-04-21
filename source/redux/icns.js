import { createSlice } from '@reduxjs/toolkit';

/* eslint-disable no-param-reassign */
export const icnsSlice = createSlice({
  name: 'icns',
  initialState: {
    resolved: null,
    names: [],
    loading: false,
  },
  reducers: {
    setICNSData: (state, action) => {
      state.names = action?.payload?.names || [];
      state.resolved = action?.payload?.reverseResolvedName || null;
    },
    setICNSLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { setICNSLoading, setICNSData } = icnsSlice.actions;

export default icnsSlice.reducer;
