import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/scheme-addcustomer`;

export const MultiSchemeAdd = createAsyncThunk(
  "MultiSchemeAdd",
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

const MultiSchemeAddSlice = createSlice({
  name: "MultiSchemeAddSlice",
  initialState: {
    isloading31: false,
    Resp31: "",
    error31: "",
    isError31: false,
    isSuccess31: false,
  },
  reducers: {
    ClearState31: (state) => {
      (state.isloading31 = false),
        (state.isError31 = false),
        (state.isSuccess31 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(MultiSchemeAdd.pending, (state) => {
        state.isloading31 = true;
        state.isError31 = false;
        state.isSuccess31 = false;
        state.error31 = false;
      })
      .addCase(MultiSchemeAdd.fulfilled, (state, { payload }) => {
        state.Resp31 = payload;
        state.isSuccess31 = true;
        state.isloading31 = false;
        state.isError31 = false;
        state.error31 = false;
      })
      .addCase(MultiSchemeAdd.rejected, (state, { payload }) => {
        state.error31 = payload;
        state.isError31 = true;
        state.isSuccess31 = false;
        state.isloading31 = false;
      });
  },
});
export const { ClearState31 } = MultiSchemeAddSlice.actions;
export default MultiSchemeAddSlice.reducer;
