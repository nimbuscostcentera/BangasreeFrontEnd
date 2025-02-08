import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/agent-routes/scheme-editcustomer`;

export const EditNomineeFunc = createAsyncThunk(
  "EditNominee",
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

const EditNomineeSlice = createSlice({
  name: "EditNomineeSlice",
  initialState: {
    isloading57: false,
    Resp57: "",
    error57: false,
    isError57: false,
    isSuccess57: false,
  },
  reducers: {
    ClearState57: (state) => {
      (state.isloading57 = false),
        (state.error57 = false),
        (state.isError57 = false),
        (state.isSuccess57 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(EditNomineeFunc.pending, (state) => {
        state.isloading57 = true;
        state.isError57 = false;
        state.isSuccess57 = false;
        state.error57 = false;
      })
      .addCase(EditNomineeFunc.fulfilled, (state, { payload }) => {
        state.Resp57 = payload;
        state.isSuccess57 = true;
        state.isloading57 = false;
        state.isError57 = false;
        state.error57 = false;
      })
      .addCase(EditNomineeFunc.rejected, (state, { payload }) => {
        state.error57 = payload;
        state.isError57 = true;
        state.isSuccess57 = false;
        state.isloading57 = false;
      });
  },
});
export const { ClearState57 } = EditNomineeSlice.actions;
export default EditNomineeSlice.reducer;
