import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  TextField,
  Box,
  Input,
  FormHelperText,
  Divider,
  Typography,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Modal,
} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";

import { AgentReg, ClearState3 } from "../../Slice/Auth/AgentRegisterSlice";

import Loader from "../../Components/Global/loader";
import ButtonOnOff from "../../Components/Global/OnOffButton";
import ColoredText from "../../Components/styledComponent/ColoredText";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import ReusableDropDown3 from "../../Components/Global/ReusableDropDown3";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AlphabetOnly from "../../Apps/GlobalFunctions/AlphabetOnly";
import NumberOnly from "../../Apps/GlobalFunctions/NumberOnly";
import EmailValidation from "../../Apps/GlobalFunctions/EmailValidation";
import PassportValidation from "../../Apps/GlobalFunctions/PassportValidation";
import DrivingLicenceValidation from "../../Apps/GlobalFunctions/DrivingLicenceValidation";
import AdhaarValidation from "../../Apps/GlobalFunctions/AdhaarValidation";
import VoterCardValidation from "../../Apps/GlobalFunctions/VoterCardValidation";
import BankAccNoValidate from "../../Apps/GlobalFunctions/BankAccNoValidate";
import IFSCValidation from "../../Apps/GlobalFunctions/IFSCValidation";
import PhnoValidation from "../../Apps/GlobalFunctions/PhnoValidation";

import MaxMinDate from "../../Apps/GlobalFunctions/MaxMinDate";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchBranch from "../../Apps/CustomHook/useFetchBranch";
import useFetchArea from "../../Apps/CustomHook/useFetchArea";

