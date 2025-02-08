import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/delete-collection`;

export const DeleteCollFunc = createAsyncThunk(
  "DeleteCollection",
  async (UserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await AxiosInstance.post(URL, UserData, config);
      //
      return data?.response;
    } catch (error) {
      return rejectWithValue(error.response.data.response);
    }
  }
);

const DeleteCollectionSlice = createSlice({
  name: "DeleteCollection",
  initialState: {
    isloading75: false,
    Resp75: {},
    error75: "",
    isError75: false,
    isSuccess75: false,
  },
  reducers: {
    ClearState75: (state) => {
      (state.isloading75 = false),
        (state.isError75 = false),
        (state.isSuccess75 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(DeleteCollFunc.pending, (state) => {
        state.isloading75 = true;
        state.isError75 = false;
        state.isSuccess75 = false;
      })
      .addCase(DeleteCollFunc.fulfilled, (state, { payload }) => {
        state.isError75 = false;
        state.isloading75 = false;
        state.isSuccess75 = true;
        state.Resp75 = payload;
      })
      .addCase(DeleteCollFunc.rejected, (state, { payload }) => {
        state.isloading75 = false;
        state.isError75 = true;
        state.isSuccess75 = false;
        state.error75 = payload;
      });
  },
});
export const { ClearState75 } = DeleteCollectionSlice.actions;
export default DeleteCollectionSlice.reducer;
