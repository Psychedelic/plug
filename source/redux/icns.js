import { createSlice } from '@reduxjs/toolkit';

/* eslint-disable no-param-reassign */
export const icnsSlice = createSlice({
  name: 'icns',
  initialState: {
    resolved: null,
    names: [],
    loading: false,
    useICNS: true,
  },
  reducers: {
    setICNSData: (state, action) => {
      state.names = action?.payload?.names || [];
      state.resolved = action?.payload?.reverseResolvedName || null;
    },
    setICNSLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUseICNS: (state, action) => {
      state.useICNS = action.payload;
    },
  },
});

export const { setICNSLoading, setICNSData, setUseICNS } = icnsSlice.actions;

export default icnsSlice.reducer;