export default function AgentRegForm() {
  const dispatch = useDispatch();
  const [Data, setFormData] = useState({
    Name: null,
    Phonenumber: null,
    EmailId: null,
    DOB: null,
    Address: null,
    BankName: null,
    AccountNumber: null,
    IFSCCode: null,
    MICR: null,
    Sex: null,
    NomineeName: null,
    Relation: null,
    IDProofNumber: null,
    IDProofPhoto: null,
    Photo: null,
    AccountType: null,
    IDProofType: null,
    BranchId: null,
    AreaID: null,
    Commision: 0,
    Geolocation:null,
  });
  let PhotoRef = useRef(null);
  let SignatureRef = useRef(null);
  let IDProofPhotoRef = useRef(null);

  const [pic, SetPic] = useState({
    Photo: null,
    Signature: null,
    IDProofPhoto: null,
  });

  const [input, setInput] = useState({
    Name: true,
    phn: true,
    Email: true,
    BankName: true,
    AccountNo: true,
    IFSC: true,
    MICR: true,
    Commission: true,
    NomineeName: true,
    Relation: true,
    Password: true,
    IDProofNumber: true,
  });

  //agent reg
  const { isloading3, msg3, isError3, error3, isSuccess3 } = useSelector(
    (state) => state?.AgentReg
  );

  //logger details
  const { userInfo, global } = UseFetchLogger();

  //Branch list
  const { branch } = useFetchBranch({ Status: 1},[],"");
  //area list
  const { AreaList } = useFetchArea({Status:1});
  var date = new Date();
  var dateString = date.toISOString();
  date = dateString.split("T", 1);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  }

  const ResetAll = () => {
    if (PhotoRef.current) PhotoRef.current.value = "";
    if (SignatureRef.current) SignatureRef.current.value = "";
    if (IDProofPhotoRef.current) IDProofPhotoRef.current.value = "";
    document.getElementById("agentform").reset();
    setInput({
      Name: true,
      phn: true,
      Email: true,
      BankName: true,
      AccountNo: true,
      IFSC: true,
      MICR: true,
      NomineeName: true,
      Relation: true,
      Password: true,
      IDProofNumber: true,
      Commission: true,
    });
    setFormData({
      Name: null,
      Phonenumber: null,
      EmailId: null,
      DOB: null,
      Address: null,
      BankName: null,
      AccountNumber: null,
      IFSCCode: null,
      MICR: null,
      Sex: null,
      NomineeName: null,
      Relation: null,
      IDProofNumber: null,
      IDProofPhoto: null,
      Photo: null,
      Signature: null,
      AccountType: null,
      IDProofType: null,
      BranchId: null,
      AreaID: null,
      Commision: 0,
    });
    SetPic({
      Photo: null,
      Signature: null,
      IDProofPhoto: null,
    });
  }
  
  //agent Reg
  useEffect(() => {
    if (isSuccess3 && !isloading3) {
      toast.success(`${msg3}`, toast.POSITION.TOP_RIGHT);
      ResetAll();
       dispatch(ClearState3());
    }
    if (isError3 && !isloading3) {
      toast.error(`${error3}`, toast.POSITION.TOP_RIGHT);
      dispatch(ClearState3());
    }
    if (isloading3) {
      setOpen(true);
    }
    else {
      setOpen(false);
    }
  }, [isError3, isSuccess3,isloading3]);

  const handleInput = (event) => {
    var key = event?.target?.name;
    var value = event?.target?.value;
    if (key === "Commision" && (value < 0 || value >= 100)) {
      setFormData({ ...Data, [key]: 0 });
    } else if (key === "DOB") {
      let now = new moment().add(-18, "years");
      let inputdate = new moment(value);
      let diffdays = now.diff(inputdate, "days");

      if (diffdays < 0) {
        setFormData({ ...Data, [key]: "" });
      } else {
        setFormData({ ...Data, [key]: value });
      }
    } else {
      value = event?.target?.value;
      setFormData({ ...Data, [key]: value });
    }
  };

  const HandleChangePic = (e) => {
    var key = e.target.name;
    let files = e.target.files;
    SetPic({ ...pic, [key]: files });
  };

  const OnSubmitForm = (e) => {
    e.preventDefault();
    var finalObj = {
      ...Data,
      ...global,
      ...pic,
      SuperUserID: userInfo?.details?.SuperUserID,
    };
    dispatch(AgentReg(finalObj));
  };

  const IdProofValidation = (a) => {
    var b = false;
    if (Data?.IDProofType == "Aadhaar Card") {
      b = AdhaarValidation(a);
    } else if (Data?.IDProofType == "Voter Card") {
      b = VoterCardValidation(a);
    } else if (Data?.IDProofType == "Passport") {
      b = PassportValidation(a);
    } else if (Data?.IDProofType == "Driving Licence") {
      b = DrivingLicenceValidation(a);
    }
    return b;
  };

  const getMaxLengthForIDProof = (idProofType) => {
    switch (idProofType) {
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

  const ManageIdProofNumberDD = (e) => {
    let value = e.target.value;
    if ( Data?.IDProofType !== value)
    {
      setFormData({ ...Data, IDProofNumber: null, IDProofType: value });
      setInput({ ...input, IDProofNumber: true });
    }
    else {
      setFormData({ ...Data, IDProofType: value });
    }
}
console.log(Data,"agent");
  //permission List data Fetch
  let storedData = localStorage.getItem("loggerPermission");
  if (storedData && storedData.length !== 0) {
    let parray = JSON.parse(storedData);
    var myPermission =
      parray && parray.filter((i) => i?.PageName == "Manage Agent")[0];
  }

  var agentmindate = MaxMinDate(18);

  console.log(
    Data?.Name ,
      Data?.Phonenumber ,
      Data?.DOB ,
      Data?.Address ,
      Data?.BankName ,
      Data?.AccountNumber ,
      Data?.IFSCCode ,
      Data?.IDProofNumber ,
      Data?.BranchId ,
      Data?.IDProofType ,
      Data?.AccountType ,
      pic?.IDProofPhoto ,
      pic?.Photo ,
      pic?.Signature ,
      input?.Name == true ,
      input?.phn == true ,
      input?.Email == true ,
      input?.BankName == true ,
      input?.AccountNo == true ,
      input?.IFSC == true ,
      input?.MICR == true ,
      input?.NomineeName == true ,
      input?.Relation == true ,
      input?.Password == true ,
      input?.IDProofNumber == true ,
      input?.Commission == true
  );
  

  return (
    <Grid container maxWidth="lg" mt={3} ml={2}>
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

      <Grid item lg={12} md={12} sm={12} xs={12}>
        <ReusableBreadcrumbs
          props={[
            {
              title: "Home",
              link: global.Utype == 1 ? "/executive" : "/agent",
              icon: "home",
            },
            {
              title: "Manage Agent Details",
              link:
                myPermission?.ViewPage == 1
                  ? "/superuser/agentmanagement"
                  : "#",
              icon: "manage_accounts",
            },
            {
              title: "Add Agent",
              link: "/executive/agentregistration",
              icon: "support_agent",
            },
          ]}
        />
      </Grid>
      <Grid
        item
        lg={12}
        md={12}
        sm={12}
        xs={12}
        mt={1}
        color={"black"}
        mb={2}
        pb={5}
      >
        <Divider />
        <Typography variant="h6" sx={{ py: 1 }}>
          Agent Registration Form
        </Typography>
        <Divider>
          <ColoredText>Personal information</ColoredText>
        </Divider>
        <Box
          component="form"
          encType="multipart/form-data"
          id="agentform"
          onSubmit={OnSubmitForm}
          onChange={handleInput}
          mt={1}
        >
          <Grid container columnGap={5} rowGap={1}>
            <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
              <TextField
                size="small"
                fullWidth
                margin="normal"
                required
                name="Name"
                label="Name"
                type="text"
                id="Agent_Name"
                value={Data?.Name || ""}
                inputProps={{ maxLength: 50 }}
                error={!input?.Name}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = AlphabetOnly(e.target.value);
                    setInput({ ...input, ["Name"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["Name"]: true });
                  }
                }}
              />
              {!input?.Name ? (
                <FormHelperText error>
                  Name must not contain space at first place, number or special
                  character
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
              <TextField
                size="small"
                fullWidth
                margin="normal"
                required
                name="Phonenumber"
                label="Mobile Number"
                type="tel"
                id="Agent_phn"
                value={Data?.Phonenumber || ""}
                error={!input?.phn}
                inputProps={{ maxLength: 10 }}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = PhnoValidation(e.target.value);
                    setInput({ ...input, ["phn"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["phn"]: true });
                  }
                }}
              />
              {!input?.phn ? (
                <FormHelperText error>
                  Phone Number must contain only number.
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
              <TextField
                size="small"
                fullWidth
                margin="normal"
                name="EmailId"
                label="Email Id"
                type="email"
                id="Email_Id"
                value={Data?.EmailId || ""}
                inputProps={{ maxLength: 50 }}
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
            <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
              <label>
                Date of Birth*
                <br />
                <Input
                  value={Data?.DOB}
                  fullWidth
                  type="date"
                  name="DOB"
                  id="DOB"
                  inputProps={{ max: agentmindate }}
                  required
                />
              </label>
            </Grid>
            <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
              <Box mt={2.5}>
                <FormControl>
                  <FormLabel
                    id="demo-controlled-radio-buttons-group"
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      flexDirection: "row",
                    }}
                  >
                    <Typography sx={{ mt: 1, mr: 2 }}>Gender *</Typography>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="Sex"
                      value={Data?.Sex}
                      onChange={handleInput}
                      row
                      aria-required
                    >
                      <FormControlLabel
                        value="Female"
                        control={<Radio />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="Male"
                        control={<Radio />}
                        label="Male"
                      />
                    </RadioGroup>
                  </FormLabel>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Divider>
                <ColoredText>Address Details</ColoredText>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
              <TextField
                value={Data?.Address || ""}
                size="small"
                fullWidth
                margin="normal"
                required
                name="Address"
                label="Enter Address"
                type="text"
                id="Agent_Address"
                multiline={true}
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
              <TextField
                size="small"
                fullWidth
                margin="normal"
                name="Geolocation"
                label="Enter GeoLocation"
                type="text"
                id="GeoLocation"
                rows={4}
                multiline={true}
                value={Data?.Geolocation || ""}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
              <ReusableDropDown4
                required
                label={"Branch*"}
                data={branch}
                ObjectKey={["BranchCode", "BranchName"]}
                uniquekey={"BranchId"}
                Field={Data["BranchId"]}
                onChange={handleInput}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
              <ReusableDropDown4
                required
                label={"Area*"}
                data={AreaList}
                ObjectKey={["AreaName"]}
                uniquekey={"AreaID"}
                Field={Data["AreaID"]}
                onChange={handleInput}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Divider>
                <ColoredText>Bank Details</ColoredText>
              </Divider>
            </Grid>
            <Grid item lg={5.5} md={5.5} xs={12} sm={12}>
              <TextField
                size="small"
                fullWidth
                margin="normal"
                required
                name="BankName"
                label="Enter Bank Name"
                type="text"
                id="Bank_Name"
                value={Data?.BankName || ""}
                inputProps={{ maxLength: 30 }}
                error={!input?.BankName}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = AlphabetOnly(e.target.value);
                    setInput({ ...input, ["BankName"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["BankName"]: true });
                  }
                }}
              />
              {!input?.BankName ? (
                <FormHelperText error>
                  Bank Name must not contain space at first place,Number or
                  special character.
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid item lg={5.5} md={5.5} xs={12} sm={12} mt={1}>
              <ReusableDropDown3
                label={"Account Type*"}
                data={[{ AccountType: "Savings" }, { AccountType: "Current" }]}
                ObjectKey={["AccountType"]}
                uniquekey={"AccountType"}
                state={Data}
                handleChange={handleInput}
              />
            </Grid>
            <Grid item lg={5.5} md={5.5} xs={12} sm={12}>
              <TextField
                size="small"
                fullWidth
                margin="normal"
                required
                name="AccountNumber"
                label="AccountNo"
                type="text"
                id="AccountNo"
                value={Data?.AccountNumber || ""}
                inputProps={{ maxLength: 14 }}
                error={!input?.AccountNo}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = BankAccNoValidate(e.target.value);
                    setInput({ ...input, ["AccountNo"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["AccountNo"]: true });
                  }
                }}
              />
              {!input?.AccountNo ? (
                <FormHelperText error>
                  Bank Account Number must contain numbers or alphabets in upper
                  case only.
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid item lg={5.5} md={5.5} xs={12} sm={12}>
              <TextField
                size="small"
                fullWidth
                margin="normal"
                required
                name="IFSCCode"
                label="Enter IFSC no."
                type="text"
                id="IFSCno"
                value={Data?.IFSCCode || ""}
                inputProps={{ maxLength: 11 }}
                error={!input?.IFSC}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = IFSCValidation(e.target.value);
                    setInput({ ...input, ["IFSC"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["IFSC"]: true });
                  }
                }}
              />
              {!input?.IFSC ? (
                <FormHelperText error>
                  IFSC Code must contain numbers or alphabets in upper case
                  only.
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid item lg={5.5} md={5.5} xs={12} sm={12}>
              <TextField
                size="small"
                fullWidth
                margin="normal"
                name="MICR"
                label="Enter MICR"
                type="text"
                id="MICR"
                value={Data?.MICR || ""}
                inputProps={{ maxLength: 9 }}
                error={!input?.MICR}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = NumberOnly(e.target.value);
                    setInput({ ...input, ["MICR"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["MICR"]: true });
                  }
                }}
              />
              {!input?.MICR ? (
                <FormHelperText error>
                  MICR Number must contain numbers only.
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid item lg={5.5} md={5.5} xs={12} sm={12}>
              <TextField
                size="small"
                fullWidth
                value={Data?.Commision}
                margin="normal"
                error={!input?.Commission}
                name="Commision"
                label="Commission Percentage"
                type="text"
                id="Commission"
                inputProps={{ maxLength: 5 }}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = NumberOnly(e.target.value);
                    setInput({ ...input, ["Commission"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["Commission"]: true });
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
                sx={{ visibility: input?.Commission ? "hidden" : "initial" }}
              >
                Commission must contain numbers Only.
              </FormHelperText>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Divider>
                <ColoredText>ID Proof Details</ColoredText>
              </Divider>
            </Grid>
            <Grid item lg={5.5} md={5.5} xs={12} sm={12} mt={1}>
              <ReusableDropDown3
                label={"Applicant's Id Proof Type*"}
                data={[
                  { IDProofType: "Aadhaar Card" },
                  { IDProofType: "Voter Card" },
                  { IDProofType: "Passport" },
                  { IDProofType: "Driving Licence" },
                  //{ IDProofType: "Pan Card" },
                ]}
                ObjectKey={["IDProofType"]}
                uniquekey={"IDProofType"}
                setState={setFormData}
                state={Data}
                handleChange={ManageIdProofNumberDD}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
              <TextField
                value={Data?.IDProofNumber || ""}
                size="small"
                fullWidth
                margin="normal"
                required
                name="IDProofNumber"
                label="IDProofNumber"
                type="text"
                id="IDProofNumber"
                inputProps={{
                  maxLength: getMaxLengthForIDProof(Data?.IDProofType),
                }}
                error={!input?.IDProofNumber}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res1 = IdProofValidation(e.target.value);
                    setInput({ ...input, ["IDProofNumber"]: res1 });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["IDProofNumber"]: true });
                  }
                }}
              />
              {!input?.IDProofNumber ? (
                <FormHelperText error>
                  Enter Correct IdProof Number
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid item lg={3.5} md={3.5} sm={12} xs={12}>
              <label>
                Upload the Picture of ID Proof*
                <br />
                <input
                  type="file"
                  name="IDProofPhoto"
                  onChange={HandleChangePic}
                  required
                  style={{
                    width: "90%",
                    padding: "5px",
                    borderBottom: "1px solid grey",
                  }}
                />
              </label>
            </Grid>
            <Grid item lg={3.5} md={3.5} sm={12} xs={12}>
              <label>
                Upload Passport Size photo*
                <br />
                <input
                  type="file"
                  name="Photo"
                  onChange={HandleChangePic}
                  required
                  style={{
                    width: "90%",
                    padding: "5px",
                    borderBottom: "1px solid grey",
                  }}
                />
              </label>
            </Grid>{" "}
            <Grid item lg={3.5} md={3.5} sm={12} xs={12}>
              <label>
                Upload photo of applicant's Signature*
                <br />
                <input
                  type="file"
                  name="Signature"
                  onChange={HandleChangePic}
                  required
                  style={{
                    width: "90%",
                    padding: "5px",
                    borderBottom: "1px solid grey",
                  }}
                />
              </label>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Divider>
                <ColoredText>Nominee Details</ColoredText>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
              <TextField
                size="small"
                fullWidth
                margin="normal"
                name="NomineeName"
                label="Enter Nominee Name"
                type="text"
                id="Nominee_Name"
                inputProps={{ maxLength: 50 }}
                error={!input?.NomineeName}
                value={Data?.NomineeName || ""}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = AlphabetOnly(e.target.value);
                    setInput({ ...input, ["NomineeName"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["NomineeName"]: true });
                  }
                }}
              />
              {!input?.NomineeName ? (
                <FormHelperText error>
                  Nominee Name must contain alphabet only.
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
              <TextField
                size="small"
                fullWidth
                margin="normal"
                name="Relation"
                label="Enter Relation"
                type="text"
                id="Relation"
                value={Data?.Relation || ""}
                inputProps={{ maxLength: 20 }}
                error={!input?.Relation}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = AlphabetOnly(e.target.value);
                    setInput({ ...input, ["Relation"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["Relation"]: true });
                  }
                }}
              />
              {!input?.Relation ? (
                <FormHelperText error>
                  Nominee Name must contain alphabet only.
                </FormHelperText>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <ButtonOnOff
                yes={"Submit"}
                no={"Reset"}
                type1={"submit"}
                type2={"reset"}
                functrigger1={OnSubmitForm}
                functrigger2={ResetAll}
                disabled1={
                  Data?.Name &&
                  Data?.Phonenumber &&
                  Data?.DOB &&
                  Data?.Address &&
                  Data?.BankName &&
                  Data?.AccountNumber &&
                  Data?.IFSCCode &&
                  Data?.IDProofNumber &&
                  Data?.BranchId &&
                  Data?.IDProofType &&
                  Data?.AccountType &&
                  pic?.IDProofPhoto &&
                  pic?.Photo &&
                  pic?.Signature &&
                  input?.Name == true &&
                  input?.phn == true &&
                  input?.Email == true &&
                  input?.BankName == true &&
                  input?.AccountNo == true &&
                  input?.IFSC == true &&
                  input?.MICR == true &&
                  input?.NomineeName == true &&
                  input?.Relation == true &&
                  input?.Password == true &&
                  input?.IDProofNumber == true &&
                  input?.Commission == true
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
}
