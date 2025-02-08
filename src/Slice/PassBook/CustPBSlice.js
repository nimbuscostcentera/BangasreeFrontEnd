import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/passbook-show`;

export const CustPBList = createAsyncThunk(
  "CustPBList",
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

const CustPBSlice = createSlice({
  name: "CustPBSlice",
  initialState: {
    isloading48: false,
    Resp48: [],
    error48: false,
    isError48: false,
    isSuccess48: false,
  },
  reducers: {
    ClearState48: (state) => {
      (state.isloading48 = false),
        (state.isError48 = false),
        (state.isSuccess48 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CustPBList.pending, (state) => {
        state.isloading48 = true;
        state.isError48 = false;
        state.isSuccess48 = false;
      })
      .addCase(CustPBList.fulfilled, (state, { payload }) => {
        state.Resp48 = payload;
        state.isSuccess48 = true;
        state.isloading48 = false;
        state.isError48 = false;
      })
      .addCase(CustPBList.rejected, (state, { payload }) => {
        state.error48 = payload;
        state.isError48 = true;
        state.isSuccess48 = false;
        state.isloading48 = false;
      });
  },
});
export const { ClearState48 } = CustPBSlice.actions;
export default CustPBSlice.reducer;
