import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/scheme-search`;

export const SearchScheme = createAsyncThunk(
  "SearchScheme",
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
      return rejectWithValue(error.response.data.response);
    }
  }
);

const SearchSchemeSlice = createSlice({
  name: "SearchSchemeSlice",
  initialState: {
    isloading20: false,
    SchemeSearchList: [],
    error20: false,
    isError20: false,
    isSuccess20: false,
  },
  reducers: {
    ClearState20: (state) => {
      (state.isloading20 = false),
        (state.error20 = false),
        (state.isError20 = false),
        (state.isSuccess20 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SearchScheme.pending, (state) => {
        state.isloading20 = true;
        state.isError20 = false;
        state.isSuccess20 = false;
        state.error20 = false;
      })
      .addCase(SearchScheme.fulfilled, (state, { payload }) => {
        state.SchemeSearchList = payload;
        state.isSuccess20 = true;
        state.isloading20 = false;
        state.isError20 = false;
        state.error20 = false;
      })
      .addCase(SearchScheme.rejected, (state, { payload }) => {
        state.error20 = payload;
        state.isError20 = true;
        state.isSuccess20 = false;
        state.isloading20 = false;
      });
  },
});
export const { ClearState20 } = SearchSchemeSlice.actions;
export default SearchSchemeSlice.reducer;
