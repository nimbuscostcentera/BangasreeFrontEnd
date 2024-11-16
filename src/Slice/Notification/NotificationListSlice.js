import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/notification-routes/show-notification`;

export const NotificationList = createAsyncThunk(
  "NotificationList",
  async (UserData, { rejectWithValue }) => {
    try {
      //
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

const NotificationListSlice = createSlice({
  name: "NotificationListSlice",
  initialState: {
    isloading44: false,
    Resp44: [],
    error44: false,
    isError44: false,
    isSuccess44: false,
  },
  reducers: {
    ClearState44: (state) => {
      (state.isloading44 = false),
        (state.isError44 = false),
        (state.isSuccess44 = false);
      state.Resp44 = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(NotificationList.pending, (state) => {
        state.isloading44 = true;
        state.isError44 = false;
        state.isSuccess44 = false;
      })
      .addCase(NotificationList.fulfilled, (state, { payload }) => {
        state.Resp44 = payload;
        state.isSuccess44 = true;
        state.isloading44 = false;
        state.isError44 = false;
      })
      .addCase(NotificationList.rejected, (state, { payload }) => {
        state.error44 = payload;
        state.isError44 = true;
        state.isSuccess44 = false;
        state.isloading44 = false;
      });
  },
});
export const { ClearState44 } = NotificationListSlice.actions;
export default NotificationListSlice.reducer;
