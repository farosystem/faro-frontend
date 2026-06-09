import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notes: {}
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setNotes: (state, action) => {
      state.notes = { ...state.notes, ...action.payload };
    }
  }
});

export const { setNotes } = bookingSlice.actions;

export default bookingSlice.reducer;
