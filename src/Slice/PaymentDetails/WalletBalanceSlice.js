import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/customer-routes/wallet-balance`;
export const WalletBalanceFunc = createAsyncThunk(
  "WalletBalance",
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

const WalletBalanceSlice = createSlice({
  name: "WalletBalance",
  initialState: {
    isloading53: false,
    Resp53: [],
    error53: "",
    isError53: false,
    isSuccess53: false,
  },
  reducers: {
    ClearState53: (state) => {
      (state.isloading53 = false),
        (state.isError53 = false),
        (state.isSuccess53 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(WalletBalanceFunc.pending, (state) => {
        state.isloading53 = true;
        state.isError53 = false;
        state.isSuccess53 = false;
      })
      .addCase(WalletBalanceFunc.fulfilled, (state, { payload }) => {
        state.isError53 = false;
        state.isloading53 = false;
        state.isSuccess53 = true;
        state.Resp53 = payload;
      })
      .addCase(WalletBalanceFunc.rejected, (state, { payload }) => {
        state.isloading53 = false;
        state.isError53 = true;
        state.isSuccess53 = false;
        state.error53 = payload;
      });
  },
});
export const { ClearState53 } = WalletBalanceSlice.actions;
export default WalletBalanceSlice.reducer;
