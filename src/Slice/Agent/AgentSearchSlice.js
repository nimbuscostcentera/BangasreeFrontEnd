import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/agent-search`;

export const AgentNameSearch = createAsyncThunk(
  "AgentNameSearch",
  async (UserData, { rejectWithValue }) => {
    try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
      const { data } = await AxiosInstance.get(
        `${URL}?Name=`,
        UserData,
        config
      );
      return data?.response;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const AgentSearchSlice = createSlice({
  name: "AgentNameSearchSlice",
  initialState: {
    isloading4: false,
    AgentSearch: [],
    error4: false,
    isError4: false,
    isSuccess4: false,
  },
  reducers: {
    ClearState4: (state) => {
      (state.isloading4 = false),
        (state.isError4 = false),
        (state.isSuccess4 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AgentNameSearch.pending, (state) => {
        state.isloading4 = true;
        state.isError4 = false;
        state.isSuccess4 = false;
      })
      .addCase(AgentNameSearch.fulfilled, (state, { payload }) => {
        state.AgentSearch = payload;
        state.isSuccess4 = true;
        state.isloading4 = false;
        state.isError4 = false;
      })
      .addCase(AgentNameSearch.rejected, (state, { payload }) => {
        state.error4 = payload;
        state.isError4 = true;
        state.isSuccess4 = false;
        state.isloading4 = false;
      });
  },
});
export const { ClearState4 } = AgentSearchSlice.actions;
export default AgentSearchSlice.reducer;
