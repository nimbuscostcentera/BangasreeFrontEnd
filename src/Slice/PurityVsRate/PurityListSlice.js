import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/list-purity`;

export const getPuritylist = createAsyncThunk(
  "Puritylist",
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

const PurityListSlice = createSlice({
  name: "Puritylist",
  initialState: {
    isloading77: false,
    Resp77: {},
    error77: "",
    isError77: false,
    isSuccess77: false,
  },
  reducers: {
    ClearState77: (state) => {
      (state.isloading77 = false),
        (state.isError77 = false),
        (state.isSuccess77 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPuritylist.pending, (state) => {
        state.isloading77 = true;
        state.isError77 = false;
        state.isSuccess77 = false;
      })
      .addCase(getPuritylist.fulfilled, (state, { payload }) => {
        state.isError77 = false;
        state.isloading77 = false;
        state.isSuccess77 = true;
        state.Resp77 = payload;
      })
      .addCase(getPuritylist.rejected, (state, { payload }) => {
        state.isloading77 = false;
        state.isError77 = true;
        state.isSuccess77 = false;
        state.error77 = payload;
      });
  },
});
export const { ClearState77 } = PurityListSlice.actions;
export default PurityListSlice.reducer;
