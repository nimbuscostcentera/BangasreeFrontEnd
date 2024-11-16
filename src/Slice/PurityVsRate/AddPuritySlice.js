import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/add-purity`;

export const AddPurityFunc = createAsyncThunk(
  "AddPurity",
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

const AddPuritySlice = createSlice({
  name: "AddPurity",
  initialState: {
    isloading76: false,
    Resp76: {},
    error76: "",
    isError76: false,
    isSuccess76: false,
  },
  reducers: {
    ClearState76: (state) => {
      (state.isloading76 = false),
      (state.isError76 = false),
      (state.isSuccess76 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddPurityFunc.pending, (state) => {
        state.isloading76 = true;
        state.isError76 = false;
        state.isSuccess76 = false;
      })
      .addCase(AddPurityFunc.fulfilled, (state, { payload }) => {
        state.isError76 = false;
        state.isloading76 = false;
        state.isSuccess76 = true;
        state.Resp76 = payload;
      })
      .addCase(AddPurityFunc.rejected, (state, { payload }) => {
        state.isloading76 = false;
        state.isError76 = true;
        state.isSuccess76 = false;
        state.error76 = payload;
      });
  },
});
export const { ClearState76 } = AddPuritySlice.actions;
export default AddPuritySlice.reducer;
