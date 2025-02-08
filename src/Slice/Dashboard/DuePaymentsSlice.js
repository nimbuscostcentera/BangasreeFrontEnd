import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/customer-dues`;
export const DuePaymentsfunc = createAsyncThunk(
  "DuePayments",
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

const DuePaymentsSlice = createSlice({
  name: "DuePayments",
  initialState: {
    isloading66: false,
    Resp66: null,
    isError66: false,
    error66: "",
    isSuccess66: false,
  },
  reducers: {
    ClearState66: (state) => {
      (state.isloading66 = false),
        (state.isError66 = false),
        (state.isSuccess66 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(DuePaymentsfunc.pending, (state) => {
        state.isloading66 = true;
        state.isError66 = false;
        state.isSuccess66 = false;
      })
      .addCase(DuePaymentsfunc.fulfilled, (state, { payload }) => {
        state.isloading66 = false;
        state.isError66 = false;
        state.isSuccess66 = true;
        state.Resp66 = payload;
      })
      .addCase(DuePaymentsfunc.rejected, (state, { payload }) => {
        state.isloading66 = false;
        state.isError66 = true;
        state.isSuccess66 = false;
        state.error66 = payload;
      });
  },
});
export const { ClearState66 } = DuePaymentsSlice.actions;
export default DuePaymentsSlice.reducer;
