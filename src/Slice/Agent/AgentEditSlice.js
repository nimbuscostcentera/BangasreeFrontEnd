import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const URL = `/agent-routes/agent-edit`;
import AxiosInstance from "../../Apps/GlobalFunctions/AxiosInstance";
export const AgentEdit = createAsyncThunk(
  "AgentEdit",
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

const AgentEditSlice = createSlice({
  name: "AgentEdit",
  initialState: {
    isloading12: false,
    Msg12: "",
    error12: "",
    isError12: false,
    isSuccess12: false,
  },
  reducers: {
    ClearState12: (state) => {
      state.isloading12 = false,
      state.isError12 = false,
      state.isSuccess12 = false,
      state.Msg12 = "",
      state.error12=""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AgentEdit.pending, (state) => {
        state.isloading12 = true;
        state.isError12 = false;
        state.isSuccess12 = false;
      })
      .addCase(AgentEdit.fulfilled, (state, { payload }) => {
        state.Msg12 = payload;
        state.isSuccess12 = true;
        state.isloading12 = false;
        state.isError12 = false;
      })
      .addCase(AgentEdit.rejected, (state, { payload }) => {
        state.error12 = payload;
        state.isError12 = true;
        state.isSuccess12 = false;
        state.isloading12 = false;
      });
  },
});
export const { ClearState12 } = AgentEditSlice.actions;
export default AgentEditSlice.reducer;
