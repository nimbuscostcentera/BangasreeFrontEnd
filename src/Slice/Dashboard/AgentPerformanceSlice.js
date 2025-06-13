import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/agent-yearly-performance`;
export const AgentPerformancefunc = createAsyncThunk(
  "AgentPerformance",
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
        return rejectWithValue(error.response?.data?.response);
      } else {
        return rejectWithValue(error?.response);
      }
    }
  }
);

const AgentPerformanceSlice = createSlice({
  name: "AgentPerformance",
  initialState: {
    isloading72: false,
    Resp72: null,
    isError72: false,
    error72: "",
    isSuccess72: false,
  },
  reducers: {
    ClearState72: (state) => {
      (state.isloading72 = false),
        (state.isError72 = false),
        (state.isSuccess72 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AgentPerformancefunc.pending, (state) => {
        state.isloading72 = true;
        state.isError72 = false;
        state.isSuccess72 = false;
      })
      .addCase(AgentPerformancefunc.fulfilled, (state, { payload }) => {
        state.isloading72 = false;
        state.isError72 = false;
        state.isSuccess72 = true;
        state.Resp72 = payload;
      })
      .addCase(AgentPerformancefunc.rejected, (state, { payload }) => {
        state.isloading72 = false;
        state.isError72 = true;
        state.isSuccess72 = false;
        state.error72 = payload;
      });
  },
});
export const { ClearState72 } = AgentPerformanceSlice.actions;
export default AgentPerformanceSlice.reducer;
