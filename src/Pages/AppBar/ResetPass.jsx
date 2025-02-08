import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  FormControl,
  Button,
  FormHelperText,
  InputAdornment,
  IconButton,
  InputLabel,
  Grid,
  Divider,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";

import PasswordValidation from "../../Apps/GlobalFunctions/PasswordValidation";

import { ResetPassfunc, ClearState64 } from "../../Slice/Auth/ResetPassSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";

const CustomTheme = createTheme({
  breakpoints: {
    keys: ["xs", "sm", "md", "lg", "xl", "xxl", "xxxl"],
    values: {
      xs: 200,
      sm: 400,
      md: 695,
      lg: 800,
      xl: 970,
      xxl: 1200,
      xxxl: 1400,
    },
  },
});

const ResetPass = () => {
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);
  const [warMsg, setWarMsg] = useState("");
  const [ShowPass, SetShowPass] = useState(false);
  const [ShowPass1, SetShowPass1] = useState(false);
  const [ShowPass2, SetShowPass2] = useState(false);
  const [input, setInput] = useState({
    Oldpassword: true,
    newPass: true,
    Newpassword: true,
  });
  const [data, setData] = useState({
    password: null,
    newPass: null,
    Newpassword: null,
  });

  const { global, userInfo } = UseFetchLogger();

  //reset response
  const { isloading64, Resp64, isError64, error64, isSuccess64 } = useSelector(
    (state) => state.resetPass
  );
  useEffect(() => {
    if (isSuccess64 && !isloading64) {
      toast.success(Resp64, toast.POSITION.TOP_RIGHT);
      setData({ password: null, newPass: null, Newpassword: null });
      document.getElementById("arial_reset_pass_form").reset();
    }
    if (isError64 && !isloading64) {
      toast.error(error64, toast.POSITION.TOP_RIGHT);
    }
    dispatch(ClearState64());
  }, [isSuccess64, isError64]);

  //submit
  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      data?.newPass == data?.password ||
      data?.Newpassword == data?.password ||
      data?.newPass !== data?.Newpassword
    ) {
      var msg = "";
      if (
        data?.newPass == data?.password ||
        data?.Newpassword == data?.password
      ) {
        msg = "Old and New Password can not be same. ";
      }
      if (data?.newPass !== data?.Newpassword) {
        msg = msg + "Confirm Password is not same as new Password.";
      }
      setAlert(true);
      setWarMsg(msg);
    } else {
      setAlert(false);
      dispatch(
        ResetPassfunc({
          ...global,
          ...data,
          PhoneNo:
            userInfo?.details?.Utype == 2
              ? userInfo?.details?.Phonenumber
              : userInfo?.details?.PhoneNumber,
        })
      );
    }
  };
  const handleClickShowPassword = () => {
    SetShowPass(!ShowPass);
  };
  const handleClickShowPassword1 = () => {
    SetShowPass1(!ShowPass1);
  };
  const handleClickShowPassword2 = () => {
    SetShowPass2(!ShowPass2);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <Grid container>
      <ToastContainer autoClose={5000} />
      <Grid item sm={12} xs={12} md={12} lg={12}>
        <Box
          sx={{
            p: 1,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <LockIcon fontSize="medium" color="secondary" />
          <Typography component="h6" variant="h6" sx={{ mt: -0.3 }}>
            Change Your Password
          </Typography>{" "}
        </Box>
        <Divider />
      </Grid>
      {alert ? (
        <Grid item md={12} sm={12} xs={12} lg={12}>
          {" "}
          <Box display={"flex"} justifyContent={"space-between"}>
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert
                severity="error"
                onClose={() => {
                  setAlert(false);
                }}
              >
                <AlertTitle>Warning</AlertTitle>
                {warMsg}
              </Alert>
            </Stack>
          </Box>
        </Grid>
      ) : null}
      <Grid item sm={12} xs={12} md={12} lg={12} ml={3} xl={11.3}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ my: 2 }}
          id="arial_reset_pass_form"
        >
          <Grid container columnGap={2}>
            <Grid item xs={11.3} sm={11.3} md={11.3} lg={11.3}>
              <FormControl sx={{ width: "100%", mb: 2 }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Old Password
                </InputLabel>
                <OutlinedInput
                  name="Password"
                  size="small"
                  sx={{ mb: 1 }}
                  value={data?.password}
                  id="outlined-adornment-password"
                  type={ShowPass ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {ShowPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Old Password"
                  onChange={(e) => {
                    setData({ ...data, password: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={11.3} md={5.5} lg={5.5} xl={11.3} xxl={5.5}>
              <FormControl sx={{ width: "100%" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  name="newPass"
                  size="small"
                  sx={{ mb: 1 }}
                  value={data?.newPass}
                  error={!input?.newPass ? true : false}
                  id="outlined-adornment-password"
                  type={ShowPass1 ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword1}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {ShowPass1 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  onChange={(e) => {
                    setData({ ...data, newPass: e.target.value });
                    if (e?.target?.value) {
                      var res = PasswordValidation(e.target.value);
                      setInput({ ...input, ["newPass"]: res });
                    } else {
                      setInput({ ...input, ["newPass"]: true });
                    }
                  }}
                />

                <FormHelperText
                  error={!input?.newPass ? true : false}
                  sx={{
                    visibility: "visible",
                    mb: 1,
                  }}
                >
                  Password must contain atleast one upper case character, one
                  lower case character, one number ,one special character only
                  without any Space.
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={11.3} md={5.5} lg={5.5} xl={11.3} xxl={5.5}>
              <FormControl sx={{ width: "100%" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  name="Newpassword"
                  value={data?.Newpassword}
                  size="small"
                  sx={{ mb: 1 }}
                  error={!input?.Newpassword ? true : false}
                  id="outlined-adornment-ConfirmPassword"
                  type={ShowPass2 ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword2}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {ShowPass2 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                  onChange={(e) => {
                    setData({ ...data, Newpassword: e.target.value });
                    if (e?.target?.value) {
                      var res = PasswordValidation(e.target.value);
                      if (data?.Password == e.target.value) {
                        setAlert(true);
                      }
                      setInput({ ...input, ["Newpassword"]: res });
                    } else {
                      setInput({ ...input, ["Newpassword"]: true });
                    }
                  }}
                />
                <FormHelperText
                  error={!input?.Newpassword ? true : false}
                  sx={{
                    visibility: "visible",
                  }}
                >
                  Password must contain atleast one upper case character, one
                  lower case character, one number ,one special character only
                  without any Space.
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                ml: -4,
                mt: 1,
              }}
            >
              <Button
                variant="contained"
                type="submit"
                onClick={handleSubmit}
                disabled={
                  input?.Newpassword &&
                  input?.newPass &&
                  input?.Oldpassword &&
                  data?.password &&
                  data?.Newpassword
                    ? false
                    : true
                }
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Divider />
      </Grid>
    </Grid>
  );
};
export default ResetPass;
