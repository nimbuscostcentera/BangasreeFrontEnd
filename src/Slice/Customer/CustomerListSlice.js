import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/customer-routes/customer-list`;
export const CustomerList = createAsyncThunk(
  "CustomerList",
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

const CustomerListSlice = createSlice({
  name: "CustomerList",
  initialState: {
    isloading6: false,
    CustomerDetail: [],
    isError6: false,
    error6: "",
    isSuccess6: false,
  },
  reducers: {
    ClearState6: (state) => {
    state.isloading6 = false,
      state.isError6 = false,
      state.isSuccess6 = false,
      state.error6=""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CustomerList.pending, (state) => {
        state.isloading6 = true;
        state.isError6 = false;
        state.isSuccess6 = false;
      })
      .addCase(CustomerList.fulfilled, (state, { payload }) => {
        state.isloading6 = false;
        state.isError6 = false;
        state.isSuccess6 = true;
        state.CustomerDetail = payload;
      })
      .addCase(CustomerList.rejected, (state, { payload }) => {
        state.isloading6 = false;
        state.isSuccess6 = false;
        state.isError6 = true;
        state.error6 = payload;
      });
  },
});
export const { ClearState6 } = CustomerListSlice.actions;
export default CustomerListSlice.reducer;
