import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";

import {
  Grid,
  TextField,
  FormLabel,
  FormControl,
  FormControlLabel,
  Box,
  RadioGroup,
  Radio,
  Typography,
  Input,
  FormHelperText,
  Divider,
  IconButton,
  InputAdornment,
  Modal,
} from "@mui/material";

import Loader from "../../Components/Global/loader";
import ReusableDropDown3 from "../../Components/Global/ReusableDropDown3";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import OnOffButton from "../../Components/Global/OnOffButton";
import ColoredText from "../../Components/styledComponent/ColoredText";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ClearState7, CustomerReg } from "../../Slice/Auth/CustomerRegSlice";

import AlphabetOnly from "../../Apps/GlobalFunctions/AlphabetOnly";
import EmailValidation from "../../Apps/GlobalFunctions/EmailValidation";

import EditIcon from "@mui/icons-material/Edit";

import PassportValidation from "../../Apps/GlobalFunctions/PassportValidation";
import AdhaarValidation from "../../Apps/GlobalFunctions/AdhaarValidation";
import VoterCardValidation from "../../Apps/GlobalFunctions/VoterCardValidation";
import DrivingLicenceValidation from "../../Apps/GlobalFunctions/DrivingLicenceValidation";
import MaxMinDate from "../../Apps/GlobalFunctions/MaxMinDate";
import ValidateImage from "../../Apps/GlobalFunctions/ValidateImage";
import phnoValidation from "../../Apps/GlobalFunctions/PhnoValidation";

import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchBranch from "../../Apps/CustomHook/useFetchBranch";
import useFetchAcode from "../../Apps/CustomHook/useFetchAcode";
import useFetchArea from "../../Apps/CustomHook/useFetchArea";

