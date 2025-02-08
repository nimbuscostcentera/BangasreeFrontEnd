import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/maturity-certificate`;

export const MCgenFunc = createAsyncThunk(
  "MCgenFunc",
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

const MaturityCertificateCreateSlice = createSlice({
  name: "MaturityCertificateCreate",
  initialState: {
    isloading64: false,
    Resp64: "",
    error64: "",
    isError64: false,
    isSuccess64: false,
  },
  reducers: {
    ClearState64: (state) => {
      (state.isloading64 = false),
        (state.isError64 = false),
        (state.isSuccess64 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(MCgenFunc.pending, (state) => {
        state.isloading64 = true;
        state.isError64 = false;
        state.isSuccess64 = false;
      })
      .addCase(MCgenFunc.fulfilled, (state, { payload }) => {
        state.isError64 = false;
        state.isloading64 = false;
        state.isSuccess64 = true;
        state.Resp64 = payload;
      })
      .addCase(MCgenFunc.rejected, (state, { payload }) => {
        state.isloading64 = false;
        state.isError64 = true;
        state.isSuccess64 = false;
        state.error64 = payload;
      });
  },
});
export const { ClearState64 } = MaturityCertificateCreateSlice.actions;
export default MaturityCertificateCreateSlice.reducer;
