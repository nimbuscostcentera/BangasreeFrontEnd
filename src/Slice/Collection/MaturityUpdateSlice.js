import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
import { config } from "dotenv";
const URL = `/superuser-routes/maturity-status`;

export const MaturityUpdate = createAsyncThunk(
  "MaturityUpdate",
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

const MaturityUpdateSlice = createSlice({
  name: "MaturityUpdate",
  initialState: {
    isloading32: false,
    Resp32: "",
    error32: "",
    isError32: false,
    isSuccess32: false,
  },
  reducers: {
    ClearState32: (state) => {
      (state.isloading32 = false),
        (state.isError32 = false),
        (state.isSuccess32 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(MaturityUpdate.pending, (state) => {
        state.isloading32 = true;
        state.isError32 = false;
        state.isSuccess32 = false;
      })
      .addCase(MaturityUpdate.fulfilled, (state, { payload }) => {
        state.isError32 = false;
        state.isloading32 = false;
        state.isSuccess32 = true;
        state.Resp32 = payload;
      })
      .addCase(MaturityUpdate.rejected, (state, { payload }) => {
        state.isloading32 = false;
        state.isError32 = true;
        state.isSuccess32 = false;
        state.error32 = payload;
      });
  },
});
export const { ClearState32 } = MaturityUpdateSlice.actions;
export default MaturityUpdateSlice.reducer;
