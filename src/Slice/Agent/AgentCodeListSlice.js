import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/agentcode-list`;

export const AgentCodeList = createAsyncThunk(
  "AgentCodeList",
  async (UserData, { rejectWithValue }) => {
    var fetchingData;
    try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
      fetchingData = await AxiosInstance.post(URL, UserData, config);
      const { data } = fetchingData;
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

const AgentCodeListSlice = createSlice({
  name: "AgentCodeListSlice",
  initialState: {
    isloading1: false,
    Resp1: [],
    error1: "",
    isError1: false,
    isSuccess1: false,
  },
  reducers: {
    ClearState1: (state) => {
      (state.isloading1 = false),
        (state.isError1 = false),
        (state.isSuccess1 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AgentCodeList.pending, (state) => {
        state.isloading1 = true;
        state.isError1 = false;
        state.isSuccess1 = false;
      })
      .addCase(AgentCodeList.fulfilled, (state, { payload }) => {
        state.Resp1 = payload;
        state.isSuccess1 = true;
        state.isloading1 = false;
        state.isError1 = false;
      })
      .addCase(AgentCodeList.rejected, (state, { payload }) => {
        state.error1 = payload;
        state.isError1 = true;
        state.isSuccess1 = false;
        state.isloading1 = false;
      });
  },
});
export const { ClearState1 } = AgentCodeListSlice.actions;
export default AgentCodeListSlice.reducer;
