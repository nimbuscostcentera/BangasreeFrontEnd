import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
import { config } from "dotenv";
const URL = `/superuser-routes/branch-approve`;

export const BranchStatusfunc = createAsyncThunk(
  "BranchStatus",
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

const BranchStatusSlice = createSlice({
  name: "BranchStatusSlice",
  initialState: {
    isloading38: false,
    Resp38: [],
    error38: false,
    isError38: false,
    isSuccess38: false,
  },
  reducers: {
    ClearState38: (state) => {
      (state.isloading38 = false),
        (state.isError38 = false),
        (state.isSuccess38 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(BranchStatusfunc.pending, (state) => {
        state.isloading38 = true;
        state.isError38 = false;
        state.isSuccess38 = false;
      })
      .addCase(BranchStatusfunc.fulfilled, (state, { payload }) => {
        state.Resp38 = payload;
        state.isSuccess38 = true;
        state.isloading38 = false;
        state.isError38 = false;
      })
      .addCase(BranchStatusfunc.rejected, (state, { payload }) => {
        state.error38 = payload;
        state.isError38 = true;
        state.isSuccess38 = false;
        state.isloading38 = false;
      });
  },
});
export const { ClearState38 } = BranchStatusSlice.actions;
export default BranchStatusSlice.reducer;
