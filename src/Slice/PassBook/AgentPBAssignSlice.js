import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/passbook-agentassign`;

export const AgentPBAssign = createAsyncThunk(
  "AgentPBAssign",
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

const AgentPBAssignSlice = createSlice({
  name: "AgentPBAssignSlice",
  initialState: {
    isloading50: false,
    Resp50:"",
    error50: false,
    isError50: false,
    isSuccess50: false,
  },
  reducers: {
    ClearState50: (state) => {
      (state.isloading50 = false),
        (state.isError50 = false),
        (state.isSuccess50 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AgentPBAssign.pending, (state) => {
        state.isloading50 = true;
        state.isError50 = false;
        state.isSuccess50 = false;
      })
      .addCase(AgentPBAssign.fulfilled, (state, { payload }) => {
        state.Resp50 = payload;
        state.isSuccess50 = true;
        state.isloading50 = false;
        state.isError50 = false;
      })
      .addCase(AgentPBAssign.rejected, (state, { payload }) => {
        state.error50 = payload;
        state.isError50 = true;
        state.isSuccess50 = false;
        state.isloading50 = false;
      });
  },
});
export const { ClearState50 } = AgentPBAssignSlice.actions;
export default AgentPBAssignSlice.reducer;
