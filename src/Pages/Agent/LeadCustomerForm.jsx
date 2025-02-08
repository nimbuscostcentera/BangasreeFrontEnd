import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  TextField,
  FormLabel,
  FormControl,
  FormControlLabel,
  Box,
  RadioGroup,
  Radio,
  Typography,
  FormHelperText,
  Divider,
  InputAdornment,
  Modal,
} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ReusableDropDown3 from "../../Components/Global/ReusableDropDown3";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import OnOffButton from "../../Components/Global/OnOffButton";
import Loader from "../../Components/Global/loader";

import {
  LeadCustomer,
  ClearState25,
} from "../../Slice/PortableCustomer/PortableCustomerSlice";

import AlphabetOnly from "../../Apps/GlobalFunctions/AlphabetOnly";
import EmailValidation from "../../Apps/GlobalFunctions/EmailValidation";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";

import PhnoValidation from "../../Apps/GlobalFunctions/PhnoValidation";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchAcode from "../../Apps/CustomHook/useFetchAcode";
import useFetchBranch from "../../Apps/CustomHook/useFetchBranch";
import useFetchArea from "../../Apps/CustomHook/useFetchArea";

export default function LeadCustomerForm() {
  //console.log("Lead reg");
  const dispatch = useDispatch();
  const [rawData, setRawData] = useState({
    CustomerName: null,
    PhoneNumber: null,
    FollowUpDate: null,
    EmailId: null,
    Address: null,
    Sex: null,
    AreaID: null,
    BranchId: null,
    AgentCode: null,
  });
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState({
    CustomerName: true,
    phn: true,
    Email: true,
  });

  let currentdate = new moment().format("YYYY-MM-DD");

  //global logger details
  const { userInfo, global } = UseFetchLogger();

  //area
  const { AreaList } = useFetchArea({ Status: 1 });

  //branch
  const { branch } = useFetchBranch({ Status: 1 }, [], "");

  //agent
  const { AgentCode } = useFetchAcode(
    {
      Status: 1,
      BranchId: rawData?.BranchId,
    },
    [rawData?.BranchId],
    "BranchId"
  );

  const { isloading25, msg25, isError25, error25, isSuccess25 } = useSelector(
    (state) => state?.leadCust
  );

  useEffect(() => {
    if (!isloading25 && isSuccess25) {
      toast.success(`${msg25}`, toast.POSITION.TOP_RIGHT);
      setRawData({
        CustomerName: null,
        PhoneNumber: null,
        EmailId: null,
        Address: null,
        Sex: null,
        AreaID: null,
        BranchId: null,
        AgentCode: global?.Utype == 2 ? global?.AgentCode : null,
      });
      setInput({
        CustomerName: true,
        phn: true,
        Email: true,
      });
      dispatch(ClearState25());
    }
    if (!isloading25 && isError25) {
      toast.error(`${error25}`, toast.POSITION.TOP_RIGHT);
      dispatch(ClearState25());
    }
    if (isloading25) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isError25, isSuccess25, isloading25]);

  const onHandleClose = () => {
    setOpen(true);
  };

  const onChangeHandler = (e) => {
    var key = e?.target?.name;
    var value = e?.target?.value;

    if (key == "FollowUpDate") {
      let now = new moment();
      let inputdate = new moment(value);
      let diffdays = inputdate.diff(now, "days");
      if (diffdays < 0) {
        setRawData({
          ...rawData,
          [key]: "0000-00-00",
        });
      } else {
        setRawData({ ...rawData, [key]: value });
      }
    } else {
      setRawData({ ...rawData, [key]: value });
    }
  };

  const OnSubmitHandler = (e) => {
    e.preventDefault();
    var finalobj = Object.keys(rawData).reduce((acc, key) => {
      if (rawData[key] !== "") {
        acc[key] = rawData[key];
      }
      return acc;
    }, {});
    var Obj;
    if (userInfo?.details?.Utype == 1) {
      Obj = {
        ...finalobj,
        ...global,
        SuperUserID: userInfo?.details?.SuperUserID,
      };
    } else if (userInfo?.details?.Utype == 2) {
      Obj = {
        ...finalobj,
        ...global,
        SuperUserID: userInfo?.details?.SuperUserID,
        AgentCode: userInfo?.details?.AgentCode,
        BranchId: userInfo?.details?.BranchId,
      };
    }
    dispatch(LeadCustomer(Obj));
  };

  const ManageDropDown = (e) => {
    let value = e.target.value;
    //console.log("hi");
    if (rawData?.BranchId !== null && rawData?.BranchId !== value) {
      setRawData({ ...rawData, AgentCode: null, BranchId: value });
    } else {
      setRawData({ ...rawData, BranchId: value });
    }
  };
  //console.log(rawData, "check");
  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Leads")[0];

  return (
    <Grid container maxWidth={"xl"} mt={5} ml={3}>
      <Modal
        open={open}
        onClose={onHandleClose}
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
      <ToastContainer autoClose={5000} />
      <Grid item md={12} lg={12} xs={12} sm={12}>
        <ReusableBreadcrumbs
          props={[
            {
              title: "Home",
              link: global.Utype == 1 ? "/executive" : "/agent",
              icon: "home",
            },
            {
              title: "Manage Leads",
              link:
                myPermission?.ViewPage == 1 ? "/executive/manageleads" : "#",
              icon: "browser_updated",
            },
            {
              title: "Add Leads",
              link: "#",
              icon: "person_add",
            },
          ]}
        />
      </Grid>
      <Grid item md={12} lg={12} xs={12} sm={12} mt={1}>
        <Divider />
      </Grid>
      <Grid item md={12} lg={12} xs={12} sm={12} mt={1}>
        <Typography variant="h5" fontWeight={600} gutterBottom color={"black"}>
          Add Lead Customer
        </Typography>
        <Divider />
      </Grid>
      <Grid item md={12} lg={12} xs={12} sm={12} mt={5}>
        <Box
          component="form"
          id="CreateLead"
          onChange={onChangeHandler}
          onSubmit={OnSubmitHandler}
        >
          <Grid container rowGap={3} columnGap={5}>
            <Grid item lg={5.5} md={5.2} sm={12} xs={12}>
              <TextField
                required
                size="small"
                value={rawData?.CustomerName || ""}
                id="CustomerName"
                name="CustomerName"
                label="Applicant's Name"
                fullWidth
                variant="outlined"
                inputProps={{ maxLength: 50 }}
                error={!input?.CustomerName}
                onChange={(e) => {
                  if (e.target.value != "") {
                    var res = AlphabetOnly(e.target.value);
                    setInput({ ...input, ["CustomerName"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["CustomerName"]: true });
                  }
                }}
              />
              {!input?.CustomerName ? (
                <FormHelperText error>
                  Name must not contain space at first place, number or special
                  character
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid item lg={5.5} md={5.2} sm={12} xs={12}>
              <TextField
                required
                size="small"
                id="PhoneNumber"
                name="PhoneNumber"
                label="Phone Number"
                value={rawData?.PhoneNumber || ""}
                fullWidth
                type="tel"
                error={!input?.phn}
                inputProps={{ maxLength: 10 }}
                onChange={(e) => {
                  if (e.target.value != "") {
                    var res = PhnoValidation(e.target.value);
                    setInput({ ...input, ["phn"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["phn"]: true });
                  }
                }}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+91</InputAdornment>
                  ),
                }}
              />{" "}
              {!input?.phn ? (
                <FormHelperText error>
                  Phone Number must contain only number.
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid
              item
              lg={5.5}
              md={5.2}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mt: 2,
              }}
            >
              <TextField
                size="small"
                id="EmailId"
                name="EmailId"
                label="Email ID"
                fullWidth
                value={rawData?.EmailId || ""}
                variant="outlined"
                type="email"
                inputProps={{ maxLength: 40 }}
                error={!input?.Email}
                onChange={(e) => {
                  if (e.target.value != "") {
                    var res = EmailValidation(e.target.value);
                    setInput({ ...input, ["Email"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["Email"]: true });
                  }
                }}
              />
              {!input?.Email ? (
                <FormHelperText error>Enter a valid Email ID</FormHelperText>
              ) : null}
            </Grid>
            <Grid
              item
              lg={5.5}
              md={5.2}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {" "}
              <FormControl>
                <FormLabel
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    mr: 2,
                    mt: 2,
                    ml: 1,
                  }}
                >
                  <Typography sx={{ mt: 1 }}>Gender*</Typography>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="Sex"
                    value={rawData?.Sex}
                    sx={{ ml: 2 }}
                  >
                    <FormControlLabel
                      control={
                        <Radio
                          value="Female"
                          name="Sex"
                          inputProps={{ "aria-label": "Female" }}
                        />
                      }
                      label="Female"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          value="Male"
                          name="Sex"
                          inputProps={{ "aria-label": "Male" }}
                        />
                      }
                      label="Male"
                    />
                  </RadioGroup>
                </FormLabel>
              </FormControl>
            </Grid>
            <Grid item lg={5.5} md={5.2} sm={12} xs={12}>
              <TextField
                sx={{ mt: 2 }}
                fullWidth
                size="small"
                name="FollowUpDate"
                required
                value={rawData?.FollowUpDate || ""}
                InputLabelProps={{ shrink: true }}
                id="FollowUpDate"
                type="date"
                label="Follow up Date"
                inputProps={{ min: currentdate }}
              />
            </Grid>
            <Grid item lg={5.5} md={5.2} sm={12} xs={12}>
              <Box mb={1.5}>
                <ReusableDropDown4
                  label={"Area*"}
                  data={AreaList}
                  id={"Area"}
                  ObjectKey={["AreaName"]}
                  uniquekey={"AreaID"}
                  Field={rawData["AreaID"]}
                  onChange={onChangeHandler}
                />
              </Box>
            </Grid>{" "}
            {userInfo?.details?.Utype == 1 ? (
              <>
                <Grid item lg={5.5} md={5.2} sm={12} xs={12}>
                  <Box mb={1.5}>
                    <ReusableDropDown3
                      label={"Branch *"}
                      data={branch || []}
                      id={"Branch"}
                      ObjectKey={["BranchCode", "BranchName"]}
                      uniquekey={"BranchId"}
                      setState={setRawData}
                      state={rawData}
                      handleChange={ManageDropDown}
                    />
                  </Box>
                </Grid>
                <Grid item lg={5.5} md={5.2} sm={12} xs={12}>
                  <Box>
                    <ReusableDropDown4
                      label={"AgentCode*"}
                      data={AgentCode}
                      id={"AgentCode"}
                      disabled={
                        rawData?.BranchId !== "" && rawData?.BranchId
                          ? false
                          : true
                      }
                      ObjectKey={["Name", "AgentCode"]}
                      uniquekey={"AgentCode"}
                      Field={rawData["AgentCode"]}
                      onChange={onChangeHandler}
                    />
                  </Box>
                </Grid>
              </>
            ) : null}
            <Grid item lg={12} md={12} sm={12} xs={12} mt={1}>
              <TextField
                value={rawData?.Address || ""}
                name="Address"
                id="Address"
                label="Address"
                fullWidth
                variant="outlined"
                multiline={true}
                rows={5}
              />
            </Grid>
          </Grid>
          {console.log(
            rawData?.CustomerName,
            rawData?.PhoneNumber,
            rawData?.AreaID,
            rawData?.FollowUpDate,
            global?.Utype == 1 ? rawData?.BranchId && rawData?.AgentCode : true,
            rawData?.FollowUpDate,
            input?.phn,
            input?.Email,
            input?.CustomerName
          )}
          <Box sx={{ p: 2, m: 1 }}>
            <OnOffButton
              yes={"Submit"}
              no={"Reset"}
              type1={"submit"}
              type2={"reset"}
              disabled1={
                rawData?.CustomerName &&
                rawData?.PhoneNumber &&
                rawData?.AreaID &&
                rawData?.FollowUpDate &&
                (global?.Utype == 1
                  ? rawData?.BranchId && rawData?.AgentCode
                  : true) &&
                rawData?.FollowUpDate &&
                input?.phn &&
                input?.Email &&
                input?.CustomerName
                  ? false
                  : true
              }
              functrigger1={OnSubmitHandler}
              functrigger2={() => {
                setRawData({
                  CustomerName: null,
                  PhoneNumber: null,
                  EmailId: null,
                  Address: null,
                  Sex: null,
                  AreaID: null,
                  BranchId: null,
                  AgentCode: null,
                  FollowUpDate: null,
                });
                setInput({
                  CustomerName: true,
                  phn: true,
                  Email: true,
                });
              }}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
