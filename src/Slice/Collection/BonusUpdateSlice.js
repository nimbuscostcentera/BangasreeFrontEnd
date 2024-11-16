import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/bonus-status`;
export const BonusUpdate = createAsyncThunk(
  "BonusUpdate",
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
      return rejectWithValue(error.response.data.response);
    }
  }
);

const BonusUpdateSlice = createSlice({
  name: "BonusUpdate",
  initialState: {
    isloading33: false,
    Resp33: "",
    error33: "",
    isError33: false,
    isSuccess33: false,
  },
  reducers: {
    ClearState33: (state) => {
      (state.isloading33 = false),
        (state.isError33 = false),
        (state.isSuccess33 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(BonusUpdate.pending, (state) => {
        state.isloading33 = true;
        state.isError33 = false;
        state.isSuccess33 = false;
      })
      .addCase(BonusUpdate.fulfilled, (state, { payload }) => {
        state.isError33 = false;
        state.isloading33 = false;
        state.isSuccess33 = true;
        state.Resp33 = payload;
      })
      .addCase(BonusUpdate.rejected, (state, { payload }) => {
        state.isloading33 = false;
        state.isError33 = true;
        state.isSuccess33 = false;
        state.error33 = payload;
      });
  },
});
export const { ClearState33 } = BonusUpdateSlice.actions;
export default BonusUpdateSlice.reducer;
