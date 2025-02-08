import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/scheme-deletecustomer`;

export const CustAccDeletefunc = createAsyncThunk(
  "CustAccDelete",
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

const CustAccDeleteSlice = createSlice({
  name: "CustAccDeleteSlice",
  initialState: {
    isloading61: false,
    Resp61: "",
    error61: false,
    isError61: false,
    isSuccess61: false,
  },
  reducers: {
    ClearState61: (state) => {
      (state.isloading61 = false),
        (state.error61 = false),
        (state.isError61 = false),
        (state.isSuccess61 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CustAccDeletefunc.pending, (state) => {
        state.isloading61 = true;
        state.isError61 = false;
        state.isSuccess61 = false;
        state.error61 = false;
      })
      .addCase(CustAccDeletefunc.fulfilled, (state, { payload }) => {
        state.Resp61 = payload;
        state.isSuccess61 = true;
        state.isloading61 = false;
        state.isError61 = false;
        state.error61 = false;
      })
      .addCase(CustAccDeletefunc.rejected, (state, { payload }) => {
        state.error61 = payload;
        state.isError61 = true;
        state.isSuccess61 = false;
        state.isloading61 = false;
      });
  },
});
export const { ClearState61 } = CustAccDeleteSlice.actions;
export default CustAccDeleteSlice.reducer;
