import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/scheme-delete`;

export const DeleteSchemefunc = createAsyncThunk(
  "DeleteScheme",
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

const DeleteSchemeSlice = createSlice({
  name: "DeleteSchemeSlice",
  initialState: {
    isloading58: false,
    Resp58: "",
    error58: false,
    isError58: false,
    isSuccess58: false,
  },
  reducers: {
    ClearState58: (state) => {
      (state.isloading58 = false),
        (state.error58 = false),
        (state.isError58 = false),
        (state.isSuccess58 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(DeleteSchemefunc.pending, (state) => {
        state.isloading58 = true;
        state.isError58 = false;
        state.isSuccess58 = false;
        state.error58 = false;
      })
      .addCase(DeleteSchemefunc.fulfilled, (state, { payload }) => {
        state.Resp58 = payload;
        state.isSuccess58 = true;
        state.isloading58 = false;
        state.isError58 = false;
        state.error58 = false;
      })
      .addCase(DeleteSchemefunc.rejected, (state, { payload }) => {
        state.error58 = payload;
        state.isError58 = true;
        state.isSuccess58 = false;
        state.isloading58 = false;
      });
  },
});
export const { ClearState58 } = DeleteSchemeSlice.actions;
export default DeleteSchemeSlice.reducer;
