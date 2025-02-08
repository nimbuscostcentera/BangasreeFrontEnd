import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/superuser-routes/scheme-history`;

export const getAllSchemeHistory = createAsyncThunk(
  "getAllSchemeHistory",
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

const SchemeHistorySlice = createSlice({
  name: "SchemeHistorySlice",
  initialState: {
    isSHLoading: false,
    SchemeHistoryList: [],
    SchemeHistoryErrorMsg: false,
    isSchemeHistoryError: false,
    isSchemeHistorySuccess: false,
  },
  reducers: {
    ClearStateSchemeHistory: (state) => {
      (state.isSHLoading = false),
        (state.SchemeHistoryErrorMsg = false),
        (state.isSchemeHistoryError = false),
        (state.isSchemeHistorySuccess = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSchemeHistory.pending, (state) => {
        state.isSHLoading = true;
        state.isSchemeHistoryError = false;
        state.isSchemeHistorySuccess = false;
        state.SchemeHistoryErrorMsg = false;
      })
      .addCase(getAllSchemeHistory.fulfilled, (state, { payload }) => {
        state.SchemeHistoryList = payload;
        state.isSchemeHistorySuccess = true;
        state.isSHLoading = false;
        state.isSchemeHistoryError = false;
        state.SchemeHistoryErrorMsg = false;
      })
      .addCase(getAllSchemeHistory.rejected, (state, { payload }) => {
        state.SchemeHistoryErrorMsg = payload;
        state.isSchemeHistoryError = true;
        state.isSchemeHistorySuccess = false;
        state.isSHLoading = false;
      });
  },
});
export const { ClearStateSchemeHistory } = SchemeHistorySlice.actions;
export default SchemeHistorySlice.reducer;
