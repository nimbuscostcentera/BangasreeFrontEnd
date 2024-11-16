import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/show-goldrate`;

export const RateVsPurityFunc = createAsyncThunk(
  "RateVsPurity",
  async (UserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await AxiosInstance.post(URL, UserData, config);
      //
      return data?.response;
    } catch (error) {
      return rejectWithValue(error.response.data.response);
    }
  }
);

const RateVsPuritySlice = createSlice({
  name: "RateVsPurity",
  initialState: {
    isloading79: false,
    Resp79: {},
    error79: "",
    isError79: false,
    isSuccess79: false,
  },
  reducers: {
    ClearState79: (state) => {
      (state.isloading79 = false),
        (state.isError79 = false),
        (state.isSuccess79 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(RateVsPurityFunc.pending, (state) => {
        state.isloading79 = true;
        state.isError79 = false;
        state.isSuccess79 = false;
      })
      .addCase(RateVsPurityFunc.fulfilled, (state, { payload }) => {
        state.isError79 = false;
        state.isloading79 = false;
        state.isSuccess79 = true;
        state.Resp79 = payload;
      })
      .addCase(RateVsPurityFunc.rejected, (state, { payload }) => {
        state.isloading79 = false;
        state.isError79 = true;
        state.isSuccess79 = false;
        state.error79 = payload;
      });
  },
});
export const { ClearState79 } = RateVsPuritySlice.actions;
export default RateVsPuritySlice.reducer;
