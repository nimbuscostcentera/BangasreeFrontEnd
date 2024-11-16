import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/dashboard-yearlyreport`;
export const LineChartsfunc = createAsyncThunk(
  "LineCharts",
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

const LineChartsSlice = createSlice({
  name: "LineCharts",
  initialState: {
    isloading67: false,
    Resp67: null,
    isError67: false,
    error67: "",
    isSuccess67: false,
  },
  reducers: {
    ClearState67: (state) => {
      (state.isloading67 = false),
        (state.isError67 = false),
        (state.isSuccess67 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LineChartsfunc.pending, (state) => {
        state.isloading67 = true;
        state.isError67 = false;
        state.isSuccess67 = false;
      })
      .addCase(LineChartsfunc.fulfilled, (state, { payload }) => {
        state.isloading67 = false;
        state.isError67 = false;
        state.isSuccess67 = true;
        state.Resp67 = payload;
      })
      .addCase(LineChartsfunc.rejected, (state, { payload }) => {
        state.isloading67 = false;
        state.isError67 = true;
        state.isSuccess67 = false;
        state.error67 = payload;
      });
  },
});
export const { ClearState67 } = LineChartsSlice.actions;
export default LineChartsSlice.reducer;
