import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/customer-collection`;
export const CollectionEntryfunc = createAsyncThunk(
  "CollectionEntry",
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

const CollectionEntrySlice = createSlice({
  name: "CollectionEntry",
  initialState: {
    isloading24: false,
    Response: {},
    error24: "",
    isError24: false,
    isSuccess24: false,
  },
  reducers: {
    ClearState24: (state) => {
      (state.isloading24 = false),
        (state.isError24 = false),
        (state.isSuccess24 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CollectionEntryfunc.pending, (state) => {
        state.isloading24 = true;
        state.isError24 = false;
        state.isSuccess24 = false;
      })
      .addCase(CollectionEntryfunc.fulfilled, (state, { payload }) => {
        state.isError24 = false;
        state.isloading24 = false;
        state.isSuccess24 = true;
        state.Response = payload;
      })
      .addCase(CollectionEntryfunc.rejected, (state, { payload }) => {
        state.isloading24 = false;
        state.isError24 = true;
        state.isSuccess24 = false;
        state.error24 = payload;
      });
  },
});
export const { ClearState24 } = CollectionEntrySlice.actions;
export default CollectionEntrySlice.reducer;
