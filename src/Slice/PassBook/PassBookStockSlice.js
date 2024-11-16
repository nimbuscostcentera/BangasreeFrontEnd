import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/passbook-stock`;

export const PassBookStock = createAsyncThunk(
  "PassBookStock",
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

const PassBookStockSlice = createSlice({
  name: "PassBookStockSlice",
  initialState: {
    isloading43: false,
    Resp43: [],
    error43: false,
    isError43: false,
    isSuccess43: false,
  },
  reducers: {
    ClearState43: (state) => {
      (state.isloading43 = false),
        (state.isError43 = false),
        (state.isSuccess43 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(PassBookStock.pending, (state) => {
        state.isloading43 = true;
        state.isError43 = false;
        state.isSuccess43 = false;
      })
      .addCase(PassBookStock.fulfilled, (state, { payload }) => {
        state.Resp43 = payload;
        state.isSuccess43 = true;
        state.isloading43 = false;
        state.isError43 = false;
      })
      .addCase(PassBookStock.rejected, (state, { payload }) => {
        state.error43 = payload;
        state.isError43 = true;
        state.isSuccess43 = false;
        state.isloading43 = false;
      });
  },
});
export const { ClearState43 } = PassBookStockSlice.actions;
export default PassBookStockSlice.reducer;
