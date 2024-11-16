import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
const URL = `/auth-routes/agent-registration`;

export const AgentReg = createAsyncThunk(
  "Auth/AgentRegistration",
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
      // const { data } = await AxiosInstance.post(URL, UserData, config);

      return data?.response;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.response);
    }
  }
);

const AgentRegistrationSlice = createSlice({
  name: "AgentReg",
  initialState: {
    isloading3: false,
    msg3: "",
    isError3: false,
    error3: "",
    isSuccess3: false,
  },
  reducers: {
    ClearState3: (state) => {
      (state.isloading3 = false),
        (state.isError3 = false),
        (state.isSuccess3 = false);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AgentReg.pending, (state) => {
        state.isloading3 = true;
        state.isSuccess3 = false;
        state.isError3 = false;
      })
      .addCase(AgentReg.fulfilled, (state, { payload }) => {
        state.isloading3 = false;
        state.isSuccess3 = true;
        state.isError3 = false;
        state.msg3 = payload;
      })
      .addCase(AgentReg.rejected, (state, { payload }) => {
        state.isloading3 = false;
        state.isError3 = true;
        state.error3 = payload;
        state.isSuccess3 = false;
      });
  },
});
export const { ClearState3 } = AgentRegistrationSlice.actions;
export default AgentRegistrationSlice.reducer;
