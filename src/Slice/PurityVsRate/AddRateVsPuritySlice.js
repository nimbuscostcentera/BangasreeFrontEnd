import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/add-goldrate`;

export const addRateVsPurityFunc = createAsyncThunk(
  "addRateVsPurity",
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
      return rejectWithValue(error.response.data.response);
    }
  }
);

const AddRateVsPuritySlice = createSlice({
  name: "addRateVsPurity",
  initialState: {
    isloading78: false,
    Resp78: {},
    error78: "",
    isError78: false,
    isSuccess78: false,
  },
  reducers: {
    ClearState78: (state) => {
      (state.isloading78 = false),
        (state.isError78 = false),
        (state.isSuccess78 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addRateVsPurityFunc.pending, (state) => {
        state.isloading78 = true;
        state.isError78 = false;
        state.isSuccess78 = false;
      })
      .addCase(addRateVsPurityFunc.fulfilled, (state, { payload }) => {
        state.isError78 = false;
        state.isloading78 = false;
        state.isSuccess78 = true;
        state.Resp78 = payload;
      })
      .addCase(addRateVsPurityFunc.rejected, (state, { payload }) => {
        state.isloading78 = false;
        state.isError78 = true;
        state.isSuccess78 = false;
        state.error78 = payload;
      });
  },
});
export const { ClearState78 } = AddRateVsPuritySlice.actions;
export default AddRateVsPuritySlice.reducer;
