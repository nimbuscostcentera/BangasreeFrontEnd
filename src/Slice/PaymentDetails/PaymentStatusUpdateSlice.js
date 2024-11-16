import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/colection-status`;
export const PaymentStatusUpdate = createAsyncThunk(
  "PaymentStatusUpdate",
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

const PaymentStatusUpdateSlice = createSlice({
  name: "PaymentStatusUpdate",
  initialState: {
    isloading30: false,
    Resp30: "",
    error30: "",
    isError30: false,
    isSuccess30: false,
  },
  reducers: {
    ClearState30: (state) => {
      (state.isloading30 = false),
        (state.isError30 = false),
        (state.isSuccess30 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(PaymentStatusUpdate.pending, (state) => {
        state.isloading30 = true;
        state.isError30 = false;
        state.isSuccess30 = false;
      })
      .addCase(PaymentStatusUpdate.fulfilled, (state, { payload }) => {
        state.isError30 = false;
        state.isloading30 = false;
        state.isSuccess30 = true;
        state.Resp30 = payload;
      })
      .addCase(PaymentStatusUpdate.rejected, (state, { payload }) => {
        state.isloading30 = false;
        state.isError30 = true;
        state.isSuccess30 = false;
        state.error30 = payload;
      });
  },
});
export const { ClearState30 } = PaymentStatusUpdateSlice.actions;
export default PaymentStatusUpdateSlice.reducer;
