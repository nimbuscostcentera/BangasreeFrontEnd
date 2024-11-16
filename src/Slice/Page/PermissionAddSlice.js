import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/user-permissonadd`;

export const PermissionAdd = createAsyncThunk(
  "PermissionAdd",
  async (UserData, { rejectWithValue }) => {
    let fetchingData;
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

      return data?.response;
    } catch (error) {
      return rejectWithValue(error.response.data.response);
    }
  }
);

const PermissionAddSlice = createSlice({
  name: "PermissionAddSlice",
  initialState: {
    isloading15: false,
    msg15: [],
    error15: "",
    isError15: false,
    isSuccess15: false,
  },
  reducers: {
    ClearState15: (state) => {
      (state.isloading15 = false),
        (state.isError15 = false),
        (state.isSuccess15 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(PermissionAdd.pending, (state) => {
        state.isloading15 = true;
        state.isError15 = false;
        state.isSuccess15 = false;
      })
      .addCase(PermissionAdd.fulfilled, (state, { payload }) => {
        state.msg15 = payload;
        state.isSuccess15 = true;
        state.isloading15 = false;
        state.isError15 = false;
      })
      .addCase(PermissionAdd.rejected, (state, { payload }) => {
        state.error15 = payload;
        state.isError15 = true;
        state.isSuccess15 = false;
        state.isloading15 = false;
      });
  },
});
export const { ClearState15 } = PermissionAddSlice.actions;
export default PermissionAddSlice.reducer;
