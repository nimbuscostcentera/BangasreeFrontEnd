import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const URL = `/agent-routes/agentById`;
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
export const AgentById = createAsyncThunk(
  "AgentById",
  async (UserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await AxiosInstance.post(URL, UserData, config);
      let resp = data?.response[0];
      return resp;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const AgentByIdSlice = createSlice({
  name: "AgentByIdSlice",
  initialState: {
    isloading22: false,
    AgentByIdDetails: {},
    error22: false,
    isError22: false,
    isSuccess22: false,
  },
  reducers: {
    ClearState22: (state) => {
      (state.isloading22 = false),
        (state.isError22 = false),
        (state.isSuccess22 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AgentById.pending, (state) => {
        state.isloading22 = true;
        state.isError22 = false;
        state.isSuccess22 = false;
      })
      .addCase(AgentById.fulfilled, (state, { payload }) => {
        state.AgentByIdDetails = payload;
        state.isSuccess22 = true;
        state.isloading22 = false;
        state.isError22 = false;
      })
      .addCase(AgentById.rejected, (state, { payload }) => {
        state.error22 = payload;
        state.isError22 = true;
        state.isSuccess22 = false;
        state.isloading22 = false;
      });
  },
});
export const { ClearState22 } = AgentByIdSlice.actions;
export default AgentByIdSlice.reducer;
