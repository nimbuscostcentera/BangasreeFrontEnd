import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/scheme-view`;

export const SchemeList = createAsyncThunk(
  "SchemeList",
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

const SchemeListSlice = createSlice({
  name: "SchemeListSlice",
  initialState: {
    isloading18: false,
    Schemes: [],
    error18: false,
    isError18: false,
    isSuccess18: false,
  },
  reducers: {
    ClearState18: (state) => {
      (state.isloading18 = false),
        (state.error18 = false),
        (state.isError18 = false),
        (state.isSuccess18 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SchemeList.pending, (state) => {
        state.isloading18 = true;
        state.isError18 = false;
        state.isSuccess18 = false;
        state.error18 = false;
      })
      .addCase(SchemeList.fulfilled, (state, { payload }) => {
        state.Schemes = payload;
        state.isSuccess18 = true;
        state.isloading18 = false;
        state.isError18 = false;
        state.error18 = false;
      })
      .addCase(SchemeList.rejected, (state, { payload }) => {
        state.error18 = payload;
        state.isError18 = true;
        state.isSuccess18 = false;
        state.isloading18 = false;
      });
  },
});
export const { ClearState18 } = SchemeListSlice.actions;
export default SchemeListSlice.reducer;
