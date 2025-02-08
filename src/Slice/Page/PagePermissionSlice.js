import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
import axios from "axios";
const URL = `/superuser-routes/user-permisson`;

export const PermissionList = createAsyncThunk(
  "PermissionList",
  async (UserData, { rejectWithValue }) => {
    let fetchingData = {};
    try {
      fetchingData = await AxiosInstance.post(URL, UserData);
      const { data } = fetchingData;

      return data?.response;
    } catch (error) {
      return rejectWithValue(error.response.data.response);
    }
  }
);

export const LoggerPermission = createAsyncThunk(
  "LoggerPermissionList",
  async (UserData, { rejectWithValue }) => {
    var fetchingData = {};
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetchingData = await AxiosInstance.post(URL, UserData, config);
      //console.log("in axios");
      const { data } = fetchingData;
      return data?.response;
    } catch (error) {
      return rejectWithValue(error.response.data.response);
    }
  }
);

const PermissionListSlice = createSlice({
  name: "PermissionListSlice",
  initialState: {
    isloading14: false,
    PermissionData: [],
    error14: "",
    isError14: false,
    isSuccess14: false,
    isLogLoad: false,
    LoggerPerData: [],
    isLogSuccess: false,
  },
  reducers: {
    ClearState14: (state) => {
      (state.isloading14 = false),
        (state.isError14 = false),
        (state.isSuccess14 = false);
      state.isLogSuccess = false;
      state.isLogLoad = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(PermissionList.pending, (state) => {
        state.isloading14 = true;
        state.isError14 = false;
        state.isSuccess14 = false;
      })
      .addCase(PermissionList.fulfilled, (state, { payload }) => {
        state.PermissionData = payload;
        state.isSuccess14 = true;
        state.isloading14 = false;
        state.isError14 = false;
      })
      .addCase(PermissionList.rejected, (state, { payload }) => {
        state.error14 = payload;
        state.isError14 = true;
        state.isSuccess14 = false;
        state.isloading14 = false;
      });
    builder
      .addCase(LoggerPermission.pending, (state) => {
        state.isLogLoad = true;
        state.isError14 = false;
        state.isLogSuccess = false;
      })
      .addCase(LoggerPermission.fulfilled, (state, { payload }) => {
        state.isLogLoad = false;
        state.isError14 = false;
        state.isLogSuccess = true;
        state.LoggerPerData = payload;
        //console.log("hi im here");
        localStorage.setItem("loggerPermission", JSON.stringify(payload));
      })
      .addCase(LoggerPermission.rejected, (state, { payload }) => {
        state.error14 = payload;
        state.isError14 = true;
        state.isLogLoad = false;
      });
  },
});
export const { ClearState14 } = PermissionListSlice.actions;
export default PermissionListSlice.reducer;
