import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/superuser-show`;

export const SuperUserList = createAsyncThunk(
  "SuperUserList",
  async (UserData, { rejectWithValue }) => {
    var fetchingData = null;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetchingData = await AxiosInstance.post(URL, UserData, config);
      const { data } = fetchingData;
      //console.log(data?.response);
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

const SuperUserListSlice = createSlice({
  name: "SuperUserListSlice",
  initialState: {
    isloading36: false,
    Resp36: [],
    error36: "",
    isError36: false,
    isSuccess36: false,
  },
  reducers: {
    ClearState36: (state) => {
      (state.isloading36 = false),
        (state.isError36 = false),
        (state.isSuccess36 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SuperUserList.pending, (state) => {
        state.isloading36 = true;
        state.isError36 = false;
        state.isSuccess36 = false;
      })
      .addCase(SuperUserList.fulfilled, (state, { payload }) => {
        state.Resp36 = payload;
        state.isSuccess36 = true;
        state.isloading36 = false;
        state.isError36 = false;
      })
      .addCase(SuperUserList.rejected, (state, { payload }) => {
        state.error36 = payload;
        state.isError36 = true;
        state.isSuccess36 = false;
        state.isloading36 = false;
      });
  },
});
export const { ClearState36 } = SuperUserListSlice.actions;
export default SuperUserListSlice.reducer;
