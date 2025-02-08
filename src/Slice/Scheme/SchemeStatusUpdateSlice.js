import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/scheme-approve`;

export const SchemeStatusUpdate = createAsyncThunk(
  "SchemeStatusUpdate",
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

const SchemeStatusUpdateSlice = createSlice({
  name: "SchemeStatusUpdateSlice",
  initialState: {
    isloading21: false,
    Msg21: [],
    error21: false,
    isError21: false,
    isSuccess21: false,
  },
  reducers: {
    ClearState21: (state) => {
      (state.isloading21 = false),
        (state.error21 = false),
        (state.isError21 = false),
        (state.isSuccess21 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SchemeStatusUpdate.pending, (state) => {
        state.isloading21 = true;
        state.isError21 = false;
        state.isSuccess21 = false;
        state.error21 = false;
      })
      .addCase(SchemeStatusUpdate.fulfilled, (state, { payload }) => {
        state.Msg21 = payload;
        state.isSuccess21 = true;
        state.isloading21 = false;
        state.isError21 = false;
        state.error21 = false;
      })
      .addCase(SchemeStatusUpdate.rejected, (state, { payload }) => {
        state.error21 = payload;
        state.isError21 = true;
        state.isSuccess21 = false;
        state.isloading21 = false;
      });
  },
});
export const { ClearState21 } = SchemeStatusUpdateSlice.actions;
export default SchemeStatusUpdateSlice.reducer;
