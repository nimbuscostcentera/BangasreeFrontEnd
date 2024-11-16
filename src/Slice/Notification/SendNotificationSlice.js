import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/notification-routes/send-notification`;

export const SendNotification = createAsyncThunk(
  "SendNotification",
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
        return rejectWithValue(error.response.data.response);
      } else {
        return rejectWithValue(error.response);
      }
    }
  }
);

const SendNotificationSlice = createSlice({
  name: "SendNotificationSlice",
  initialState: {
    isloading45: false,
    Resp45: [],
    error45: false,
    isError45: false,
    isSuccess45: false,
  },
  reducers: {
    ClearState45: (state) => {
      (state.isloading45 = false),
        (state.isError45 = false),
        (state.isSuccess45 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SendNotification.pending, (state) => {
        state.isloading45 = true;
        state.isError45 = false;
        state.isSuccess45 = false;
      })
      .addCase(SendNotification.fulfilled, (state, { payload }) => {
        state.Resp45 = payload;
        state.isSuccess45 = true;
        state.isloading45 = false;
        state.isError45 = false;
      })
      .addCase(SendNotification.rejected, (state, { payload }) => {
        state.error45 = payload;
        state.isError45 = true;
        state.isSuccess45 = false;
        state.isloading45 = false;
      });
  },
});
export const { ClearState45 } = SendNotificationSlice.actions;
export default SendNotificationSlice.reducer;
