import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/superuser-approve`;

export const SuperUserStatusfunc = createAsyncThunk(
  "SuperUserStatus",
  async (UserData, { rejectWithValue }) => {
    try {
      var fetchingData = null;
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetchingData = await AxiosInstance.post(URL, UserData, config);

      const { data } = fetchingData;
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

const SuperUserStatusSlice = createSlice({
  name: "SuperUserStatusSlice",
  initialState: {
    isloading40: false,
    Resp40: [],
    error40: "",
    isError40: false,
    isSuccess40: false,
  },
  reducers: {
    ClearState40: (state) => {
      (state.isloading40 = false),
        (state.isError40 = false),
        (state.isSuccess40 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SuperUserStatusfunc.pending, (state) => {
        state.isloading40 = true;
        state.isError40 = false;
        state.isSuccess40 = false;
      })
      .addCase(SuperUserStatusfunc.fulfilled, (state, { payload }) => {
        state.Resp40 = payload;
        state.isSuccess40 = true;
        state.isloading40 = false;
        state.isError40 = false;
      })
      .addCase(SuperUserStatusfunc.rejected, (state, { payload }) => {
        state.error40 = payload;
        state.isError40 = true;
        state.isSuccess40 = false;
        state.isloading40 = false;
      });
  },
});
export const { ClearState40 } = SuperUserStatusSlice.actions;
export default SuperUserStatusSlice.reducer;
