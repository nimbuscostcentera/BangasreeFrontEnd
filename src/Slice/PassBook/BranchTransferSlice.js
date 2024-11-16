import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/passbook-branchtransfer`;

export const BranchTransferPass = createAsyncThunk(
  "BranchTransferPass",
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

const BranchTransferSlice = createSlice({
  name: "BranchTransferSlice",
  initialState: {
    isloading59: false,
    Resp59: [],
    error59: false,
    isError59: false,
    isSuccess59: false,
  },
  reducers: {
    ClearState59: (state) => {
      (state.isloading59 = false),
        (state.isError59 = false),
        (state.isSuccess59 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(BranchTransferPass.pending, (state) => {
        state.isloading59 = true;
        state.isError59 = false;
        state.isSuccess59 = false;
      })
      .addCase(BranchTransferPass.fulfilled, (state, { payload }) => {
        state.Resp59 = payload;
        state.isSuccess59 = true;
        state.isloading59 = false;
        state.isError59 = false;
      })
      .addCase(BranchTransferPass.rejected, (state, { payload }) => {
        state.error59 = payload;
        state.isError59 = true;
        state.isSuccess59 = false;
        state.isloading59 = false;
      });
  },
});
export const { ClearState59 } = BranchTransferSlice.actions;
export default BranchTransferSlice.reducer;
