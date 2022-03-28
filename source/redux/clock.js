import { createSlice } from '@reduxjs/toolkit';

/* eslint-disable no-param-reassign */
export const clockSlice = createSlice({
  name: 'clock',
  initialState: {
    clockValidated: false,
  },
  reducers: {
    setClockValidated: (state, action) => {
      state.clockValidated = action.payload;
    },
  },
});

export const { setClockValidated } = clockSlice.actions;

export default clockSlice.reducer;
