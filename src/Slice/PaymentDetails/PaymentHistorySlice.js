import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/customer-routes/custpayment-history`;
export const PaymentHistoryFunc = createAsyncThunk(
  "PaymentHistory",
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
      return rejectWithValue(error.response.data.response);
    }
  }
);

const PaymentHistorySlice = createSlice({
  name: "PaymentHistory",
  initialState: {
    isPayHistoryLoading: false,
    PaymentHistoryList: [],
    PaymentHistoryErrMsg: "",
    isPayHistoryErr: false,
    isPayHistorySucc: false,
  },
  reducers: {
    ClearStatePayHistory: (state) => {
      (state.isPayHistoryLoading = false),
        (state.isPayHistoryErr = false),
        (state.isPayHistorySucc = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(PaymentHistoryFunc.pending, (state) => {
        state.isPayHistoryLoading = true;
        state.isPayHistoryErr = false;
        state.isPayHistorySucc = false;
      })
      .addCase(PaymentHistoryFunc.fulfilled, (state, { payload }) => {
        state.isPayHistoryErr = false;
        state.isPayHistoryLoading = false;
        state.isPayHistorySucc = true;
        state.PaymentHistoryList = payload;
      })
      .addCase(PaymentHistoryFunc.rejected, (state, { payload }) => {
        state.isPayHistoryLoading = false;
        state.isPayHistoryErr = true;
        state.isPayHistorySucc = false;
        state.PaymentHistoryErrMsg = payload;
      });
  },
});
export const { ClearStatePayHistory } = PaymentHistorySlice.actions;
export default PaymentHistorySlice.reducer;
