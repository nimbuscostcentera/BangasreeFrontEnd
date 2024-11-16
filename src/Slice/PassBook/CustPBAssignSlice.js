import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/passbook-custassign`;

export const CustPBAssignFunc = createAsyncThunk(
  "CustPBAssignFunc",
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

const CustPBAssignSlice = createSlice({
  name: "CustPBAssignSlice",
  initialState: {
    isloading51: false,
    Resp51: [],
    error51: false,
    isError51: false,
    isSuccess51: false,
  },
  reducers: {
    ClearState51: (state) => {
      (state.isloading51 = false),
        (state.isError51 = false),
        (state.isSuccess51 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CustPBAssignFunc.pending, (state) => {
        state.isloading51 = true;
        state.isError51 = false;
        state.isSuccess51 = false;
      })
      .addCase(CustPBAssignFunc.fulfilled, (state, { payload }) => {
        state.Resp51 = payload;
        state.isSuccess51 = true;
        state.isloading51 = false;
        state.isError51 = false;
      })
      .addCase(CustPBAssignFunc.rejected, (state, { payload }) => {
        state.error51 = payload;
        state.isError51 = true;
        state.isSuccess51 = false;
        state.isloading51 = false;
      });
  },
});
export const { ClearState51 } = CustPBAssignSlice.actions;
export default CustPBAssignSlice.reducer;
