import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/customer-routes/lead-list`;

export const LeadCustList = createAsyncThunk(
  "LeadCustList",
  async (UserData, { rejectWithValue }) => {
    var fetchingData = null;
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

const LeadCustListSlice = createSlice({
  name: "LeadCustListSlice",
  initialState: {
    isloading26: false,
    LeadCustData: [],
    error26: null,
    isError26: false,
    isSuccess26: false,
  },
  reducers: {
    ClearState26: (state) => {
      (state.isloading26 = false),
        (state.isError26 = false),
        (state.isSuccess26 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LeadCustList.pending, (state) => {
        state.isloading26 = true;
        state.isError26 = false;
        state.isSuccess26 = false;
      })
      .addCase(LeadCustList.fulfilled, (state, { payload }) => {
        state.LeadCustData = payload;
        state.isSuccess26 = true;
        state.isloading26 = false;
        state.isError26 = false;
      })
      .addCase(LeadCustList.rejected, (state, { payload }) => {
        state.error26 = payload;
        state.isError26 = true;
        state.isSuccess26 = false;
        state.isloading26 = false;
      });
  },
});
export const { ClearState26 } = LeadCustListSlice.actions;
export default LeadCustListSlice.reducer;
