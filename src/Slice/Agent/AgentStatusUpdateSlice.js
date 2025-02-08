import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/agent-approve`;

export const AgentStatusUpdate = createAsyncThunk(
  "AgentStatusUpdate",
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

const AgentStatusUpdateSlice = createSlice({
  name: "AgentStatus",
  initialState: {
    isloading9: false,
    UpdateMsg: "",
    error9: false,
    isError9: false,
    isSuccess9: false,
  },
  reducers: {
    ClearState9: (state) => {
      (state.isloading9 = false),
        (state.isError9 = false),
        (state.isSuccess9 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AgentStatusUpdate.pending, (state) => {
        state.isloading9 = true;
        state.isError9 = false;
        state.isSuccess9 = false;
      })
      .addCase(AgentStatusUpdate.fulfilled, (state, { payload }) => {
        state.UpdateMsg = payload;
        state.isSuccess9 = true;
        state.isloading9 = false;
        state.isError9 = false;
      })
      .addCase(AgentStatusUpdate.rejected, (state, { payload }) => {
        state.error9 = payload;
        state.isError9 = true;
        state.isSuccess9 = false;
        state.isloading9 = false;
      });
  },
});
export const { ClearState9 } = AgentStatusUpdateSlice.actions;
export default AgentStatusUpdateSlice.reducer;
