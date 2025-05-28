import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/customer-routes/agent_transfer`;
export const CustomerTransferFunc= createAsyncThunk(
  "CustomerTransfer",
  async (UserData, { rejectWithValue }) => {
    var fetchData;
    try {
      if (UserData) {
        fetchData = await AxiosInstance.post(URL, UserData);
      } else {
        fetchData = await AxiosInstance.post(URL);
      }
      const { data } = fetchData;
      return data?.response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.response);
    }
  }
);

const CustomerTransferSlice = createSlice({
  name: "CustomerTransfer",
  initialState: {
    isCustomerTransferLoading: false,
    CustomerTransferRes:"",
    isCustomerTransferErr: false,
    CustomerTransferErr: "",
    isCustomerTransferSucc: false,
  },
  reducers: {
    ClearStateCustomerTransfer: (state) => {
    state.isCustomerTransferLoading = false,
    state.isCustomerTransferErr = false,
    state.isCustomerTransferSucc = false,
    state.CustomerTransferErr = ""
    state.CustomerTransferRes="";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CustomerTransferFunc.pending, (state) => {
        state.isCustomerTransferLoading = true;
        state.isCustomerTransferErr = false;
        state.isCustomerTransferSucc = false;
      })
      .addCase(CustomerTransferFunc.fulfilled, (state, { payload }) => {
        state.isCustomerTransferLoading = false;
        state.isCustomerTransferErr = false;
        state.isCustomerTransferSucc = true;
        state.CustomerTransferRes = payload;
      })
      .addCase(CustomerTransferFunc.rejected, (state, { payload }) => {
        state.isCustomerTransferLoading = false;
        state.isCustomerTransferSucc = false;
        state.isCustomerTransferErr = true;
        state.CustomerTransferErr = payload;
      });
  },
});
export const { ClearStateCustomerTransfer } = CustomerTransferSlice.actions;
export default CustomerTransferSlice.reducer;
