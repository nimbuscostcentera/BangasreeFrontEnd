import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/customer-routes/customer-edit`;

export const CustomerEdit = createAsyncThunk(
  "CutomerEdit",
  async (UserData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const formData = new FormData();
      for (const key in UserData) {
        if (UserData[key] instanceof File) {
          // If the field is a single file, append it
          formData.append(key, UserData[key]);
        } else if (UserData[key] instanceof FileList) {
          // If the field is a FileList (multiple files), append each file
          Array.from(UserData[key]).forEach((file) => {
            formData.append(key, file);
          });
        } else {
          //console.log(key, UserData[key]);
          if (UserData[key] !== null) {
            formData.append(key, UserData[key]);
          }
        }
      }
      for (let pair of formData.entries()) {
        //console.log(`${pair[0]}: ${pair[1]}`);
      }
      const { data } = await AxiosInstance.post(URL, formData, config);
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

const CustomerEditSlice = createSlice({
  name: "CutomerEdit",
  initialState: {
    isloading11: false,
    Msg11: "",
    error11: false,
    isError11: false,
    isSuccess11: false,
  },
  reducers: {
    ClearState11: (state) => {
      (state.isloading11 = false),
        (state.isError11 = false),
        (state.isSuccess11 = false),
        (state.Msg11 = ""),
        (state.error11 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CustomerEdit.pending, (state) => {
        state.isloading11 = true;
        state.isError11 = false;
        state.isSuccess11 = false;
      })
      .addCase(CustomerEdit.fulfilled, (state, { payload }) => {
        state.Msg11 = payload;
        state.isSuccess11 = true;
        state.isloading11 = false;
        state.isError11 = false;
      })
      .addCase(CustomerEdit.rejected, (state, { payload }) => {
        state.error11 = payload;
        state.isError11 = true;
        state.isSuccess11 = false;
        state.isloading11 = false;
      });
  },
});
export const { ClearState11 } = CustomerEditSlice.actions;
export default CustomerEditSlice.reducer;
