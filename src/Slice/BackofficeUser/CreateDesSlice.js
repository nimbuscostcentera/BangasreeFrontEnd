import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/designation-create`;

export const CreateDesFunc = createAsyncThunk(
  "CreateDesignation",
  async (UserData, { rejectWithValue }) => {
    var fetchingData = null;
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

const CreateDesSlice = createSlice({
  name: "CreateDesSlice",
  initialState: {
    isloading62: false,
    Resp62: "",
    error62: "",
    isError62: false,
    isSuccess62: false,
  },
  reducers: {
    ClearState62: (state) => {
      (state.isloading62 = false),
        (state.isError62 = false),
        (state.isSuccess62 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CreateDesFunc.pending, (state) => {
        state.isloading62 = true;
        state.isError62 = false;
        state.isSuccess62 = false;
      })
      .addCase(CreateDesFunc.fulfilled, (state, { payload }) => {
        state.Resp62 = payload;
        state.isSuccess62 = true;
        state.isloading62 = false;
        state.isError62 = false;
      })
      .addCase(CreateDesFunc.rejected, (state, { payload }) => {
        state.error62 = payload;
        state.isError62 = true;
        state.isSuccess62 = false;
        state.isloading62 = false;
      });
  },
});
export const { ClearState62 } = CreateDesSlice.actions;
export default CreateDesSlice.reducer;
