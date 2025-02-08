import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/colection-submisson`;
export const LotEntryFunc = createAsyncThunk(
  "LotEntry",
  async (UserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await AxiosInstance.post(URL, UserData, config);

      return data?.response;
    } catch (error) {
      return rejectWithValue(error.response.data.response);
    }
  }
);

const LotEntrySlice = createSlice({
  name: "LotEntry",
  initialState: {
    isLotEntryLoading: false,
    LotEntrySuccessMsg :"",
    LotEntryErrorMsg: "",
    isLotEntryError: false,
    isLotEntrySuccess: false,
  },
  reducers: {
    ClearStateLotEntry: (state) => {
      (state.isLotEntryLoading = false),
        (state.isLotEntryError = false),
        (state.isLotEntrySuccess = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LotEntryFunc.pending, (state) => {
        state.isLotEntryLoading = true;
        state.isLotEntryError = false;
        state.isLotEntrySuccess = false;
      })
      .addCase(LotEntryFunc.fulfilled, (state, { payload }) => {
        state.isLotEntryError = false;
        state.isLotEntryLoading = false;
        state.isLotEntrySuccess = true;
       state.LotEntrySuccessMsg= payload;
      })
      .addCase(LotEntryFunc.rejected, (state, { payload }) => {
        state.isLotEntryLoading = false;
        state.isLotEntryError = true;
        state.isLotEntrySuccess = false;
        state.LotEntryErrorMsg = payload;
      });
  },
});
export const { ClearStateLotEntry } = LotEntrySlice.actions;
export default LotEntrySlice.reducer;
