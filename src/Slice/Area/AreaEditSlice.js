import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/area-edit`;

export const AreaEdit = createAsyncThunk(
  "AreaEdit",
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

const AreaEditSlice = createSlice({
  name: "AreaEditSlice",
  initialState: {
    isloading42: false,
    Resp42: [],
    error42: false,
    isError42: false,
    isSuccess42: false,
  },
  reducers: {
    ClearState42: (state) => {
      (state.isloading42 = false),
        (state.isError42 = false),
        (state.isSuccess42 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AreaEdit.pending, (state) => {
        state.isloading42 = true;
        state.isError42 = false;
        state.isSuccess42 = false;
      })
      .addCase(AreaEdit.fulfilled, (state, { payload }) => {
        state.Resp42 = payload;
        state.isSuccess42 = true;
        state.isloading42 = false;
        state.isError42 = false;
      })
      .addCase(AreaEdit.rejected, (state, { payload }) => {
        state.error42 = payload;
        state.isError42 = true;
        state.isSuccess42 = false;
        state.isloading42 = false;
      });
  },
});
export const { ClearState42 } = AreaEditSlice.actions;
export default AreaEditSlice.reducer;
