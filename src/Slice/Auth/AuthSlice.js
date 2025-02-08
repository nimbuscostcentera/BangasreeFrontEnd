import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const URL = `${import.meta.env.VITE_BASEURL}/auth-routes/login`;
export const authenticate = createAsyncThunk(
  "Auth/login",
  async (UserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(URL, UserData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.response);
    }
  }
);

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    isloading: false,
    userInfo: {},
    error: "",
    toasterBool: false,
    isError: false,
    isSuccess: false,
  },
  reducers: {
    ClearState: (state) => {
      state.error = "";
      state.isError = false;
      state.isSuccess = false;
    },
    ClearToaster: (state) => {
      state.toasterBool = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticate.pending, (state) => {
        state.isloading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(authenticate.fulfilled, (state, { payload }) => {
        state.isError = false;
        state.isloading = false;
        state.isSuccess = true;
        state.userInfo = payload;
        state.toasterBool = true;
        window.localStorage.setItem(
          "AccessToken",
          payload?.details?.AccessToken
        );
        window.localStorage.setItem(
          "RefreshToken",
          payload?.details?.refreshToken
        );
      })
      .addCase(authenticate.rejected, (state, { payload }) => {
        state.isloading = false;
        state.isError = true;
        state.isSuccess = false;
        state.error = payload;
      });
  },
});
export const { ClearState, ClearToaster } = AuthSlice.actions;
export default AuthSlice.reducer;
