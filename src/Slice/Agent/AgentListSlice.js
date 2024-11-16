import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/agent-list`;

export const AgentList = createAsyncThunk(
  "AgentList",
  async (UserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      var fetchingData = await AxiosInstance.post(URL, UserData, config);
      const { data } = fetchingData;

      return data?.response;
    } catch (error) {
      //lo
      //
      return rejectWithValue(error.response.data.response);
    }
  }
);

const AgentListSlice = createSlice({
  name: "AgentListSlice",
  initialState: {
    isloading2: false,
    AgentListData: [],
    error2: null,
    isError2: false,
    isSuccess2: false,
  },
  reducers: {
    ClearState2: (state) => {
      (state.isloading2 = false),
        (state.isError2 = false),
        (state.isSuccess2 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AgentList.pending, (state) => {
        state.isloading2 = true;
        state.isError2 = false;
        state.isSuccess2 = false;
        state.error2 = null;
      })
      .addCase(AgentList.fulfilled, (state, { payload }) => {
        state.AgentListData = payload;
        state.isSuccess2 = true;
        state.isloading2 = false;
        state.isError2 = false;
      })
      .addCase(AgentList.rejected, (state, { payload }) => {
        state.error2 = payload;
        state.isError2 = true;
        state.isSuccess2 = false;
        state.isloading2 = false;
      });
  },
});
export const { ClearState2 } = AgentListSlice.actions;
export default AgentListSlice.reducer;
