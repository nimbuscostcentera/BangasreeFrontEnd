import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Modal,
  Avatar,
  Typography,
  TextField,
  Button,
  FormHelperText,
  Grid,
} from "@mui/material";

import { LockOutlined } from "@mui/icons-material";

import { useSelector, useDispatch } from "react-redux";
import { ForgetPass, ClearState63 } from "../../Slice/Auth/ForgotPassSlice";

import PhnoValidation from "../../Apps/GlobalFunctions/PhnoValidation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loader from "../../Components/Global/loader";

const PhoneNumber = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState({ PhoneNo: "" });
  const [input, setInput] = useState({ PhoneNo: true });
const [open, setOpen] = useState(false);

const handleClose = () => {
  setOpen(false);
};
  const { isloading63, Resp63, isError63, error63, isSuccess63 } = useSelector(
    (state) => state.forgetPass
  );

  useEffect(() => {
    if (isSuccess63 && !isloading63)
    {
      navigate("/");
      setData({ PhoneNo: "" });
      dispatch(ClearState63());
    }
    if (isError63 && !isloading63)
    {
      toast.error(`${error63}`, toast.POSITION.TOP_RIGHT);
      dispatch(ClearState63());
    }
    if (isloading63) {
      setOpen(true);
    }
  }, [isSuccess63, isError63]);

  const handleInput = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    setData({ ...data, [key]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(ForgetPass(data));
  };

  return (
    <Grid container>
      <ToastContainer autoClose={3000} />
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
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        sx={{
          mt: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "70%",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Enter Phone Number
        </Typography>
        <Box
          component="form"
          onChange={handleInput}
          onSubmit={handleSubmit}
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="PhoneNo"
            label="Phone Number"
            name="PhoneNo"
            type="text"
            autoFocus
            inputProps={{ maxLength: 10 }}
            error={!input?.PhoneNo}
            onChange={(e) => {
              var res = PhnoValidation(e.target.value);
              setInput({ ...input, ["PhoneNo"]: res });
            }}
          />
          {!input?.PhoneNo ? (
            <FormHelperText error>Enter a valid Phone Number </FormHelperText>
          ) : null}
          <Button
            fullWidth
            onClick={handleSubmit}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            type="submit"
          >
            Submit
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};
export default PhoneNumber;
