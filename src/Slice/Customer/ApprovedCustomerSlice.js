import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/customer-routes/customer-dropdown`;

export const ApprovedCust = createAsyncThunk(
  "ApprovedCust",
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
        return rejectWithValue(error.response.data.response);
      } else {
        return rejectWithValue(error.response);
      }
    }
  }
);

const ApprovedCustSlice = createSlice({
  name: "ApprovedCustSlice",
  initialState: {
    isloading28: false,
    Resp28: [],
    error28: false,
    isError28: false,
    isSuccess28: false,
  },
  reducers: {
    ClearState28: (state) => {
      (state.isloading28 = false),
        (state.isError28 = false),
        (state.isSuccess28 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ApprovedCust.pending, (state) => {
        state.isloading28 = true;
        state.isError28 = false;
        state.isSuccess28 = false;
      })
      .addCase(ApprovedCust.fulfilled, (state, { payload }) => {
        state.Resp28 = payload;
        state.isSuccess28 = true;
        state.isloading28 = false;
        state.isError28 = false;
      })
      .addCase(ApprovedCust.rejected, (state, { payload }) => {
        state.error28 = payload;
        state.isError28 = true;
        state.isSuccess28 = false;
        state.isloading28 = false;
      });
  },
});
export const { ClearState28 } = ApprovedCustSlice.actions;
export default ApprovedCustSlice.reducer;
