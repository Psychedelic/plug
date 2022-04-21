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
    setICNSNames: (state, action) => {
      state.names = action.payload;
    },
    setResolvedName: (state, action) => {
      state.resolved = action.payload;
    },
    setICNSLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { setICNSLoading, setICNSNames, setResolvedName } = icnsSlice.actions;

export default icnsSlice.reducer;
