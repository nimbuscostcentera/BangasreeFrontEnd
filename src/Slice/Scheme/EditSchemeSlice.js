import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/scheme-edit`;

export const EditScheme = createAsyncThunk(
  "EditScheme",
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

const EditSchemeSlice = createSlice({
  name: "EditSchemeSlice",
  initialState: {
    isloading19: false,
    Msg19: [],
    error19: false,
    isError19: false,
    isSuccess19: false,
  },
  reducers: {
    ClearState19: (state) => {
      (state.isloading19 = false),
        (state.error19 = false),
        (state.isError19 = false),
        (state.isSuccess19 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(EditScheme.pending, (state) => {
        state.isloading19 = true;
        state.isError19 = false;
        state.isSuccess19 = false;
        state.error19 = false;
      })
      .addCase(EditScheme.fulfilled, (state, { payload }) => {
        state.Msg19 = payload;
        state.isSuccess19 = true;
        state.isloading19 = false;
        state.isError19 = false;
        state.error19 = false;
      })
      .addCase(EditScheme.rejected, (state, { payload }) => {
        state.error19 = payload;
        state.isError19 = true;
        state.isSuccess19 = false;
        state.isloading19 = false;
      });
  },
});
export const { ClearState19 } = EditSchemeSlice.actions;
export default EditSchemeSlice.reducer;
