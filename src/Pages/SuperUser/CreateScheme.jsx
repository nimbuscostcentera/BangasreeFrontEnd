import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Typography,
  TextField,
  Box,
  InputAdornment,
  FormGroup,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Divider,
  Modal,
  Grid,
} from "@mui/material";
//import Grid from "@mui/system/Unstable_Grid/Grid";

import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import OnOffButton from "../../Components/Global/OnOffButton";
import Loader from "../../Components/Global/loader";

import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";

import { AddScheme, ClearState17 } from "../../Slice/Scheme/AddSchemeSlice";

import NumberOnly from "../../Apps/GlobalFunctions/NumberOnly";
import IntegerValidation from "../../Apps/GlobalFunctions/IntegerValidation";

const CreateScheme = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    SchemeTitle: null,
    BONUS: 0,
    Duration: 0,
    RegFees: 0,
    Monthly: 0,
    Weekly: 0,
    Daily: 0,
  });
  const [input, setInput] = useState({
    BONUS: true,
    Duration: true,
    RegFees: true,
    Monthly: true,
    Weekly: true,
    Daily: true,
  });
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const { userInfo, global } = UseFetchLogger();

  const { isloading17, Msg17, error17, isError17, isSuccess17 } = useSelector(
    (state) => state.addScheme
  );

  const onChangeHandler = (e) => {
    var key = e.target.name;
    var value = e.target.value;

    if (key == "SchemeTitle") {
      value = e.target.value;
      setData({ ...data, [key]: value });
    }
    if (key === "BONUS" && (e.target.value < 0 || e.target.value >= 100)) {
      value = 0;
    }
    if (key == "RegFees" && e.target.value < 0) {
      value = 0;
    }
    setData({ ...data, [key]: value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    var finalObj = { ...global, ...data };

    dispatch(AddScheme(finalObj));
  };

  useEffect(() => {
    if (isSuccess17 && !isloading17) {
      toast.success(Msg17, { positions: toast.POSITION.TOP_RIGHT });
      document.getElementById("SchemeRegForm").reset();
      setData({
        SchemeTitle: null,
        BONUS: 0,
        Duration: 0,
        RegFees: 0,
        Monthly: 0,
        Weekly: 0,
        Daily: 0,
      });
      dispatch(ClearState17());
    }
    if (isError17 && !isloading17) {
      toast.error(`${error17}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState17());
    }
    if (isloading17) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isError17, isSuccess17, isloading17]);
  //console.log(isloading17);
  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Schemes")[0];

  return (
    <Grid container maxWidth="xl" ml={2} mt={5}>
      <ToastContainer autoClose={5000} />
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
            width: 100,
            height: 50,
            bgcolor: "whitesmoke",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Loader SpinnerColor="#0978ed" />
        </Box>
      </Modal>
      <Grid item sm={12} md={12} xs={12} lg={12} xl={12}>
        <ReusableBreadcrumbs
          props={[
            {
              title: "Home",
              link: global?.Utype == 1 ? "/executive" : "/agent",
              icon: "home",
            },
            {
              title: "Manage Gold Saving Schemes",
              link:
                myPermission?.ViewPage == 1 ? "/superuser/managescheme" : "#",
              icon: "manage_accounts",
            },
            {
              title: "Create Schemes",
              link: "#",
              icon: "add_box",
            },
          ]}
        />{" "}
        <Divider />
      </Grid>
      <Grid item sm={12} md={12} xs={12} lg={12} xl={12}>
        <Box
          id="SchemeRegForm"
          component="form"
          width={"100%"}
          onChange={onChangeHandler}
          onSubmit={onSubmitHandler}
        >
          <Typography
            variant="h5"
            color={"#0c0c0c"}
            sx={{
              py: 1,
            }}
          >
            Create New Gold Scheme
          </Typography>
          <Divider />
          <br />
          <Grid container columnGap={3} rowGap={2} maxWidth={"xl"}>
            <Grid item xs={12} sm={12} md={5.5} lg={2.7}>
              <TextField
                required
                id="Scheme_Name"
                name="SchemeTitle"
                label="Enter New Scheme Name"
                fullWidth
                variant="outlined"
                value={data?.SchemeTitle || ""}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={5.5} lg={2.7}>
              <TextField
                required
                id="BONUS"
                name="BONUS"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={data?.BONUS || ""}
                label="Bonus Percentage"
                fullWidth
                variant="outlined"
                type="text"
                error={!input?.BONUS}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = NumberOnly(e.target.value);

                    setInput({ ...input, ["BONUS"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["BONUS"]: true });
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
              <FormHelperText
                error
                sx={{ visibility: input?.Duration ? "hidden" : "initial" }}
              >
                BONUS must contain numbers Only.
              </FormHelperText>
            </Grid>
            <Grid item xs={12} sm={12} md={5.5} lg={2.7}>
              <TextField
                required
                sx={{ width: "100%" }}
                id="duration"
                value={data?.Duration || ""}
                InputLabelProps={{ shrink: true }}
                name="Duration"
                label="Duration"
                variant="outlined"
                type="text"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Months</InputAdornment>
                  ),
                }}
                error={!input?.Duration}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = IntegerValidation(e.target.value);

                    setInput({ ...input, ["Duration"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["Duration"]: true });
                  }
                }}
              />
              <FormHelperText
                error
                sx={{ visibility: input?.Duration ? "hidden" : "initial" }}
              >
                BONUS must contain numbers Only.
              </FormHelperText>
            </Grid>

            <Grid item xs={12} sm={12} md={5.5} lg={2.7}>
              <TextField
                required
                id="RegFees"
                size="small"
                value={data?.RegFees || ""}
                InputLabelProps={{ shrink: true }}
                name="RegFees"
                label="Registration Fees"
                fullWidth
                error={!input?.RegFees}
                variant="outlined"
                type="text"
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = NumberOnly(e.target.value);

                    setInput({ ...input, ["RegFees"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["RegFees"]: true });
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">₹</InputAdornment>
                  ),
                }}
              />
              <FormHelperText
                error
                sx={{ visibility: input?.Duration ? "hidden" : "initial" }}
              >
                BONUS must contain numbers Only.
              </FormHelperText>
            </Grid>
            <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
              <FormGroup
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <Typography color={"black"} mt={2}>
                  EMI Frequency :
                </Typography>
                <FormControlLabel
                  label="Monthly"
                  control={
                    <Checkbox
                      name="Monthly"
                      value={
                        data?.Monthly == 0 ? 1 : data?.Monthly == 1 ? 0 : null
                      }
                      checked={data?.Monthly == 1 ? true : false}
                      inputProps={{ "aria-label": "controlled" }}
                      id="Monthly"
                    />
                  }
                  sx={{ color: "#000000", mt: 0.7 }}
                />

                <FormControlLabel
                  label="Weekly"
                  control={
                    <Checkbox
                      name="Weekly"
                      value={
                        data?.Weekly == 0 ? 1 : data?.Weekly == 1 ? 0 : null
                      }
                      id="Weekly"
                      checked={data?.Weekly == 1 ? true : false}
                    />
                  }
                  sx={{ color: "#000000", mt: 0.7 }}
                />

                <FormControlLabel
                  label="Daily"
                  control={
                    <Checkbox
                      name="Daily"
                      value={data?.Daily == 0 ? 1 : data?.Daily == 1 ? 0 : null}
                      id="Daily"
                      checked={data?.Daily == 1 ? true : false}
                    />
                  }
                  sx={{ color: "#000000", mt: 0.7 }}
                />
              </FormGroup>
            </Grid>
            <Grid item sm={12} xs={12} md={12} lg={12}>
              <OnOffButton
                yes={"Submit"}
                type1={"submit"}
                functrigger1={onSubmitHandler}
                disabled1={
                  data?.SchemeTitle &&
                  data?.BONUS !== 0 &&
                  data?.BONUS !== "" &&
                  data?.BONUS &&
                  data?.Duration !== 0 &&
                  data?.Duration !== "" &&
                  data?.Duration &&
                  data?.RegFees !== 0 &&
                  data?.RegFees !== "" &&
                  data?.RegFees &&
                  (data?.Monthly || data?.Weekly || data?.Daily) &&
                  !(
                    data?.Monthly == 0 &&
                    data?.Weekly == 0 &&
                    data?.Daily == 0
                  ) &&
                  input?.BONUS == true &&
                  input?.Daily == true &&
                  input?.Duration == true &&
                  input?.Monthly == true &&
                  input?.RegFees == true &&
                  input?.Weekly == true
                    ? false
                    : true
                }
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
export default CreateScheme;
