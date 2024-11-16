import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/auth-routes/lead-registration`;
export const LeadCustomer = createAsyncThunk(
  "Auth/LeadCustomer",
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
      // return custom error message from backend if present
      if (error.response && error.response.data.response) {
        return rejectWithValue(error.response?.data?.response);
      } else {
        return rejectWithValue(error?.response);
      }
    }
  }
);

const PortableCustomerSlice = createSlice({
  name: "LeadCusReg",
  initialState: {
    isloading25: false,
    msg25: [],
    isError25: false,
    error25: "",
    isSuccess25: false,
  },
  reducers: {
    ClearState25: (state) => {
      (state.isloading25 = false),
        (state.isError25 = false),
        (state.isSuccess25 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LeadCustomer.pending, (state) => {
        state.isloading25 = true;
        state.isError25 = false;
        state.isSuccess25 = false;
      })
      .addCase(LeadCustomer.fulfilled, (state, { payload }) => {
        state.isloading25 = false;
        state.isError25 = false;
        (state.isSuccess25 = true), (state.msg25 = payload);
      })
      .addCase(LeadCustomer.rejected, (state, { payload }) => {
        state.isloading25 = false;
        state.isError25 = true;
        state.isSuccess25 = false;
        state.error25 = payload;
      });
  },
});
export const { ClearState25 } = PortableCustomerSlice.actions;
export default PortableCustomerSlice.reducer;
