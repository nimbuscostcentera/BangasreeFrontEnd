import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/user-list`;

export const UserListfunc = createAsyncThunk(
  "UserList",
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

const UserListSlice = createSlice({
  name: "UserListSlice",
  initialState: {
    isloading47: false,
    Resp47: [],
    error47: false,
    isError47: false,
    isSuccess47: false,
  },
  reducers: {
    ClearState47: (state) => {
      (state.isloading47 = false),
        (state.isError47 = false),
        (state.isSuccess47 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(UserListfunc.pending, (state) => {
        state.isloading47 = true;
        state.isError47 = false;
        state.isSuccess47 = false;
      })
      .addCase(UserListfunc.fulfilled, (state, { payload }) => {
        state.Resp47 = payload;
        state.isSuccess47 = true;
        state.isloading47 = false;
        state.isError47 = false;
      })
      .addCase(UserListfunc.rejected, (state, { payload }) => {
        state.error47 = payload;
        state.isError47 = true;
        state.isSuccess47 = false;
        state.isloading47 = false;
      });
  },
});
export const { ClearState47 } = UserListSlice.actions;
export default UserListSlice.reducer;
