import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/customer-routes/monthly-payment`;
export const MontlyPaymentFunc = createAsyncThunk(
  "MontlyPayment",
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

const MontlyPaymentSlice = createSlice({
  name: "MontlyPayment",
  initialState: {
    isloading52: false,
    Resp52: [],
    error52: "",
    isError52: false,
    isSuccess52: false,
  },
  reducers: {
    ClearState52: (state) => {
      (state.isloading52 = false),
        (state.isError52 = false),
        (state.isSuccess52 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(MontlyPaymentFunc.pending, (state) => {
        state.isloading52 = true;
        state.isError52 = false;
        state.isSuccess52 = false;
      })
      .addCase(MontlyPaymentFunc.fulfilled, (state, { payload }) => {
        state.isError52 = false;
        state.isloading52 = false;
        state.isSuccess52 = true;
        state.Resp52 = payload;
      })
      .addCase(MontlyPaymentFunc.rejected, (state, { payload }) => {
        state.isloading52 = false;
        state.isError52 = true;
        state.isSuccess52 = false;
        state.error52 = payload;
      });
  },
});
export const { ClearState52 } = MontlyPaymentSlice.actions;
export default MontlyPaymentSlice.reducer;
