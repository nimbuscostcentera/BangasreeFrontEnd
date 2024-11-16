import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/customer-collectionlist`;

export const CollectionList = createAsyncThunk(
  "CollectionList",
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

const CollectionListSlice = createSlice({
  name: "CollectionList",
  initialState: {
   isloading23: false,
    Response: {},
    error23: "",
    isError23: false,
    isSuccess23: false,
  },
  reducers: {
    ClearState23: (state) => {
      (state.isloading23 = false),
        (state.isError23 = false),
        (state.isSuccess23 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CollectionList.pending, (state) => {
        state.isloading23 = true;
        state.isError23 = false;
        state.isSuccess23 = false;
      })
      .addCase(CollectionList.fulfilled, (state, { payload }) => {
        state.isError23 = false;
        state.isloading23 = false;
        state.isSuccess23 = true;
        state.Response = payload;
      })
      .addCase(CollectionList.rejected, (state, { payload }) => {
        state.isloading23 = false;
        state.isError23 = true;
        state.isSuccess23 = false;
        state.error23 = payload;
      });
  },
});
export const { ClearState23 } = CollectionListSlice.actions;
export default CollectionListSlice.reducer;
