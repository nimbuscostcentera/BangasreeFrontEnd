import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
var URL = `/auth-routes/reset-password`;
export const ResetPassfunc = createAsyncThunk(
  "Auth/ResetPass",
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
      return rejectWithValue(error?.response?.data?.response);
    }
  }
);

const ResetPassSlice = createSlice({
  name: "ResetPass",
  initialState: {
    isloading64: false,
    Resp64: "",
    isError64: false,
    error64: "",
    isSuccess64: false,
  },
  reducers: {
    ClearState64: (state) => {
      (state.isloading64 = false),
        (state.isError64 = false),
        (state.isSuccess64 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ResetPassfunc.pending, (state) => {
        state.isloading64 = true;
        state.isSuccess64 = false;
        state.isError64 = false;
      })
      .addCase(ResetPassfunc.fulfilled, (state, { payload }) => {
        state.isloading64 = false;
        state.isSuccess64 = true;
        state.isError64 = false;
        state.Resp64 = payload;
      })
      .addCase(ResetPassfunc.rejected, (state, { payload }) => {
        state.isloading64 = false;
        state.isError64 = true;
        state.error64 = payload;
        state.isSuccess64 = false;
      });
  },
});
export const { ClearState64 } = ResetPassSlice.actions;
export default ResetPassSlice.reducer;
