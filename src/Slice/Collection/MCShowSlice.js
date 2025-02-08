import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/maturity-certificateshow`;

export const MCshowFunc = createAsyncThunk(
  "MCshowFunc",
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

const MCshowSlice = createSlice({
  name: "MCshow",
  initialState: {
    isloading65: false,
    resp65: "",
    error65: "",
    isError65: false,
    isSuccess65: false,
  },
  reducers: {
    ClearState65: (state) => {
      (state.isloading65 = false),
        (state.isError65 = false),
        (state.isSuccess65 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(MCshowFunc.pending, (state) => {
        state.isloading65 = true;
        state.isError65 = false;
        state.isSuccess65 = false;
      })
      .addCase(MCshowFunc.fulfilled, (state, { payload }) => {
        state.isError65 = false;
        state.isloading65 = false;
        state.isSuccess65 = true;
        state.resp65 = payload;
      })
      .addCase(MCshowFunc.rejected, (state, { payload }) => {
        state.isloading65 = false;
        state.isError65 = true;
        state.isSuccess65 = false;
        state.error65 = payload;
      });
  },
});
export const { ClearState65 } = MCshowSlice.actions;
export default MCshowSlice.reducer;
