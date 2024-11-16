import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/dashboard-card`;
export const CardsDataFetchFunc = createAsyncThunk(
  "Cards",
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

const CardsSlice = createSlice({
  name: "Cards",
  initialState: {
    isloading63: false,
    Resp63:null,
    isError63: false,
    error63: "",
    isSuccess63: false,
  },
  reducers: {
    ClearState63: (state) => {
      (state.isloading63 = false),
        (state.isError63 = false),
        (state.isSuccess63 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CardsDataFetchFunc.pending, (state) => {
        state.isloading63 = true;
        state.isError63 = false;
        state.isSuccess63 = false;
      })
      .addCase(CardsDataFetchFunc.fulfilled, (state, { payload }) => {
        state.isloading63 = false;
        state.isError63 = false;
        state.isSuccess63 = true;
        state.Resp63 = payload;
      })
      .addCase(CardsDataFetchFunc.rejected, (state, { payload }) => {
        state.isloading63 = false;
        state.isError63 = true;
        state.isSuccess63 = false;
        state.error63 = payload;
      });
  },
});
export const { ClearState63 } = CardsSlice.actions;
export default CardsSlice.reducer;
