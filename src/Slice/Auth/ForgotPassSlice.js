import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const URL = `${import.meta.env.VITE_BASEURL}/auth-routes/forget-password`;

export const ForgetPass = createAsyncThunk(
  "Auth/ForgetPass",
  async (UserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(URL, UserData, config);

      return data?.response;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.response);
    }
  }
);

const ForgetPassSlice = createSlice({
  name: "ForgetPass",
  initialState: {
    isloading63: false,
    Resp63: "",
    isError63: false,
    error63: "",
    isSuccess63: false,
  },
  reducers: {
    ClearState63: (state) => {
      (state.isloading63 = false),
        (state.isError63 = false),
        (state.isSuccess63 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ForgetPass.pending, (state) => {
        state.isloading63 = true;
        state.isSuccess63 = false;
        state.isError63 = false;
      })
      .addCase(ForgetPass.fulfilled, (state, { payload }) => {
        state.isloading63 = false;
        state.isSuccess63 = true;
        state.isError63 = false;
        state.Resp63 = payload;
      })
      .addCase(ForgetPass.rejected, (state, { payload }) => {
        state.isloading63 = false;
        state.isError63 = true;
        state.error63 = payload;
        state.isSuccess63 = false;
      });
  },
});
export const { ClearState63 } = ForgetPassSlice.actions;
export default ForgetPassSlice.reducer;
