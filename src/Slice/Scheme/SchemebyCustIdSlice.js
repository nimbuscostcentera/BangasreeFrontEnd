import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/customer-routes/scheme-dropdown`;

export const SchemeByCustId = createAsyncThunk(
  "SchemeByCustId",
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

const SchemeByCustIdSlice = createSlice({
  name: "SchemeByCustIdSlice",
  initialState: {
    isloading27: false,
    Resp27: [],
    error27: false,
    isError27: false,
    isSuccess27: false,
  },
  reducers: {
    ClearState27: (state) => {
      (state.isloading27 = false),
        (state.isError27 = false),
        (state.isSuccess27 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SchemeByCustId.pending, (state) => {
        state.isloading27 = true;
        state.isError27 = false;
        state.isSuccess27 = false;
      })
      .addCase(SchemeByCustId.fulfilled, (state, { payload }) => {
        state.Resp27 = payload;
        state.isSuccess27 = true;
        state.isloading27 = false;
        state.isError27 = false;
      })
      .addCase(SchemeByCustId.rejected, (state, { payload }) => {
        state.error27 = payload;
        state.isError27 = true;
        state.isSuccess27 = false;
        state.isloading27 = false;
      });
  },
});
export const { ClearState27 } = SchemeByCustIdSlice.actions;
export default SchemeByCustIdSlice.reducer;
