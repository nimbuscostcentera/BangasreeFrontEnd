import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/session-list`;
export const SessionListfunc = createAsyncThunk(
  "SessionList",
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

const SessionListSlice = createSlice({
  name: "SessionList",
  initialState: {
    isloading71: false,
    Resp71: null,
    isError71: false,
    error71: "",
    isSuccess71: false,
  },
  reducers: {
    ClearState71: (state) => {
      (state.isloading71 = false),
        (state.isError71 = false),
        (state.isSuccess71 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SessionListfunc.pending, (state) => {
        state.isloading71 = true;
        state.isError71 = false;
        state.isSuccess71 = false;
      })
      .addCase(SessionListfunc.fulfilled, (state, { payload }) => {
        state.isloading71 = false;
        state.isError71 = false;
        state.isSuccess71 = true;
        state.Resp71 = payload;
      })
      .addCase(SessionListfunc.rejected, (state, { payload }) => {
        state.isloading71 = false;
        state.isError71 = true;
        state.isSuccess71 = false;
        state.error71 = payload;
      });
  },
});
export const { ClearState71 } = SessionListSlice.actions;
export default SessionListSlice.reducer;
