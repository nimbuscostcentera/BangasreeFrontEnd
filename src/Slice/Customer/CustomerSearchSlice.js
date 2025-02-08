import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/customer-routes/customer-search`;
export const CustomerSearch = createAsyncThunk(
  "CustomerSearch",
  async (UserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await AxiosInstance.get(
        `${URL}?CustomerName=` + UserData,
        config
      );

      return data?.response;
    } catch (error) {
      // return custom error message from backend if present
      if (error.response && error.response.data.response) {
        return rejectWithValue(error.response?.data?.response);
      } else {
        return rejectWithValue(error?.response);
      }
    }
  }
);

const CustomerSearchSlice = createSlice({
  name: "CustomerSearch",
  initialState: {
    isloading8: false,
    CustomerSearchData: [],
    isError8: false,
    error8: "",
    isSuccess8: false,
  },
  reducers: {
    ClearState8: (state) => {
      (state.isloading8 = false),
        (state.isError8 = false),
        (state.isSuccess8 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CustomerSearch.pending, (state) => {
        state.isloading8 = true;
        state.isError8 = false;
        state.isSuccess8 = false;
      })
      .addCase(CustomerSearch.fulfilled, (state, { payload }) => {
        state.isloading8 = false;
        state.isError8 = false;
        (state.isSuccess8 = true), (state.CustomerSearchData = payload);
      })
      .addCase(CustomerSearch.rejected, (state, { payload }) => {
        state.isloading8 = false;
        state.isError8 = true;
        state.isSuccess8 = false;
        state.error8 = payload;
      });
  },
});
export const { ClearState8 } = CustomerSearchSlice.actions;
export default CustomerSearchSlice.reducer;
