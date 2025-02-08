import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/findpageid`;

export const FindPageID = createAsyncThunk(
  "FindPageID",
  async (UserData, { rejectWithValue }) => {
    var fetchingData;
    try {
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

const FindPageIDSlice = createSlice({
  name: "FindPageIDSlice",
  initialState: {
    isloading13: false,
    PageID: [],
    error13: false,
    isError13: false,
    isSuccess13: false,
  },
  reducers: {
    ClearState13: (state) => {
      (state.isloading13 = false),
        (state.error13 = false),
        (state.isError13 = false),
        (state.isSuccess13 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FindPageID.pending, (state) => {
        state.isloading13 = true;
        state.isError13 = false;
        state.isSuccess13 = false;
        state.error13 = false;
      })
      .addCase(FindPageID.fulfilled, (state, { payload }) => {
        state.PageID = payload;
        state.isSuccess13 = true;
        state.isloading13 = false;
        state.isError13 = false;
        state.error13 = false;
      })
      .addCase(FindPageID.rejected, (state, { payload }) => {
        state.error13 = payload;
        state.isError13 = true;
        state.isSuccess13 = false;
        state.isloading13 = false;
      });
  },
});
export const { ClearState13 } = FindPageIDSlice.actions;
export default FindPageIDSlice.reducer;
