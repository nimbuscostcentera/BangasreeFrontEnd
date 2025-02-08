import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/passbook-dropdown`;

export const AgentPBList = createAsyncThunk(
  "AgentPBList",
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

const AgentPBSLice = createSlice({
  name: "AgentPBSLice",
  initialState: {
    isloading49: false,
    Resp49: [],
    error49: false,
    isError49: false,
    isSuccess49: false,
  },
  reducers: {
    ClearState49: (state) => {
      (state.isloading49 = false),
        (state.isError49 = false),
        (state.isSuccess49 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AgentPBList.pending, (state) => {
        state.isloading49 = true;
        state.isError49 = false;
        state.isSuccess49 = false;
      })
      .addCase(AgentPBList.fulfilled, (state, { payload }) => {
        state.Resp49 = payload;
        state.isSuccess49 = true;
        state.isloading49 = false;
        state.isError49 = false;
      })
      .addCase(AgentPBList.rejected, (state, { payload }) => {
        state.error49 = payload;
        state.isError49 = true;
        state.isSuccess49 = false;
        state.isloading49 = false;
      });
  },
});
export const { ClearState49 } = AgentPBSLice.actions;
export default AgentPBSLice.reducer;
