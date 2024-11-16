import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  first: {
    isCameraOpen: false,
    isButtonDisable: false,
    imageData: null,
    isImageTaken: false,
    isConfirmed: false,
  },
  second: {
    isCameraOpen: false,
    isButtonDisable: true,
    imageData: null,
    isImageTaken: false,
    isConfirmed: false,
  },
};

const ScannerSlicer = createSlice({
  name: "Scanner",
  initialState,
  reducers: {
    openCamera: (state, action) => {
      state[action.payload].isCameraOpen = true;
      state.first.isButtonDisable = true;
      state.second.isButtonDisable = true;
    },
    takePhoto: (state, action) => {
      const { cameraKey, imageData } = action.payload;
      state[cameraKey].imageData = imageData;
      state[cameraKey].isImageTaken = true;
      state.first.isButtonDisable = true;
      state.second.isButtonDisable = true;
      state.first.isCameraOpen = false;
      state.second.isCameraOpen = false;
    },
    confirmPhoto: (state, action) => {
      const { cameraKey } = action.payload;
      state[cameraKey].isConfirmed = true;
      if(cameraKey==="first")
      {
        state.first.isButtonDisable=true;
        state.second.isButtonDisable=false;
      }
      else if(cameraKey==="second")
      {
        state.first.isButtonDisable = true;
        state.second.isButtonDisable = true;
      }
    },
    retakePhoto: (state, action) => {
      const { cameraKey } = action.payload;
      state[cameraKey].isImageTaken = false;
      state[cameraKey].isConfirmed = false;
      state[cameraKey].imageData = null;
      state[cameraKey].isCameraOpen=true;
    },
  },
});

export const { openCamera, takePhoto, confirmPhoto, retakePhoto } =ScannerSlicer.actions;
export default ScannerSlicer.reducer;
