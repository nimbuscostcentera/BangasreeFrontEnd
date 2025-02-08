import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const URL = `/superuser-routes/superuser-edit`;
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";

export const SuperUserEditfunc = createAsyncThunk(
  "SuperUserEdit",
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

const SuperUserEditSlice = createSlice({
  name: "SuperUserEdit",
  initialState: {
    isloading41: false,
    Resp41: [],
    error41: false,
    isError41: false,
    isSuccess41: false,
  },
  reducers: {
    ClearState41: (state) => {
      (state.isloading41 = false),
        (state.isError41 = false),
        (state.isSuccess41 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SuperUserEditfunc.pending, (state) => {
        state.isloading41 = true;
        state.isError41 = false;
        state.isSuccess41 = false;
      })
      .addCase(SuperUserEditfunc.fulfilled, (state, { payload }) => {
        state.Resp41 = payload;
        state.isSuccess41 = true;
        state.isloading41 = false;
        state.isError41 = false;
      })
      .addCase(SuperUserEditfunc.rejected, (state, { payload }) => {
        state.error41 = payload;
        state.isError41 = true;
        state.isSuccess41 = false;
        state.isloading41 = false;
      });
  },
});
export const { ClearState41 } = SuperUserEditSlice.actions;
export default SuperUserEditSlice.reducer;
