import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/designation-dropdown`;

export const DesListFunc = createAsyncThunk(
  "DesignationList",
  async (UserData, { rejectWithValue }) => {
    var fetchingData = null;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetchingData = await AxiosInstance.post(URL, UserData, config);

      const { data } = fetchingData;
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

const DesignationListSlice = createSlice({
  name: "DesignationListSlice",
  initialState: {
    isloading54: false,
    Resp54: [],
    error54: "",
    isError54: false,
    isSuccess54: false,
  },
  reducers: {
    ClearState54: (state) => {
      (state.isloading54 = false),
        (state.isError54 = false),
        (state.isSuccess54 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(DesListFunc.pending, (state) => {
        state.isloading54 = true;
        state.isError54 = false;
        state.isSuccess54 = false;
      })
      .addCase(DesListFunc.fulfilled, (state, { payload }) => {
        state.Resp54 = payload;
        state.isSuccess54 = true;
        state.isloading54 = false;
        state.isError54 = false;
      })
      .addCase(DesListFunc.rejected, (state, { payload }) => {
        state.error54 = payload;
        state.isError54 = true;
        state.isSuccess54 = false;
        state.isloading54 = false;
      });
  },
});
export const { ClearState54 } = DesignationListSlice.actions;
export default DesignationListSlice.reducer;
