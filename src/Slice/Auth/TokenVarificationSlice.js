import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/auth-routes/verify-token`;
export const TokenVerificationfunc = createAsyncThunk(
  "Token-Verification",
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
      if (error.response && error.response.data.response) {
        return rejectWithValue(error.response?.data?.response);
      } else {
        return rejectWithValue(error?.response);
      }
    }
  }
);

const TokenVerificationSlice = createSlice({
  name: "Token-Verification",
  initialState: {
    isloading70: false,
    Resp70: null,
    isError70: false,
    error70: "",
    isSuccess70: false,
  },
  reducers: {
    ClearState70: (state) => {
      (state.isloading70 = false),
        (state.isError70 = false),
        (state.isSuccess70 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(TokenVerificationfunc.pending, (state) => {
        state.isloading70 = true;
        state.isError70 = false;
        state.isSuccess70 = false;
      })
      .addCase(TokenVerificationfunc.fulfilled, (state, { payload }) => {
        state.isloading70 = false;
        state.isError70 = false;
        state.isSuccess70 = true;
        state.Resp70 = payload;
      })
      .addCase(TokenVerificationfunc.rejected, (state, { payload }) => {
        state.isloading70 = false;
        state.isError70 = true;
        state.isSuccess70 = false;
        state.error70 = payload;
      });
  },
});
export const { ClearState70 } =TokenVerificationSlice.actions;
export default TokenVerificationSlice.reducer;
