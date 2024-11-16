import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/passbook-notAssign`;

export const AvailPassBookList = createAsyncThunk(
  "AvailPassBookList",
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
      if (error.response && error.response.data.response) {
        return rejectWithValue(error.response.data.response);
      } else {
        return rejectWithValue(error.response);
      }
    }
  }
);

const AvailPassBookSlice = createSlice({
  name: "AvailPassBookSlice",
  initialState: {
    isloading55: false,
    Resp55: [],
    error55: false,
    isError55: false,
    isSuccess55: false,
  },
  reducers: {
    ClearState55: (state) => {
      (state.isloading55 = false),
        (state.isError55 = false),
        (state.isSuccess55 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AvailPassBookList.pending, (state) => {
        state.isloading55 = true;
        state.isError55 = false;
        state.isSuccess55 = false;
      })
      .addCase(AvailPassBookList.fulfilled, (state, { payload }) => {
        state.Resp55 = payload;
        state.isSuccess55 = true;
        state.isloading55 = false;
        state.isError55 = false;
      })
      .addCase(AvailPassBookList.rejected, (state, { payload }) => {
        state.error55 = payload;
        state.isError55 = true;
        state.isSuccess55 = false;
        state.isloading55 = false;
      });
  },
});
export const { ClearState55 } = AvailPassBookSlice.actions;
export default AvailPassBookSlice.reducer;
