import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/customer-routes/tot-collection`;

export const FetchTotCollection = createAsyncThunk(
  "FetchTotCollection",
  async (UserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await AxiosInstance.post(URL, UserData, config);
      //
      return data?.response[0];
    } catch (error) {
      return rejectWithValue(error.response.data.response);
    }
  }
);

const TotCollectionShowSlice = createSlice({
  name: "TotCollShow",
  initialState: {
    isTotCollectionLoading: false,
    TotCollectionList:[],
    TotCollectionErrorMsg: "",
    isTotCollectionError: false,
    isTotCollectionSuccess: false,
  },
  reducers: {
    ClearStateTotColl: (state) => {
      (state.isTotCollectionLoading = false),
      (state.isTotCollectionError = false),
      (state.isTotCollectionSuccess = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchTotCollection.pending, (state) => {
        state.isTotCollectionLoading = true;
        state.isTotCollectionError = false;
        state.isTotCollectionSuccess = false;
      })
      .addCase(FetchTotCollection.fulfilled, (state, { payload }) => {
        state.isTotCollectionError = false;
        state.isTotCollectionLoading = false;
        state.isTotCollectionSuccess = true;
        state.TotCollectionList = payload;
      })
      .addCase(FetchTotCollection.rejected, (state, { payload }) => {
        state.isTotCollectionLoading = false;
        state.isTotCollectionError = true;
        state.isTotCollectionSuccess = false;
        state.TotCollectionErrorMsg = payload;
      });
  },
});
export const { ClearStateTotColl } = TotCollectionShowSlice.actions;
export default TotCollectionShowSlice.reducer;
