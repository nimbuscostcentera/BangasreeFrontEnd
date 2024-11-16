import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toggle: 0,
  bell: false,
  nobj: {},
};

const NotificationHandlerSlice = createSlice({
  name: "NotificationHandler",
  initialState,
  reducers: {
    toggleHandler: (state, action) => {
      state.toggle = action.payload;
    },
    bellHandler: (state, action) => {
      state.bell = action.payload;
    },
    fetchObjHandler: (state, action) => {
      state.nobj = action.payload;
    },
    resetToInitial: (state, action) => {
      state.toggle = 0;
      state.bell = false;
      state.nobj = {};
    },
  },
});

export const { toggleHandler, bellHandler, fetchObjHandler, resetToInitial } = NotificationHandlerSlice.actions;
export default NotificationHandlerSlice.reducer;
