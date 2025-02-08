import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import {
  TextField,
  Typography,
  FormHelperText,
  Divider,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Modal,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";

import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import OnOffButton from "../../Components/Global/OnOffButton";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import BiSepBox from "../../Components/styledComponent/BiSepBox";
import CenterBox from "../../Components/styledComponent/CenterBox";
import Loader from "../../Components/Global/loader";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { SchemeList, ClearState18 } from "../../Slice/Scheme/SchemeListSlice";
import { EditScheme, ClearState19 } from "../../Slice/Scheme/EditSchemeSlice";

import AlphaNumeric from "../../Apps/GlobalFunctions/AlphaNumeric";
import NumberOnly from "../../Apps/GlobalFunctions/NumberOnly";

import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const CustomTheme = createTheme({
  breakpoints: {
    keys: ["xxs", "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"],
    values: {
      xxs: 100,
      xs: 200,
      sm: 400,
      mid: 550,
      md: 766,
      lg: 1000,
      xl: 1110,
      xxl: 1210,
      xxxl: 1345,
      Big: 1500,
    },
  },
});

function EditSchemeData() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { SUUid } = location.state;
  const [Edit, setEdit] = useState(false);
  const [EditData, setEditData] = useState({
    SchemeTitle: null,
    EmiAmt: 0,
    NOEMI: 0,
    EXPAMT: 0,
    BONUS: 0,
    Regfees: 0,
    Duration: 0,
    DurationType: null,
    Status: null,
    Monthly: null,
    Weekly: null,
    Daily: null,
  });
  const [input, setInput] = useState({
    SchemeTitle: true,
    EmiAmt: true,
    NOEMI: true,
    EXPAMT: true,
    BONUSNOEMI: true,
    Regfees: true,
    Duration: true,
    DurationType: true,
    Status: true,
  });

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  //Scheme List for Table
  const { isloading18, Schemes, isError18, error18, isSuccess18 } = useSelector(
    (state) => state.SchemeList
  );

  //Edit Scheme Table
  const { isloading19, Msg19, isError19, error19, isSuccess19 } = useSelector(
    (state) => state.EditScheme
  );

  //User Details
  const { global } = UseFetchLogger();

  //Scheme List
  useEffect(() => {
    if (SUUid !== undefined) {
      dispatch(SchemeList({ ...global, SUUid: SUUid }));
    }
  }, [SUUid, Edit, isSuccess19]);

  //schemeList response save to hook
  let data = useMemo(() => {
    if (isSuccess18 && !isloading18 && SUUid !== undefined) {
      return Schemes[0];
    }
  }, [isSuccess18, isError18, SUUid, Edit]);

  //EditeScheme Response
  useEffect(() => {
    if (isSuccess19 && !isloading19) {
      toast.success(`${Msg19}`, { positions: toast.POSITION.TOP_RIGHT });
      setInput({
        SchemeTitle: true,
        EmiAmt: true,
        NOEMI: true,
        EXPAMT: true,
        BONUSNOEMI: true,
        Regfees: true,
        Duration: true,
        DurationType: true,
        Status: true,
      });
      setEdit(false);
      dispatch(ClearState19());
    }
    if (isError19 && !isloading19) {
      toast.error(`${error19}`, { positions: toast.POSITION.TOP_RIGHT });
      setEdit(true);
    }
  }, [isSuccess19, isError19]);

  const OnsubmitHandler = (e) => {
    e.preventDefault();
    var filtrateobj = Object.keys(EditData).reduce((acc, key) => {
      if (
        EditData[key] !== null &&
        EditData[key] !== undefined &&
        EditData[key] !== ""
      ) {
        if (key == "Status" && EditData[key] == 2) {
          acc[key] = 0;
        } else {
          acc[key] = EditData[key];
        }
      }
      return acc;
    }, {});
    var finalObj = { ...global, ...filtrateobj, SUUid: SUUid };
    dispatch(EditScheme(finalObj));
    setEdit(false);
  };

  const InputHandler = (e) => {
    var value = e.target.value;
    var key = e.target.name;
    if (key == "BONUS" && (value >= 100 || value < 0)) {
      value = "";
    }
    if (key == "RegFees" && value < 0) {
      value = "";
    }
    if (key == "Duration" && value < 0) {
      value = "";
    }
    setEditData({ ...EditData, [key]: value });
  };

  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Schemes")[0];

  useEffect(() => {
    if (isloading19 || isloading18) {
      setOpen(true);
    } else {
      if (SUUid == data?.SUUid) {
        setOpen(false);
        setEditData({
          SchemeTitle: data?.SchemeTitle,
          EmiAmt: data?.EmiAmt,
          NOEMI: data?.NOEMI,
          EXPAMT: data?.EXPAMT,
          BONUS: data?.BONUS,
          Regfees: data?.Regfees,
          Duration: data?.Duration,
          DurationType: data?.DurationType,
          Status: data?.Status,
          Monthly: data?.Monthly,
          Weekly: data?.Weekly,
          Daily: data?.Daily,
        });
      } else {
        setOpen(true);
      }
    }
  }, [isloading18, isloading19, data, Edit]);

  return (
    <ThemeProvider theme={CustomTheme}>
      <Grid container maxWidth={"xxxl"} mt={3} ml={2}>
        <ToastContainer autoClose={8000} />
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
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          display={"flex"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
        >
          <ReusableBreadcrumbs
            props={[
              {
                title: "Home",
                link: global.Utype == 1 ? "/executive" : "/agent",
                icon: "home",
              },
              {
                title: "Manage Gold Saving Schemes",
                link:
                  myPermission?.ViewPage == 1 ? "/superuser/managescheme" : "#",
                icon: "manage_accounts",
              },
              {
                title: "Edit Schemes",
                link: "#",
                icon: "edit",
              },
            ]}
          />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={12} my={0.2}>
          <Divider />
        </Grid>
        <Grid
          xs={12}
          sm={12}
          md={12}
          lg={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color={"black"}>
            Scheme Details
          </Typography>
          <BiSepBox>
            <IconOnOffButton
              icon1={Edit ? <VisibilityIcon /> : <EditIcon />}
              icon2={<ArrowBackIcon />}
              h1={
                Edit ? (
                  <Typography>Edit Mode |</Typography>
                ) : (
                  <Typography>View Mode |</Typography>
                )
              }
              Tooltip1={Edit ? "View" : "Edit"}
              Tooltip2={"Back"}
              state={Edit}
              setState={setEdit}
              funcTrigger1={() => {
                setEdit(!Edit);
              }}
              funcTrigger2={() => {
                setEditData(data);
                navigate("/superuser/managescheme");
              }}
              mt={0.2}
            />
          </BiSepBox>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={12} my={0.2}>
          <Divider />
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={12} mt={2}>
          <Box component={"form"}>
            <Grid container columnGap={5}>
              <Grid item lg={2.5} md={5.5} sm={12} xs={12}>
                <TextField
                  value={EditData?.SchemeTitle || ""}
                  disabled={!Edit}
                  fullWidth
                  margin="normal"
                  required
                  size="small"
                  label={"Scheme Title"}
                  InputLabelProps={{ shrink: true }}
                  name="SchemeTitle"
                  type="text"
                  id="SchemeTitle"
                  inputProps={{ maxLength: 50 }}
                  error={!input?.SchemeTitle}
                  onChange={(e) => {
                    var res = AlphaNumeric(e.target.value);
                    setInput({ ...input, ["SchemeTitle"]: res });
                    InputHandler(e);
                  }}
                />
                {!input?.SchemeTitle ? (
                  <FormHelperText error>
                    Scheme Title must not contain space,small letter at first
                    place and special characters.
                  </FormHelperText>
                ) : null}
              </Grid>

              <Grid item lg={2.5} md={5.5} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={EditData?.BONUS || ""}
                  fullWidth
                  label={"Bonus Percentage"}
                  InputLabelProps={{ shrink: true }}
                  disabled={!Edit}
                  margin="normal"
                  required
                  name="BONUS"
                  type="number"
                  id="BONUSNOEMI"
                  error={!input?.BONUSNOEMI}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["BONUSNOEMI"]: true });
                    } else {
                      var res = NumberOnly(e.target.value);
                      setInput({ ...input, ["BONUSNOEMI"]: res });
                    }
                    InputHandler(e);
                  }}
                />
                {!input?.BONUSNOEMI ? (
                  <FormHelperText error>
                    Bonus Number of EMI must not contain negetive number or
                    characters.
                  </FormHelperText>
                ) : null}{" "}
              </Grid>

              <Grid item lg={2.5} md={5.5} sm={12} xs={12}>
                <TextField
                  value={EditData?.Regfees || ""}
                  fullWidth
                  size="small"
                  disabled={!Edit}
                  margin="normal"
                  required
                  name="Regfees"
                  label="Registration Fees"
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  id="Regfees"
                  error={!input?.Regfees}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">₹</InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    var res = NumberOnly(e.target.value);
                    setInput({ ...input, ["Regfees"]: res });
                    InputHandler(e);
                  }}
                />
                {!input?.Regfees ? (
                  <FormHelperText error>
                    Registration fees must not contain negetive number or
                    characters.
                  </FormHelperText>
                ) : null}{" "}
              </Grid>

              <Grid item lg={2.5} md={5.5} sm={12} xs={12}>
                <TextField
                  id="outlined-start-adornment"
                  size="small"
                  value={EditData?.Duration || ""}
                  fullWidth
                  disabled={!Edit}
                  margin="normal"
                  required
                  name="Duration"
                  label="Duration"
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  aria-describedby="outlined-weight-helper-text"
                  error={!input?.Duration}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">months</InputAdornment>
                    ),
                  }}
                  sx={{ mt: 2, color: "black" }}
                  onChange={(e) => {
                    var res = NumberOnly(e.target.value);
                    setInput({ ...input, ["Duration"]: res });
                    InputHandler(e);
                  }}
                />
                {!input?.Duration ? (
                  <FormHelperText error id="outlined-weight-helper-text">
                    Duration must not contain negetive number or characters.
                  </FormHelperText>
                ) : null}{" "}
              </Grid>

              {Edit ? (
                <>
                  <Grid item lg={2.5} md={5.5} sm={12} xs={12} mt={1}>
                    <ReusableDropDown4
                      label={"Status"}
                      data={[
                        { Status: 1, Value: "Active" },
                        { Status: 2, Value: "Inactive" },
                        { Status: 3, Value: "Pending" },
                      ]}
                      id={"arial_sr_status"}
                      disabled={!Edit}
                      ObjectKey={["Value"]}
                      Field={EditData?.Status}
                      uniquekey={"Status"}
                      deselectvalue={false}
                      onChange={InputHandler}
                    />
                  </Grid>
                  <Grid item lg={2.5} md={5.5} sm={12} xs={12}>
                    <TextField
                      value={
                        data?.Status == 1
                          ? "Active"
                          : data?.Status == 0
                          ? "Inactive"
                          : null
                      }
                      disabled={true}
                      margin="normal"
                      fullWidth
                      required
                      name="Status"
                      type="text"
                      id="Status"
                      size="small"
                      inputProps={{ maxLength: 30 }}
                      error={!input?.Status}
                      label="Status"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item lg={2.5} md={5.5} sm={12} xs={12}>
                  <TextField
                    value={Edit ? null : data?.Status ? "Active" : "Inactive"}
                    disabled={!Edit}
                    fullWidth
                    size="small"
                    margin="normal"
                    required
                    name="Status"
                    type="text"
                    id="Status"
                    inputProps={{ maxLength: 30 }}
                    error={!input?.Status}
                    label="Status"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}

              <Grid
                item
                sm={12}
                lg={5.2}
                md={5.5}
                sx={{
                  mt: {
                    xs: 1,
                    sm: 1,
                  },
                }}
              >
                <FormGroup
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography
                    sx={{
                      color: Edit ? "black" : "grey",
                      mt: 1.8,
                    }}
                  >
                    EMI Frequency :
                  </Typography>
                  <FormControlLabel
                    label="Monthly"
                    control={
                      <Checkbox
                        name="Monthly"
                        value={
                          EditData?.Monthly !== null
                            ? EditData?.Monthly == 1
                              ? 0
                              : 1
                            : data?.Monthly == 1
                            ? 0
                            : 1
                        }
                        checked={
                          EditData?.Monthly !== null
                            ? EditData?.Monthly == 1
                              ? true
                              : false
                            : data?.Monthly == 1
                            ? true
                            : false
                        }
                        disabled={!Edit}
                        id="Monthly"
                        onChange={InputHandler}
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
                          EditData?.Weekly !== null
                            ? EditData?.Weekly == 1
                              ? 0
                              : 1
                            : data?.Weekly == 1
                            ? 0
                            : 1
                        }
                        checked={
                          EditData?.Weekly !== null
                            ? EditData?.Weekly == 1
                              ? true
                              : false
                            : data?.Weekly == 1
                            ? true
                            : false
                        }
                        id="Weekly"
                        disabled={!Edit}
                        onChange={InputHandler}
                      />
                    }
                    sx={{ color: "#000000", mt: 0.7 }}
                  />

                  <FormControlLabel
                    label="Daily"
                    control={
                      <Checkbox
                        name="Daily"
                        value={
                          EditData?.Daily !== null
                            ? EditData?.Daily == 1
                              ? 0
                              : 1
                            : data?.Daily == 1
                            ? 0
                            : 1
                        }
                        checked={
                          EditData?.Daily !== null
                            ? EditData?.Daily == 1
                              ? true
                              : false
                            : data?.Daily == 1
                            ? true
                            : false
                        }
                        id="Daily"
                        disabled={!Edit}
                        onChange={InputHandler}
                      />
                    }
                    sx={{ color: "#000000", mt: 0.7 }}
                  />
                </FormGroup>
              </Grid>
              {Edit ? (
                <Grid item md={12} sm={12} xs={12} lg={12}>
                  <CenterBox mt={2}>
                    <OnOffButton
                      yes={"Update"}
                      type1={"Edit"}
                      disabled1={!Edit ? true : false}
                      functrigger1={OnsubmitHandler}
                    />
                  </CenterBox>
                </Grid>
              ) : null}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default EditSchemeData;
