import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/page-list`;

export const PagePermissionAccess = createAsyncThunk(
  "PagePermissionAccess",
  async (UserData, { rejectWithValue }) => {
    //
    var fetchingData = null;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      if (UserData !== null) {
        fetchingData = await AxiosInstance.post(URL, UserData, config);
      }
      const { data } = fetchingData;
      //
      return data?.response;
    } catch (error) {
      return rejectWithValue(error.response.data.response);
    }
  }
);

const PageListSlice = createSlice({
  name: "PageListSlice",
  initialState: {
    isloading16: false,
    AccessID: [],
    error16: "",
    isError16: false,
    isSuccess16: false,
  },
  reducers: {
    ClearState16: (state) => {
      (state.isloading16 = false),
        (state.isError16 = false),
        (state.isSuccess16 = false);
      state.AccessID = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(PagePermissionAccess.pending, (state) => {
        state.isloading16 = true;
        state.isError16 = false;
        state.isSuccess16 = false;
      })
      .addCase(PagePermissionAccess.fulfilled, (state, { payload }) => {
        state.AccessID = payload;
        state.isSuccess16 = true;
        state.isloading16 = false;
        state.isError16 = false;
      })
      .addCase(PagePermissionAccess.rejected, (state, { payload }) => {
        state.error16 = payload;
        state.isError16 = true;
        state.isSuccess16 = false;
        state.isloading16 = false;
      });
  },
});
export const { ClearState16 } = PageListSlice.actions;
export default PageListSlice.reducer;
