import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/customer-routes/customer-approve`;

export const CutomerStatusUpdate = createAsyncThunk(
  "CutomerStatusUpdate",
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

const CutomerStatusUpdateSlice = createSlice({
  name: "CutomerStatus",
  initialState: {
    isloading10: false,
    Msg10: "",
    error10: false,
    isError10: false,
    isSuccess10: false,
  },
  reducers: {
    ClearState10: (state) => {
      (state.isloading10 = false),
        (state.isError10 = false),
        (state.isSuccess10 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CutomerStatusUpdate.pending, (state) => {
        state.isloading10 = true;
        state.isError10 = false;
        state.isSuccess10 = false;
      })
      .addCase(CutomerStatusUpdate.fulfilled, (state, { payload }) => {
        state.Msg10 = payload;
        state.isSuccess10 = true;
        state.isloading10 = false;
        state.isError10 = false;
      })
      .addCase(CutomerStatusUpdate.rejected, (state, { payload }) => {
        state.error10 = payload;
        state.isError10 = true;
        state.isSuccess10 = false;
        state.isloading10 = false;
      });
  },
});
export const { ClearState10 } = CutomerStatusUpdateSlice.actions;
export default CutomerStatusUpdateSlice.reducer;
