import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/lead-edit`;
export const LeadEditfunc = createAsyncThunk(
  "ListEdit",
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
      return rejectWithValue(error.response.data.response);
    }
  }
);

const LeadEditSlice = createSlice({
  name: "LeadEdit",
  initialState: {
    isloading34: false,
    Resp34: "",
    error34: "",
    isError34: false,
    isSuccess34: false,
  },
  reducers: {
    ClearState34: (state) => {
    state.isloading34 = false,
    state.isError34 = false,
    state.isSuccess34 = false,
    state.Resp34 = "",
    state.error34=""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LeadEditfunc.pending, (state) => {
        state.isloading34 = true;
        state.isError34 = false;
        state.isSuccess34 = false;
      })
      .addCase(LeadEditfunc.fulfilled, (state, { payload }) => {
        state.isError34 = false;
        state.isloading34 = false;
        state.isSuccess34 = true;
        state.Resp34 = payload;
      })
      .addCase(LeadEditfunc.rejected, (state, { payload }) => {
        state.isloading34 = false;
        state.isError34 = true;
        state.isSuccess34 = false;
        state.error34 = payload;
      });
  },
});
export const { ClearState34 } = LeadEditSlice.actions;
export default LeadEditSlice.reducer;
