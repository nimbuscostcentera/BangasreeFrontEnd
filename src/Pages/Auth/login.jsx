import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Avatar,
  Typography,
  TextField,
  Grid,
  Link,
  FormControl,
  Button,
  FormHelperText,
  InputAdornment,
  IconButton,
  InputLabel,
  Modal,
  OutlinedInput,
} from "@mui/material";

import Loader from "../../Components/Global/loader";

import { LockOutlined, Refresh } from "@mui/icons-material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PhnoValidation from "../../Apps/GlobalFunctions/PhnoValidation";
import PasswordValidation from "../../Apps/GlobalFunctions/PasswordValidation";

import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import {
  LoggerPermission,
  ClearState14,
} from "../../Slice/Page/PagePermissionSlice";
import { TokenVerificationfunc } from "../../Slice/Auth/TokenVarificationSlice";
import { ClearState, authenticate } from "../../Slice/Auth/AuthSlice";

const LogIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({ PhoneNumber: true, Password: true });
  const { isloading, userInfo, error, isError, isSuccess, global } =
    UseFetchLogger();
  const { isLogLoad, LoggerPerData, isLogSuccess, error14, isError14 } =
    useSelector((state) => state.Permission);
  const { resp70, error70, isError70, isSuccess70 } = useSelector(
    (state) => state.token
  );
  const [userData, setUserData] = useState({});
  const [ShowPass, SetShowPass] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleInput = (event) => {
    var key = event.target.name;
    var value = event.target.value;
    setUserData({ ...userData, [key]: value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(authenticate(userData));
    if (
      isloading ||
      isLogLoad ||
      localStorage.getItem("AccessToken") == undefined ||
      localStorage.getItem("AccessToken") == null
    ) {
      setOpen(true);
    }
  };

  const handleClickShowPassword = () => {
    SetShowPass(!ShowPass);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  let token = localStorage.getItem("AccessToken") || null;
  let refreshtoken = localStorage.getItem("RefreshToken") || null;

  //useEffect for Toaster
  useEffect(() => {
    if (isSuccess && !isloading) {
      //console.log("hello");
      dispatch(LoggerPermission({ ...global, UUid: global?.UUid }));
      dispatch(ClearState());
      if (isLogSuccess && !isLogLoad) {
        setOpen(false);
        if (userInfo?.details?.Utype == 3) {
          navigate("/customer");
        } else if (
          userInfo?.details?.Utype == 1
        ) {
          navigate("/executive");
        } else if (
          userInfo?.details?.Utype == 2
        ) {
          navigate("/agent");
        }
      } else {
        navigate("/");
      }
    }
    if (isError && !isloading) {
      setOpen(false);
      toast.error(error, toast.POSITION.TOP_RIGHT);
      dispatch(ClearState());
    }
  }, [isSuccess, isError, isloading, isLogLoad, token, isLogSuccess]);

  useEffect(() => {
    if (token && refreshtoken) {
      dispatch(TokenVerificationfunc({ ...global }));
    }
  }, [token, refreshtoken]);

  useEffect(() => {
    if (isSuccess70) {
      if (userInfo?.details?.Utype == 1) {
        navigate("/executive");
      }
      else if (userInfo?.details?.Utype == 2) {
        navigate("/agent");
      }
      else if (userInfo?.details?.Utype == 3) {
        navigate("/customer");
      }
      else {
        navigate("/");
        console.log("failed2");
      }
    } else {
      navigate("/");
      console.log("failed3");
    }
  }, [isSuccess70, isError70, resp70]);

  return (
    <Grid container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          position: "stickey",
          top: "40%",
          left: {
            xl: "50%",
            lg: "45%",
            md: "40%",
            sm: "40%",
            xs: "35%",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 200,
            height: 150,
            bgcolor: "whitesmoke",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Loader SpinnerColor="#0978ed" />
        </Box>
      </Modal>
      <ToastContainer autoClose={8000} />
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        sx={{
          mt: 3,
          padding: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "85%",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <Box
          component="form"
          encType="multipart/form-data"
          onChange={handleInput}
          onSubmit={onSubmitHandler}
          sx={{ mt: 2, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="PhoneNumber"
            label="Phone Number"
            name="uniqueId"
            type="text"
            autoFocus
            inputProps={{ maxLength: 10 }}
            error={!input?.PhoneNumber}
            onChange={(e) => {
              if (
                e.target.value !== "" &&
                e.target.value !== null &&
                e.target.value !== undefined
              ) {
                var res = PhnoValidation(e.target.value);
                setInput({ ...input, ["PhoneNumber"]: res });
              } else {
                setInput({ ...input, ["PhoneNumber"]: true });
              }
            }}
          />

          <FormHelperText
            sx={{
              visibility: input?.PhoneNumber ? "hidden" : "initial",
            }}
            error
          >
            Enter a valid Phone Number{" "}
          </FormHelperText>

          <FormControl sx={{ width: "100%", mt: 2 }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              name="password"
              required
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
              label="Password"
              inputProps={{
                sx: {
                  '& input[type="text"]::-webkit-inner-spin-button, & input[type="text"]::-webkit-outer-spin-button':
                    {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  '& input[type="text"]': {
                    MozAppearance: "textfield",
                  },
                },
                maxLength: 16,
              }}
            />
          </FormControl>
          <br />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            type="submit"
            onClick={onSubmitHandler}
            disabled={
              // input?.PhoneNumber &&
              input?.Password && userData?.uniqueId && userData?.password
                ? false
                : true
            }
          >
            Sign In
          </Button>
          <br />
          <br />
          <Grid container>
            <Grid item xs>
              <Link
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/phonenumber");
                }}
              >
                Forget password?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
export default LogIn;
