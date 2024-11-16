import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const URL = `/superuser-routes/area-create`;
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
export const AreaCreatefunc = createAsyncThunk(
  "AreaCreate",
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

const AreaCreateSlice = createSlice({
  name: "AreaCreateSlice",
  initialState: {
    isloading37: false,
    Resp37: [],
    error37: false,
    isError37: false,
    isSuccess37: false,
  },
  reducers: {
    ClearState37: (state) => {
      (state.isloading37 = false),
        (state.isError37 = false),
        (state.isSuccess37 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AreaCreatefunc.pending, (state) => {
        state.isloading37 = true;
        state.isError37 = false;
        state.isSuccess37 = false;
      })
      .addCase(AreaCreatefunc.fulfilled, (state, { payload }) => {
        state.Resp37 = payload;
        state.isSuccess37 = true;
        state.isloading37 = false;
        state.isError37 = false;
      })
      .addCase(AreaCreatefunc.rejected, (state, { payload }) => {
        state.error37 = payload;
        state.isError37 = true;
        state.isSuccess37 = false;
        state.isloading37 = false;
      });
  },
});
export const { ClearState37 } = AreaCreateSlice.actions;
export default AreaCreateSlice.reducer;
