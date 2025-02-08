import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/top-agent-collection`;
export const BarChartsfunc = createAsyncThunk(
  "BarCharts",
  async (UserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await AxiosInstance.post(URL, UserData, config);
      return data?.BarData;
    } catch (error) {
      if (error.response && error.response.data.response) {
        return rejectWithValue(error.response?.data?.response);
      } else {
        return rejectWithValue(error?.response);
      }
    }
  }
);

const BarChartsSlice = createSlice({
  name: "BarCharts",
  initialState: {
    isloading69: false,
    Resp69: null,
    isError69: false,
    error69: "",
    isSuccess69: false,
  },
  reducers: {
    ClearState69: (state) => {
      (state.isloading69 = false),
        (state.isError69 = false),
        (state.isSuccess69 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(BarChartsfunc.pending, (state) => {
        state.isloading69 = true;
        state.isError69 = false;
        state.isSuccess69 = false;
      })
      .addCase(BarChartsfunc.fulfilled, (state, { payload }) => {
        state.isloading69 = false;
        state.isError69 = false;
        state.isSuccess69 = true;
        state.Resp69 = payload;
      })
      .addCase(BarChartsfunc.rejected, (state, { payload }) => {
        state.isloading69 = false;
        state.isError69 = true;
        state.isSuccess69 = false;
        state.error69 = payload;
      });
  },
});
export const { ClearState69 } = BarChartsSlice.actions;
export default BarChartsSlice.reducer;
