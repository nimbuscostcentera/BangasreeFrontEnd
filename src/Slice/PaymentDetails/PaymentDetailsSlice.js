import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/customer-routes/cust-detail-payment`;
export const PaymentDetailList = createAsyncThunk(
  "PaymentDetailList",
  async (UserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await AxiosInstance.post(URL, UserData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.response);
    }
  }
);

const PaymentDetailListSlice = createSlice({
  name: "PaymentDetailList",
  initialState: {
    isloading29: false,
    Resp29: [],
    pagination:{},
    error29: "",
    isError29: false,
    isSuccess29: false,
  },
  reducers: {
    ClearState29: (state) => {
      state.isloading29 = false,
      state.isError29 = false,
      state.isSuccess29 = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(PaymentDetailList.pending, (state) => {
        state.isloading29 = true;
        state.isError29 = false;
        state.isSuccess29 = false;
      })
      .addCase(PaymentDetailList.fulfilled, (state, { payload }) => {
        state.isError29 = false;
        state.isloading29 = false;
        state.isSuccess29 = true;
        state.Resp29 = payload?.response;
        state.pagination = payload?.pagination;
      })
      .addCase(PaymentDetailList.rejected, (state, { payload }) => {
        state.isloading29 = false;
        state.isError29 = true;
        state.isSuccess29 = false;
        state.error29 = payload;
      });
  },
});
export const { ClearState29 } = PaymentDetailListSlice.actions;
export default PaymentDetailListSlice.reducer;
