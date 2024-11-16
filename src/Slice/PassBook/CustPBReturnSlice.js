import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/passbook-custreturn`;

export const CustPBReturnFunc = createAsyncThunk(
  "CustPBReturnFunc",
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

const CustPBReturnSlice = createSlice({
  name: "CustPBReturnSlice",
  initialState: {
    isloading60: false,
    Resp60: "",
    error60: false,
    isError60: false,
    isSuccess60: false,
  },
  reducers: {
    ClearState60: (state) => {
      (state.isloading60 = false),
        (state.isError60 = false),
        (state.isSuccess60 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CustPBReturnFunc.pending, (state) => {
        state.isloading60 = true;
        state.isError60 = false;
        state.isSuccess60 = false;
      })
      .addCase(CustPBReturnFunc.fulfilled, (state, { payload }) => {
        state.Resp60 = payload;
        state.isSuccess60 = true;
        state.isloading60 = false;
        state.isError60 = false;
      })
      .addCase(CustPBReturnFunc.rejected, (state, { payload }) => {
        state.error60 = payload;
        state.isError60 = true;
        state.isSuccess60 = false;
        state.isloading60 = false;
      });
  },
});
export const { ClearState60 } = CustPBReturnSlice.actions;
export default CustPBReturnSlice.reducer;
