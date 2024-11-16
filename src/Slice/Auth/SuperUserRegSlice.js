import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/auth-routes/superuser-registration`;

export const SuperUserReg = createAsyncThunk(
  "Auth/SuperUserReg",
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
      return rejectWithValue(error?.response?.data?.response);
    }
  }
);

const SuperUserRegSlice = createSlice({
  name: "SuperUserReg",
  initialState: {
    isloading37: false,
    Resp37: "",
    isError37: false,
    error37: "",
    isSuccess37: false,
  },
  reducers: {
    ClearState37: (state) => {
      (state.isloading37 = false),
        (state.isError37 = false),
        (state.isSuccess37 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SuperUserReg.pending, (state) => {
        state.isloading37 = true;
        state.isSuccess37 = false;
        state.isError37 = false;
      })
      .addCase(SuperUserReg.fulfilled, (state, { payload }) => {
        state.isloading37 = false;
        state.isSuccess37 = true;
        state.isError37 = false;
        state.Resp37 = payload;
      })
      .addCase(SuperUserReg.rejected, (state, { payload }) => {
        state.isloading37 = false;
        state.isError37 = true;
        state.error37 = payload;
        state.isSuccess37 = false;
      });
  },
});
export const { ClearState37 } = SuperUserRegSlice.actions;
export default SuperUserRegSlice.reducer;
