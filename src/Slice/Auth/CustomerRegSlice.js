import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/auth-routes/customer-registration`;
export const CustomerReg = createAsyncThunk(
  "Auth/CustomerRegistration",
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
        return rejectWithValue(error.response?.data?.response);
      } else {
        return rejectWithValue(error?.response);
      }
    }
  }
);

const CustomerRegistrationSlice = createSlice({
  name: "CusReg",
  initialState: {
    isloading7: false,
    msg7: [],
    isError7: false,
    error7: "",
    isSuccess7: false,
    ToasterCust: false,
  },
  reducers: {
    ClearState7: (state) => {
      (state.isloading7 = false),
        (state.isError7 = false),
        (state.isSuccess7 = false);
    },
    ClearToasterCust: (state) => {
      state.ToasterCust = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CustomerReg.pending, (state) => {
        state.isloading7 = true;
        state.isError7 = false;
        state.isSuccess7 = false;
      })
      .addCase(CustomerReg.fulfilled, (state, { payload }) => {
        state.isloading7 = false;
        state.isError7 = false;
        state.isSuccess7 = true;
        state.msg7 = payload;
        state.ToasterCust = true;
      })
      .addCase(CustomerReg.rejected, (state, { payload }) => {
        state.isloading7 = false;
        state.isError7 = true;
        state.isSuccess7 = false;
        state.error7 = payload;
      });
  },
});
export const { ClearState7, ClearToasterCust } =
  CustomerRegistrationSlice.actions;
export default CustomerRegistrationSlice.reducer;
