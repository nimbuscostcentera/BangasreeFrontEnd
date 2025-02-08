import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/agent-area-coll`;
export const AgentAreaCollfunc = createAsyncThunk(
  "AgentAreaColl",
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

const AgentAreaCollSlice = createSlice({
  name: "AgentAreaColl",
  initialState: {
    isloading73: false,
    Resp73: null,
    isError73: false,
    error73: "",
    isSuccess73: false,
  },
  reducers: {
    ClearState73: (state) => {
      (state.isloading73 = false),
        (state.isError73 = false),
        (state.isSuccess73 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AgentAreaCollfunc.pending, (state) => {
        state.isloading73 = true;
        state.isError73 = false;
        state.isSuccess73 = false;
      })
      .addCase(AgentAreaCollfunc.fulfilled, (state, { payload }) => {
        state.isloading73 = false;
        state.isError73 = false;
        state.isSuccess73 = true;
        state.Resp73 = payload;
      })
      .addCase(AgentAreaCollfunc.rejected, (state, { payload }) => {
        state.isloading73 = false;
        state.isError73 = true;
        state.isSuccess73 = false;
        state.error73 = payload;
      });
  },
});
export const { ClearState73 } = AgentAreaCollSlice.actions;
export default AgentAreaCollSlice.reducer;
