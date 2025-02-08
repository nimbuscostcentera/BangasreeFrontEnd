import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes//logbook-list`;

export const LogBookListFunc = createAsyncThunk(
  "LogBookList",
  async (UserData, { rejectWithValue }) => {
    var fetchingData = null;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetchingData = await AxiosInstance.post(URL, UserData, config);

      const { data } = fetchingData;
      return data?.response;
    } catch (error) {
      if (error.response && error.response.data.response) {
        return rejectWithValue(error.response.data.response);
      } else {
        return rejectWithValue(error.response);
      }
    }
  }
);

const LogListSlice = createSlice({
  name: "LogBookListSlice",
  initialState: {
    isLogListLoading: false,
    LogListResult: [],
    LogListError: "",
    isLogListError: false,
    isLogListSuccess: false,
  },
  reducers: {
    ClearstateLogList: (state) => {
      (state.isLogListLoading = false),
        (state.isLogListError = false),
        (state.isLogListSuccess = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LogBookListFunc.pending, (state) => {
        state.isLogListLoading = true;
        state.isLogListError = false;
        state.isLogListSuccess = false;
      })
      .addCase(LogBookListFunc.fulfilled, (state, { payload }) => {
        state.LogListResult = payload;
        state.isLogListSuccess = true;
        state.isLogListLoading = false;
        state.isLogListError = false;
      })
      .addCase(LogBookListFunc.rejected, (state, { payload }) => {
        state.LogListError = payload;
        state.isLogListError = true;
        state.isLogListSuccess = false;
        state.isLogListLoading = false;
      });
  },
});
export const { ClearstateLogList } = LogListSlice.actions;
export default LogListSlice.reducer;
