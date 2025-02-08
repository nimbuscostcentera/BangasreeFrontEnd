import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/passbook-create`;
export const PBGenFunc = createAsyncThunk(
  "PBGenFunc",
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

const PassBookGenerateSlice = createSlice({
  name: "PassBookGenerateSlice",
  initialState: {
    isloading52: false,
    Resp52: [],
    error52: false,
    isError52: false,
    isSuccess52: false,
  },
  reducers: {
    ClearState52: (state) => {
      (state.isloading52 = false),
        (state.isError52 = false),
        (state.isSuccess52 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(PBGenFunc.pending, (state) => {
        state.isloading52 = true;
        state.isError52 = false;
        state.isSuccess52 = false;
      })
      .addCase(PBGenFunc.fulfilled, (state, { payload }) => {
        state.Resp52 = payload;
        state.isSuccess52 = true;
        state.isloading52 = false;
        state.isError52 = false;
      })
      .addCase(PBGenFunc.rejected, (state, { payload }) => {
        state.error52 = payload;
        state.isError52 = true;
        state.isSuccess52 = false;
        state.isloading52 = false;
      });
  },
});
export const { ClearState52 } = PassBookGenerateSlice.actions;
export default PassBookGenerateSlice.reducer;
