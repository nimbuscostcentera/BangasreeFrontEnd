import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/customer-collectionedit`;
export const CollectionEditfunc = createAsyncThunk(
  "CollectionEdit",
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

const CollectionEditSlice = createSlice({
  name: "CollectionEdit",
  initialState: {
    isloading59: false,
    Resp59: {},
    error59: "",
    isError59: false,
    isSuccess59: false,
  },
  reducers: {
    ClearState59: (state) => {
      (state.isloading59 = false),
        (state.isError59 = false),
        (state.isSuccess59 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CollectionEditfunc.pending, (state) => {
        state.isloading59 = true;
        state.isError59 = false;
        state.isSuccess59 = false;
      })
      .addCase(CollectionEditfunc.fulfilled, (state, { payload }) => {
        state.isError59 = false;
        state.isloading59 = false;
        state.isSuccess59 = true;
        state.Resp59 = payload;
      })
      .addCase(CollectionEditfunc.rejected, (state, { payload }) => {
        state.isloading59 = false;
        state.isError59 = true;
        state.isSuccess59 = false;
        state.error59 = payload;
      });
  },
});
export const { ClearState59 } = CollectionEditSlice.actions;
export default CollectionEditSlice.reducer;
