import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/area-routes/area-list`;

export const getAreaList = createAsyncThunk(
  "getAreaList",
  async (UserData, { rejectWithValue }) => {
    var fetchingData;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetchingData = await AxiosInstance.post(URL,UserData, config);
     
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

const AreaListSlice = createSlice({
  name: "AreaListSlice",
  initialState: {
    isloading5: false,
    areaList: [],
    error5: false,
    isError5: false,
    isSuccess5: false,
  },
  reducers: {
    ClearState5: (state) => {
      (state.isloading5 = false),
        (state.error5 = false),
        (state.isError5 = false),
        (state.isSuccess5 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAreaList.pending, (state) => {
        state.isloading5 = true;
        state.isError5 = false;
        state.isSuccess5 = false;
        state.error5 = false;
      })
      .addCase(getAreaList.fulfilled, (state, { payload }) => {
        state.areaList = payload;
        state.isSuccess5 = true;
        state.isloading5 = false;
        state.isError5 = false;
        state.error5 = false;
      })
      .addCase(getAreaList.rejected, (state, { payload }) => {
        state.error5 = payload;
        state.isError5 = true;
        state.isSuccess5 = false;
        state.isloading5 = false;
      });
  },
});
export const { ClearState5 } = AreaListSlice.actions;
export default AreaListSlice.reducer;