export default function CustomerRegForm() {
  const dispatch = useDispatch();
  const location = useLocation();
  const a = location.state;
  const { global, userInfo } = UseFetchLogger();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [bool, setbool] = useState(false);
  const [pic, setPic] = useState({
    IdProofPhoto: null,
    AplicantPhoto: null,
    Customersignature: null,
  });
  let IdProofPhotoRef = useRef(null);
  let AplicantPhotoRef = useRef(null);
  let CustomersignatureRef = useRef(null);

  const [rawData, setRawData] = useState({
    CustomerName: a ? a?.CustomerName : null,
    PhoneNumber: a ? a?.PhoneNumber : null,
    EmailId: a ? a?.EmailId : null,
    Guardian: null,
    DOB: null,
    Sex: a ? a?.Sex : null,
    Address: a ? a?.Address : null,
    LocalBody: null,
    LandMark: null,
    BranchId: a ? a?.BranchId : null,
    AreaID: a ? a?.AreaId : null,
    AgentCode: null,
    Geolocation: null,
    IdProofType: null,
    IdProofNumber: null,
    AlternateNo: null,
  });
  //console.log(rawData, global?.Utype, "find");
  const [input, setInput] = useState({
    CustomerName: true,
    phn: true,
    phn1: true,
    Guardian: true,
    Occupation: true,
    Email: true,
    AccountNo: true,
    IdProofNumber: true,
    LocalBody: true,
  });
  //customerReg
  const { isloading7, msg7, isError7, error7, isSuccess7 } = useSelector(
    (state) => state?.CustomerReg
  );
  //areaList
  const { AreaList } = useFetchArea({ Status: 1 });
  //Branch list
  const { branch } = useFetchBranch({ Status: 1 }, [], "");
  //agentCode List data Fetch
  const { AgentCode } = useFetchAcode(
    { Status: 1, BranchId: rawData?.BranchId },
    [rawData?.BranchId],
    "BranchId"
  );

  const ResetHandler = () => {
    if (IdProofPhotoRef.current) IdProofPhotoRef.current.value = "";
    if (AplicantPhotoRef.current) AplicantPhotoRef.current.value = "";
    if (CustomersignatureRef.current) CustomersignatureRef.current.value = "";
    setInput({
      CustomerName: true,
      phn: true,
      phn1: true,
      Guardian: true,
      Occupation: true,
      Email: true,
      AccountNo: true,
      IdProofNumber: true,
      NomineeIdProofNumber: true,
    });
    setRawData({
      IdProofType: null,
      BranchId: null,
      AgentCode: null,
      CustomerName: null,
      PhoneNumber: null,
      AlternateNo: null,
      Occupation: null,
      Guardian: null,
      DOB: null,
      Sex: null,
      Email: null,
      Address: null,
      LocalBody: null,
      LandMark: null,
      IdProofNumber: null,
      IdProofPhoto: null,
      AplicantPhoto: null,
      Customersignature: null,
    });
    setPic({
      IdProofPhoto: null,
      AplicantPhoto: null,
      Customersignature: null,
    });
  };
  //toaster
  useEffect(() => {
    if (!isloading7 && isSuccess7) {
      toast.success(`${msg7}`, toast.POSITION.TOP_RIGHT);
      ResetHandler();
      dispatch(ClearState7());
      navigate("/superuser/customermanagement");
    }
    if (!isloading7 && isError7) {
      toast.error(`${error7}`, toast.POSITION.TOP_RIGHT);
      dispatch(ClearState7());
    }
    if (isloading7) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isError7, isSuccess7, isloading7]);

  const onChangeHandler = (e) => {
    var key = e?.target?.name;
    var value = e?.target?.value;
    if (key === "DOB") {
      let now = new moment().add(-18, "years");
      let inputdate = new moment(e?.target?.value);
      let diffdays = now.diff(inputdate, "days");
      if (diffdays < 0) {
        value = "";
      } else {
        value = e?.target?.value;
      }
    } else {
      value = e?.target?.value;
    }
    setRawData({ ...rawData, [key]: value });
  };

  const HandleChangePic = (e) => {
    var key = e.target.name;
    let files = e.target.files;
    setPic({ ...pic, [key]: files });
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

  const ManageIDProofNumber = (e) => {
    let value = e.target.value;
    if (rawData?.IdProofType !== value) {
      setRawData({ ...rawData, IdProofType: value, IdProofNumber: null });
      setInput({ ...input, IdProofNumber: true });
    } else {
      setRawData({ ...rawData, IdProofType: value });
    }
  };

  const OnSubmitHandler = (e) => {
    e.preventDefault();
    var x, finalobj;
    //filter blank entry of Lead
    if (a !== null && a !== undefined) {
      if (typeof a === "object" && Object.keys(a).length !== 0) {
        x = Object.keys(a).reduce((result, key) => {
          if (a[key] !== null) {
            result[key] = a[key];
          }
          return result;
        }, {});
      }
    }

    //filter blank entry of form
    var freshData = Object.keys(rawData).reduce((result, key) => {
      if (rawData[key] !== "" && rawData !== null && rawData !== undefined) {
        result[key] = rawData[key];
      }
      return result;
    }, {});

    if (userInfo?.details?.Utype == 1) {
      freshData.SuperUserID = userInfo?.details?.SuperUserID;
      freshData.AgentCode = a?.AgentCode || rawData?.AgentCode;
    } else if (userInfo?.details?.Utype == 2) {
      freshData.SuperUserID = userInfo?.details?.SuperUserID;
      freshData.AgentCode = a?.AgentCode || userInfo?.details?.AgentCode;
      freshData.BranchId = a?.BranchId || userInfo?.details?.BranchId;
    }

    if (typeof x == "object") {
      finalobj = { ...x, ...global, ...freshData, ...pic };
    } else {
      finalobj = { ...global, ...freshData, ...pic };
    }
    //console.log(finalobj, "check");
    dispatch(CustomerReg(finalobj));
  };

  const IdProofValidation1 = (args) => {
    var b = false;
    if (rawData?.IdProofType == "Aadhaar Card") {
      b = AdhaarValidation(args);
    } else if (rawData?.IdProofType == "Voter Card") {
      b = VoterCardValidation(args);
    } else if (rawData?.IdProofType == "Passport") {
      b = PassportValidation(args);
    } else if (rawData?.IdProofType == "Driving Licence") {
      b = DrivingLicenceValidation(args);
    }
    return b;
  };

  const getMaxLengthForIDProof = (IdProofType) => {
    switch (IdProofType) {
      case "Aadhaar Card":
        return 12;
      case "Driving Licence":
        return 16;
      case "Passport":
        return 8;
      case "Voter Card":
        return 10;
      default:
        return 45; // Default maxLength
    }
  };

  var e1 = document.getElementById("custIdProofPic");
  const [photovalmsg1, imgbool1] = ValidateImage(e1);
  var e2 = document.getElementById("applicantPhoto");
  const [photovalmsg2, imgbool2] = ValidateImage(e2);
  var e3 = document.getElementById("custsign");
  const [photovalmsg3, imgbool3] = ValidateImage(e3);

  const custAge = MaxMinDate(18);

  //permission List data Fetch
  let storedData = localStorage.getItem("loggerPermission");
  if (storedData && storedData.length !== 0) {
    let parray = JSON.parse(storedData);
    var myPermission =
      parray && parray.filter((i) => i?.PageName == "Manage Customer")[0];
  }

  let IdProofList = [
    { IdProofType: "Aadhaar Card" },
    { IdProofType: "Voter Card" },
    { IdProofType: "Passport" },
    { IdProofType: "Driving Licence" },
    // { IdProofType: "Pan Card" },
  ];

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container maxWidth={"lg"} mt={5} ml={2}>
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

      <Grid item md={12} sm={12} xs={12} lg={12}>
        <ReusableBreadcrumbs
          props={[
            {
              title: "Home",
              link: global.Utype == 1 ? "/executive" : "/agent",
              icon: "home",
            },
            {
              title: "Manage Customer",
              link:
                myPermission?.ViewPage == 1
                  ? "/superuser/customermanagement"
                  : "#",
              icon: "manage_accounts",
            },
            {
              title: "Add Customer",
              link: "#",
              icon: "person_add",
            },
          ]}
        />
      </Grid>

      <Grid item md={12} sm={12} xs={12} lg={12} color={"black"} mt={1}>
        <Divider />
        <Typography variant="h5" gutterBottom pt={1}>
          Customer Registration Form
        </Typography>
        <Divider>
          <ColoredText>Personal Details</ColoredText>
        </Divider>
        <br />
        <Box
          component="form"
          id="CustRegForm"
          encType="multipart/form-data"
          onChange={onChangeHandler}
          onSubmit={OnSubmitHandler}
          justifyContent={"center"}
        >
          <Grid container rowGap={3} columnGap={5}>
            <Grid item lg={5.7} md={5.2} sm={12} xs={12}>
              <TextField
                size="small"
                required
                value={rawData?.CustomerName || a?.CustomerName || ""}
                id="CustomerName"
                name="CustomerName"
                label="Applicant's Name"
                fullWidth
                variant="outlined"
                inputProps={{ maxLength: 50 }}
                InputLabelProps={{ shrink: true }}
                error={!input?.CustomerName}
                onChange={(e) => {
                  if (e.target.value !== "") {
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
            <Grid item lg={5.7} md={5.2} sm={12} xs={12}>
              <TextField
                size="small"
                required
                value={rawData?.Guardian || ""}
                InputLabelProps={{ shrink: true }}
                id="Guardian"
                name="Guardian"
                label="Father's Name/Mother's Name"
                fullWidth
                variant="outlined"
                inputProps={{ maxLength: 50 }}
                error={!input?.Guardian}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = AlphabetOnly(e.target.value);

                    setInput({ ...input, ["Guardian"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["Guardian"]: true });
                  }
                }}
              />{" "}
              {!input?.Guardian ? (
                <FormHelperText error>
                  Name must not contain space at first place, number or special
                  character
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid item lg={5.7} md={5.2} sm={12} xs={12}>
              <TextField
                size="small"
                required
                id="PhoneNumber"
                name="PhoneNumber"
                label="Phone Number"
                fullWidth
                value={rawData?.PhoneNumber || a?.PhoneNumber || ""}
                InputLabelProps={{ shrink: true }}
                type="tel"
                error={!input?.phn}
                inputProps={{ maxLength: 10 }}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = phnoValidation(e.target.value);
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
            <Grid item lg={5.7} md={5.2} sm={12} xs={12}>
              <TextField
                size="small"
                value={rawData?.AlternateNo || ""}
                id="AlternateNo"
                type="tel"
                name="AlternateNo"
                label="Alternative contact Number"
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+91</InputAdornment>
                  ),
                }}
                error={!input?.phn1}
                inputProps={{ maxLength: 10 }}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = phnoValidation(e.target.value);
                    setInput({ ...input, ["phn1"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["phn1"]: true });
                  }
                }}
              />{" "}
              {!input?.phn1 ? (
                <FormHelperText error>
                  Phone Number must contain only number.
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid item lg={5.7} md={5.2} sm={12} xs={12} mt={2}>
              <TextField
                size="small"
                id="EmailId"
                name="EmailId"
                label="Email ID"
                fullWidth
                value={rawData?.EmailId || a?.EmailId || ""}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                type="email"
                inputProps={{ maxLength: 40 }}
                error={!input?.Email}
                onChange={(e) => {
                  if (e.target.value !== "") {
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
            <Grid item lg={5.7} md={5.2} sm={12} xs={12} mt={1}>
              <TextField
                size="small"
                id="Occupation"
                value={rawData?.Occupation || ""}
                name="Occupation"
                label="Occupation"
                InputLabelProps={{ shrink: true }}
                fullWidth
                variant="outlined"
                inputProps={{ maxLength: 30 }}
                error={!input?.Occupation}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = AlphabetOnly(e.target.value);
                    setInput({ ...input, ["Occupation"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["Occupation"]: true });
                  }
                }}
              />{" "}
              {!input?.Occupation ? (
                <FormHelperText error>
                  Occupation must not contain space at first place, number or
                  special character
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid item lg={5.7} md={5.2} sm={12} xs={12}>
              <label>
                Date of Birth*
                <Input
                  required
                  value={rawData?.DOB || ""}
                  InputLabelProps={{ shrink: true }}
                  id="DOB"
                  name="DOB"
                  fullWidth
                  variant="outlined"
                  type="Date"
                  inputProps={{ max: custAge }}
                />
              </label>
            </Grid>
            <Grid item lg={5.7} md={5.2} sm={12} xs={12} mt={1}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <FormControl sx={{ mt: -0.5 }}>
                  <FormLabel
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      flexDirection: "row",
                    }}
                  >
                    <Typography sx={{ mt: 1, mr: 2 }}>Gender*</Typography>

                    <RadioGroup
                      required
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="Sex"
                      value={a?.Sex || rawData?.Sex}
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
              </Box>
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Divider>
                <ColoredText>Address Details</ColoredText>
              </Divider>
              <TextField
                size="small"
                name="Address"
                required
                id="Address"
                value={rawData?.Address || a?.Address || ""}
                InputLabelProps={{ shrink: true }}
                label="Address"
                fullWidth
                variant="outlined"
                multiline={true}
                rows={4}
                sx={{ mt: 3 }}
              />
            </Grid>
            <Grid item lg={5.7} md={5.2} sm={12} xs={12}>
              <TextField
                size="small"
                required
                value={rawData?.LocalBody || ""}
                InputLabelProps={{ shrink: true }}
                id="PMC"
                label="Panchayat / Municipality / Corporation"
                fullWidth
                variant="outlined"
                name="LocalBody"
                error={!input?.LocalBody}
                inputProps={{ maxLength: 200 }}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = AlphabetOnly(e.target.value);
                    setInput({ ...input, ["LocalBody"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["LocalBody"]: true });
                  }
                }}
              />
              {!input?.LocalBody ? (
                <FormHelperText error>
                  LocalBody must not contain space at first place, number or
                  special character
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid item lg={5.7} md={5.2} sm={12} xs={12}>
              <TextField
                required
                value={rawData?.LandMark || ""}
                size="small"
                id="LandMark"
                name="LandMark"
                label="Land Mark"
                InputLabelProps={{ shrink: true }}
                fullWidth
                variant="outlined"
                type="text"
                inputProps={{ maxLength: 200 }}
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12} mt={1}>
              <TextField
                value={rawData?.Geolocation || ""}
                size="small"
                id="GeoLocation"
                name="GeoLocation"
                label="Geo Location"
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                type="text"
                rows={3}
                multiline={true}
              />
            </Grid>
            {a?.BranchId ? (
              bool == false ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}
                >
                  <Typography
                    sx={{
                      mt: 2.5,
                    }}
                  >
                    Change Lead Branch or Agent{" "}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      setbool(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <TextField
                    value={a?.BranchName || ""}
                    label="Branch"
                    size="small"
                    id="Branch"
                    name="BranchId"
                    variant="outlined"
                    type="text"
                    disabled={true}
                    sx={{ mb: 1, mr: 3, mt: 2 }}
                  />

                  <TextField
                    value={a?.AgentCode || ""}
                    label="AgentCode"
                    size="small"
                    id="AgentCode"
                    name="AgentCode"
                    variant="outlined"
                    type="text"
                    disabled={true}
                    sx={{ mb: 1, mr: 3, mt: 2 }}
                  />
                  <TextField
                    value={a?.AreaName || ""}
                    label="Area"
                    size="small"
                    id="AreaName"
                    name="Area Name"
                    variant="outlined"
                    type="text"
                    disabled={true}
                    sx={{ mb: 1, mt: 2 }}
                  />
                </Box>
              ) : (
                <>
                  <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    display={"flex"}
                    justifyContent={"flex-start"}
                  >
                    <Typography
                      sx={{
                        mt: 2.5,
                      }}
                    >
                      Change Lead Branch or Agent{" "}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        setbool(true);
                      }}
                      sx={{ mt: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Grid>
                  <Grid item lg={3.7} md={2.5} sm={12} xs={12}>
                    <ReusableDropDown3
                      label={"Area*"}
                      data={AreaList}
                      id={"Area"}
                      disabled={false}
                      ObjectKey={["AreaName"]}
                      uniquekey={"AreaID"}
                      setState={setRawData}
                      state={rawData}
                      handleChange={onChangeHandler}
                    />
                  </Grid>
                  <Grid item lg={3.7} md={3.4} sm={12} xs={12}>
                    <ReusableDropDown3
                      label={"Branch*"}
                      data={branch}
                      id={"Branch"}
                      disabled={false}
                      ObjectKey={["BranchCode", "BranchName"]}
                      uniquekey={"BranchId"}
                      setState={setRawData}
                      state={rawData}
                      handleChange={ManageDropDown}
                    />
                  </Grid>
                  <Grid item lg={3.7} md={3.4} sm={12} xs={12}>
                    {userInfo?.details?.Utype == 2 ? null : (
                      <>
                        <ReusableDropDown3
                          label={"AgentCode*"}
                          data={AgentCode}
                          id={"AgentCode"}
                          disabled={rawData?.BranchId ? false : true}
                          ObjectKey={["Name", "AgentCode"]}
                          uniquekey={"AgentCode"}
                          setState={setRawData}
                          state={rawData}
                          handleChange={onChangeHandler}
                        />
                      </>
                    )}
                  </Grid>
                </>
              )
            ) : (
              <>
                <Grid item lg={3.7} md={2.5} sm={12} xs={12}>
                  <ReusableDropDown3
                    label={"Area *"}
                    data={AreaList}
                    id={"Area"}
                    ObjectKey={["AreaName"]}
                    uniquekey={"AreaID"}
                    ddwidth={"100%"}
                    setState={setRawData}
                    state={rawData}
                    handleChange={onChangeHandler}
                  />
                </Grid>
                <Grid item lg={3.7} md={3.4} sm={12} xs={12}>
                  {userInfo?.details?.Utype == 1 ? (
                    <ReusableDropDown3
                      label={"Branch *"}
                      data={branch}
                      id={"Branch"}
                      ObjectKey={["BranchName"]}
                      uniquekey={"BranchId"}
                      setState={setRawData}
                      state={rawData}
                      handleChange={ManageDropDown}
                    />
                  ) : (
                    <TextField
                      size="small"
                      fullWidth
                      label="BranchCode"
                      name="Branch"
                      disabled={true}
                      value={userInfo?.details?.BranchName || ""}
                      InputLabelProps={{ shrink: true }}
                      style={{ marginTop: 8 }}
                    />
                  )}
                </Grid>
                <Grid item lg={3.7} md={3.4} sm={12} xs={12}>
                  {userInfo?.details?.Utype == 2 ? null : (
                    <ReusableDropDown3
                      label={"AgentCode *"}
                      data={AgentCode}
                      id={"AgentCode"}
                      disabled={rawData?.BranchId ? false : true}
                      ObjectKey={["Name", "AgentCode"]}
                      uniquekey={"AgentCode"}
                      setState={setRawData}
                      state={rawData}
                      handleChange={onChangeHandler}
                    />
                  )}
                </Grid>
              </>
            )}

            <Grid item sm={12} md={12} lg={12} xs={12}>
              <Divider>
                <ColoredText>
                  ID Proof Details of Customer (optional)
                </ColoredText>
              </Divider>
            </Grid>
            <Grid item lg={5.7} md={5.2} sm={12} xs={12}>
              <ReusableDropDown3
                label={"Applicant's Id Proof Type"}
                data={IdProofList}
                id={"IdProofType"}
                ObjectKey={["IdProofType"]}
                uniquekey={"IdProofType"}
                setState={setRawData}
                state={rawData}
                handleChange={ManageIDProofNumber}
              />
            </Grid>
            <Grid item lg={5.7} md={5.2} sm={12} xs={12} mt={1}>
              <TextField
                size="small"
                id="IdProofNumber"
                name="IdProofNumber"
                value={rawData?.IdProofNumber || ""}
                label="Applicant's Id Proof Number"
                fullWidth
                disabled={rawData?.IdProofType ? false : true}
                variant="outlined"
                error={!input?.IdProofNumber}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = IdProofValidation1(e.target.value);
                    setInput({ ...input, ["IdProofNumber"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["IdProofNumber"]: true });
                  }
                }}
                inputProps={{
                  maxLength: getMaxLengthForIDProof(rawData?.IdProofType),
                }}
              />
              {!input?.IdProofNumber ? (
                <FormHelperText error>
                  Enter correct IdProof Number
                </FormHelperText>
              ) : null}
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              Upload Id Proof of Applicant (Passport/Aadhar card / voter ID card
              /Driving license) :{"\n"}
              <input
                id={"custIdProofPic"}
                style={{
                  width: "90%",
                  padding: "5px",
                  borderBottom: "1px solid grey",
                }}
                ref={IdProofPhotoRef}
                type="file"
                onChange={HandleChangePic}
                name="IdProofPhoto"
                aria-label="Pic of Applicant's Photo Id Proof *"
              />
              {imgbool1 == true ? (
                <Typography color={"error"}>{photovalmsg1}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={12} sm={12} my={2} md={5.5} lg={5.5}>
              Upload Applicant Passport Size Photo :{"\n"}
              <input
                style={{
                  width: "90%",
                  padding: "5px",
                  borderBottom: "1px solid grey",
                }}
                id="applicantPhoto"
                type="file"
                onChange={HandleChangePic}
                name="AplicantPhoto"
                aria-label="Pic of Applicant's Photo *"
                ref={AplicantPhotoRef}
              />{" "}
              {imgbool2 == true ? (
                <Typography color={"error"}>{photovalmsg2}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={12} sm={12} my={2} md={5.5} lg={5.5}>
              Customer Signature:{"\n"}
              <input
                style={{
                  width: "90%",
                  padding: "5px",
                  borderBottom: "1px solid grey",
                }}
                id={"custsign"}
                type="file"
                onChange={HandleChangePic}
                name="Customersignature"
                aria-label="Customer Signature *"
                ref={CustomersignatureRef}
              />{" "}
              {imgbool3 == true ? (
                <Typography color={"error"}>{photovalmsg3}</Typography>
              ) : null}
            </Grid>
          </Grid>
          <Box sx={{ p: 2, m: 1 }}>
            <OnOffButton
              yes={"Submit"}
              no={"Reset"}
              type1={"submit"}
              type2={"reset"}
              disabled1={
                (rawData?.CustomerName || a?.CustomerName) &&
                (rawData?.PhoneNumber || a?.PhoneNumber) &&
                rawData?.Guardian &&
                rawData?.DOB &&
                (rawData?.Sex || a?.Sex) &&
                rawData?.LocalBody &&
                rawData?.LandMark &&
                (rawData?.Address || a?.Address) &&
                (rawData?.AreaID || a?.AreaID) &&
                input?.CustomerName == true &&
                input?.phn == true &&
                input?.Guardian == true
                  ? false
                  : true
              }
              functrigger1={OnSubmitHandler}
              functrigger2={ResetHandler}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
