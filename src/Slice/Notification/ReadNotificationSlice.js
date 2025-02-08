import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/notification-routes/read-notification`;

export const ReadNotification = createAsyncThunk(
  "ReadNotification",
  async (UserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await AxiosInstance.post(URL, UserData, config);
      //
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

const ReadNotificationSlice = createSlice({
  name: "ReadNotificationSlice",
  initialState: {
    isloading46: false,
    Resp46: [],
    error46: false,
    isError46: false,
    isSuccess46: false,
  },
  reducers: {
    ClearState46: (state) => {
      (state.isloading46 = false),
        (state.isError46 = false),
        (state.isSuccess46 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ReadNotification.pending, (state) => {
        state.isloading46 = true;
        state.isError46 = false;
        state.isSuccess46 = false;
      })
      .addCase(ReadNotification.fulfilled, (state, { payload }) => {
        state.Resp46 = payload;
        state.isSuccess46 = true;
        state.isloading46 = false;
        state.isError46 = false;
      })
      .addCase(ReadNotification.rejected, (state, { payload }) => {
        state.error46 = payload;
        state.isError46 = true;
        state.isSuccess46 = false;
        state.isloading46 = false;
      });
  },
});
export const { ClearState46 } = ReadNotificationSlice.actions;
export default ReadNotificationSlice.reducer;
