import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/area-approve`;

export const AreaStatusfunc = createAsyncThunk(
  "AreaStatus",
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

const AreaStatusSlice = createSlice({
  name: "AreaStatusSlice",
  initialState: {
    isloading39: false,
    Resp39: [],
    error39: false,
    isError39: false,
    isSuccess39: false,
  },
  reducers: {
    ClearState39: (state) => {
      (state.isloading39 = false),
        (state.isError39 = false),
        (state.isSuccess39 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AreaStatusfunc.pending, (state) => {
        state.isloading39 = true;
        state.isError39 = false;
        state.isSuccess39 = false;
      })
      .addCase(AreaStatusfunc.fulfilled, (state, { payload }) => {
        state.Resp39 = payload;
        state.isSuccess39 = true;
        state.isloading39 = false;
        state.isError39 = false;
      })
      .addCase(AreaStatusfunc.rejected, (state, { payload }) => {
        state.error39 = payload;
        state.isError39 = true;
        state.isSuccess39 = false;
        state.isloading39 = false;
      });
  },
});
export const { ClearState39 } = AreaStatusSlice.actions;
export default AreaStatusSlice.reducer;
