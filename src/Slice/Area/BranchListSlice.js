import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/branch-dropdown`;

export const BranchList = createAsyncThunk(
  "BranchList",
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
      if (error.response && error.response.data.response) {
        return rejectWithValue(error.response.data.response);
      } else {
        return rejectWithValue(error.response);
      }
    }
  }
);

const BranchListSlice = createSlice({
  name: "BranchListSlice",
  initialState: {
    isloading35: false,
    Resp35: [],
    error35: false,
    isError35: false,
    isSuccess35: false,
  },
  reducers: {
    ClearState35: (state) => {
      (state.isloading35 = false),
        (state.isError35 = false),
        (state.isSuccess35 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(BranchList.pending, (state) => {
        state.isloading35 = true;
        state.isError35 = false;
        state.isSuccess35 = false;
      })
      .addCase(BranchList.fulfilled, (state, { payload }) => {
        state.Resp35 = payload;
        state.isSuccess35 = true;
        state.isloading35 = false;
        state.isError35 = false;
      })
      .addCase(BranchList.rejected, (state, { payload }) => {
        state.error35 = payload;
        state.isError35 = true;
        state.isSuccess35 = false;
        state.isloading35 = false;
      });
  },
});
export const { ClearState35 } = BranchListSlice.actions;
export default BranchListSlice.reducer;
