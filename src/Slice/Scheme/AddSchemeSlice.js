import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/scheme-add`;

export const AddScheme = createAsyncThunk(
  "Addscheme",
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

const AddSchemeSlice = createSlice({
  name: "AddSchemeSlice",
  initialState: {
    isloading17: false,
    Msg17: [],
    error17: false,
    isError17: false,
    isSuccess17: false,
  },
  reducers: {
    ClearState17: (state) => {
      (state.isloading17 = false),
        (state.error17 = false),
        (state.isError17 = false),
        (state.isSuccess17 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddScheme.pending, (state) => {
        state.isloading17 = true;
        state.isError17 = false;
        state.isSuccess17 = false;
        state.error17 = false;
      })
      .addCase(AddScheme.fulfilled, (state, { payload }) => {
        state.Msg17 = payload;
        state.isSuccess17 = true;
        state.isloading17 = false;
        state.isError17 = false;
        state.error17 = false;
      })
      .addCase(AddScheme.rejected, (state, { payload }) => {
        state.error17 = payload;
        state.isError17 = true;
        state.isSuccess17 = false;
        state.isloading17 = false;
      });
  },
});
export const { ClearState17 } = AddSchemeSlice.actions;
export default AddSchemeSlice.reducer;
