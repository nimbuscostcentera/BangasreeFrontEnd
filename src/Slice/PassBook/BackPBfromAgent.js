import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/passbook-agentreturn`;

export const PBreturnFunc = createAsyncThunk(
  "BackPBformAgent",
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

const BackPBformAgentSlice = createSlice({
  name: "BackPBformAgent",
  initialState: {
    isloading56: false,
    Resp56: [],
    error56: false,
    isError56: false,
    isSuccess56: false,
  },
  reducers: {
    ClearState56: (state) => {
      state.isloading56 = false,
      state.isError56 = false,
      state.isSuccess56 = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(PBreturnFunc.pending, (state) => {
        state.isloading56 = true;
        state.isError56 = false;
        state.isSuccess56 = false;
      })
      .addCase(PBreturnFunc.fulfilled, (state, { payload }) => {
        state.Resp56 = payload;
        state.isSuccess56 = true;
        state.isloading56 = false;
        state.isError56 = false;
      })
      .addCase(PBreturnFunc.rejected, (state, { payload }) => {
        state.error56 = payload;
        state.isError56 = true;
        state.isSuccess56 = false;
        state.isloading56 = false;
      });
  },
});
export const { ClearState56 } = BackPBformAgentSlice.actions;
export default BackPBformAgentSlice.reducer;
