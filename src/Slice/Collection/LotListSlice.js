import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/agent-lotlist`;
export const LotListfunc = createAsyncThunk(
  "LotList",
  async (UserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await AxiosInstance.post(URL, UserData, config);

      return data?.response;
    } catch (error) {
      return rejectWithValue(error.response.data.response);
    }
  }
);

const LotListSlice = createSlice({
  name: "LotList",
  initialState: {
    isLotLoading: false,
    LotList: {},
    LotErrorMsg: "",
    isLotError: false,
    isLotSuccess: false,
  },
  reducers: {
    ClearStateLotList: (state) => {
      (state.isLotLoading = false),
        (state.isLotError = false),
        (state.isLotSuccess = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LotListfunc.pending, (state) => {
        state.isLotLoading = true;
        state.isLotError = false;
        state.isLotSuccess = false;
      })
      .addCase(LotListfunc.fulfilled, (state, { payload }) => {
        state.isLotError = false;
        state.isLotLoading = false;
        state.isLotSuccess = true;
        state.LotList = payload;
      })
      .addCase(LotListfunc.rejected, (state, { payload }) => {
        state.isLotLoading = false;
        state.isLotError = true;
        state.isLotSuccess = false;
        state.LotErrorMsg = payload;
      });
  },
});
export const { ClearStateLotList } = LotListSlice.actions;
export default LotListSlice.reducer;
