import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/due-leads`;
export const DueLeadfunc = createAsyncThunk(
  "DueLead",
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
        return rejectWithValue(error.response?.data?.response);
      } else {
        return rejectWithValue(error?.response);
      }
    }
  }
);

const DueLeadSlice = createSlice({
  name: "DueLead",
  initialState: {
    isloading74: false,
    Resp74: null,
    isError74: false,
    error74: "",
    isSuccess74: false,
  },
  reducers: {
    ClearState74: (state) => {
      (state.isloading74 = false),
        (state.isError74 = false),
        (state.isSuccess74 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(DueLeadfunc.pending, (state) => {
        state.isloading74 = true;
        state.isError74 = false;
        state.isSuccess74 = false;
      })
      .addCase(DueLeadfunc.fulfilled, (state, { payload }) => {
        state.isloading74 = false;
        state.isError74 = false;
        state.isSuccess74 = true;
        state.Resp74 = payload;
      })
      .addCase(DueLeadfunc.rejected, (state, { payload }) => {
        state.isloading74 = false;
        state.isError74 = true;
        state.isSuccess74 = false;
        state.error74 = payload;
      });
  },
});
export const { ClearState74 } = DueLeadSlice.actions;
export default DueLeadSlice.reducer;
