import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/dashboard-Maturity`;
export const PieChartsfunc = createAsyncThunk(
  "PieCharts",
  async (UserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await AxiosInstance.post(URL, UserData, config);
      return data?.pieData;
    } catch (error) {
      if (error.response && error.response.data.response) {
        return rejectWithValue(error.response?.data?.response);
      } else {
        return rejectWithValue(error?.response);
      }
    }
  }
);

const PieChartsSlice = createSlice({
  name: "PieCharts",
  initialState: {
    isloading68: false,
    Resp68: null,
    isError68: false,
    error68: "",
    isSuccess68: false,
  },
  reducers: {
    ClearState68: (state) => {
      (state.isloading68 = false),
        (state.isError68 = false),
        (state.isSuccess68 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(PieChartsfunc.pending, (state) => {
        state.isloading68 = true;
        state.isError68 = false;
        state.isSuccess68 = false;
      })
      .addCase(PieChartsfunc.fulfilled, (state, { payload }) => {
        state.isloading68 = false;
        state.isError68 = false;
        state.isSuccess68 = true;
        state.Resp68 = payload;
      })
      .addCase(PieChartsfunc.rejected, (state, { payload }) => {
        state.isloading68 = false;
        state.isError68 = true;
        state.isSuccess68 = false;
        state.error68 = payload;
      });
  },
});
export const { ClearState68 } = PieChartsSlice.actions;
export default PieChartsSlice.reducer;
