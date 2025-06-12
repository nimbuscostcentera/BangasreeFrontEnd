import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  TextField,
  FormLabel,
  FormControl,
  FormControlLabel,
  Box,
  RadioGroup,
  Radio,
  FormHelperText,
  Divider,
  Typography,
  Modal,
  Checkbox,
} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";

import OnOffButton from "../../Components/Global/OnOffButton";
import Loader from "../../Components/Global/loader";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import ReusableDropDown3 from "../../Components/Global/ReusableDropDown3";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";

import { SuperUserReg, ClearState37 } from "../../Slice/Auth/SuperUserRegSlice";
import useFetchDesignation from "../../Apps/CustomHook/useFetchDesignation";
import useFetchBranch from "../../Apps/CustomHook/useFetchBranch";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";

import PhnoValidation from "../../Apps/GlobalFunctions/PhnoValidation";
import AdhaarValidation from "../../Apps/GlobalFunctions/AdhaarValidation";
import VoterCardValidation from "../../Apps/GlobalFunctions/VoterCardValidation";
import PassportValidation from "../../Apps/GlobalFunctions/PassportValidation";
import DrivingLicenceValidation from "../../Apps/GlobalFunctions/DrivingLicenceValidation";
import AlphabetOnly from "../../Apps/GlobalFunctions/AlphabetOnly";
import EmailValidation from "../../Apps/GlobalFunctions/EmailValidation";

export default function SuperUserRegForm() {
  const dispatch = useDispatch();
  let IdProofPicRef = useRef(null);
  let SignatureRef = useRef(null);
  let PhotoRef = useRef(null);
  // console.log(
  //   "hello",
  //   SignatureRef.current.value,
  //   IdProofPicRef.current.file,
  //   PhotoRef.current.file
  // );
  const [formData, setFormData] = useState({
    Name: null,
    PhoneNumber: null,
    EmailId: null,
    Sex: null,
    Address: null,
    Did: null,
    BranchId: null,
    IdProoftype: null,
    IdProofNumber: null,
    Photo: null,
    IdProofPic: null,
    Signature: null,
    SUtype: null,
  });
  const [pic, setPic] = useState({
    Photo: null,
    IdProofPic: null,
    Signature: null,
  });
  const [input, setInput] = useState({
    Name: true,
    phn: true,
    Email: true,
    IdProofNumber: true,
  });
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  //auth
  const { global } = UseFetchLogger();
  //designatin
  const { des } = useFetchDesignation({ Status: 1 }, []);

  //Branch list
  const { branch } = useFetchBranch({ Status: 1 }, [], "");

  //supuser reg
  const { isloading37, isSuccess37, isError37, Resp37, error37 } = useSelector(
    (state) => state.superuserReg
  );
  const ResetAll = () => {
    if (PhotoRef.current) PhotoRef.current.value = ""; // Reset file input
    if (SignatureRef.current) SignatureRef.current.value = "";
    if (IdProofPicRef.current) IdProofPicRef.current.value = "";
    setInput({
      Name: true,
      phn: true,
      Email: true,
      IdProofNumber: true,
    });
    setFormData({
      Name: null,
      Sex: null,
      Did: null,
      BranchId: null,
      PhoneNumber: null,
      EmailId: null,
      Address: null,
      IdProoftype: null,
      IdProofNumber: null,
      Photo: null,
      IdProofPic: null,
      Signature: null,
      SUtype: null,
    });
    setPic({
      Photo: null,
      IdProofPic: null,
      Signature: null,
    });
  };

  //supuser reg response in toaster
  useEffect(() => {
    if (isSuccess37 && !isloading37) {
      ResetAll();
      toast.success(Resp37, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState37());
    }
    if (isError37 && !isloading37) {
      toast.error(error37, { position: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState37());
    }
    if (isloading37) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isSuccess37, isError37, isloading37]);

  const handleInput = (event) => {
    var key = event.target.name;
    var value = event.target.value;
    setFormData({ ...formData, [key]: value });
  };

  const OnSubmitForm = (e) => {
    e.preventDefault();
    let obj = { ...formData, ...global, ...pic };
    dispatch(SuperUserReg(obj));
  };

  const IdProofValidation = (a) => {
    var b = false;
    if (formData?.IdProoftype == "Aadhaar Card") {
      b = AdhaarValidation(a);
    } else if (formData?.IdProoftype == "Voter Card") {
      b = VoterCardValidation(a);
    } else if (formData?.IdProoftype == "Passport") {
      b = PassportValidation(a);
    } else if (formData?.IdProoftype == "Driving Licence") {
      b = DrivingLicenceValidation(a);
    }
    return b;
  };

  const HandleChangePic = (e) => {
    var key = e.target.name;
    let files = e.target.files;
    setPic({ ...pic, [key]: files });
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
    if (formData?.IdProoftype !== value) {
      setFormData({ ...formData, IdProofNumber: null, IdProoftype: value });
      setInput({ ...input, IdProofNumber: true });
    } else {
      setFormData({ ...formData, IdProoftype: value });
    }
  };

  //permission List data Fetch
  let storedData = localStorage.getItem("loggerPermission");
  if (storedData && storedData.length !== 0) {
    let parray = JSON.parse(storedData);
    var myPermission =
      parray && parray.filter((i) => i?.PageName == "Manage Backoffice")[0];
  }
  //console.log("Super user Reg", formData);
  return (
    <Grid
      container
      maxWidth="lg"
      mt={3}
      ml={3}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
      <Grid item lg={12} md={12} sm={12} xs={12} color={"#000000"}>
        <ReusableBreadcrumbs
          props={[
            { title: "Home", link: "/executive", icon: "home" },
            {
              title: "Manage SuperUser Details",
              link:
                myPermission?.ViewPage == 1
                  ? "/superuser/SuperUsermanagement"
                  : "#",
              icon: "manage_accounts",
            },
            {
              title: "Add SuperUser",
              link: "/superuser/superuserregistration",
              icon: "add_moderator",
            },
          ]}
        />
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12} color={"#000000"} mt={1}>
        {" "}
        <Divider />
        <Typography variant="h6" sx={{ mt: 1 }}>
          SuperUser Registration Form
        </Typography>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12} color={"#000000"} mt={1}>
        <Divider />
        <Box
          component="form"
          encType="multipart/form-data"
          width={"100%"}
          onChange={handleInput}
          onSubmit={OnSubmitForm}
          id="superuserform"
          mb={2}
          py={2}
        >
          <Grid container columnGap={4}>
            <Grid item lg={5.5} md={5.5} sm={12} xs={12}>
              <TextField
                size="small"
                fullWidth
                margin="normal"
                required
                value={formData?.Name || ""}
                name="Name"
                label="Name"
                type="text"
                id="Name"
                error={!input?.Name}
                sx={{ my: 0.2 }}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = AlphabetOnly(e.target.value);

                    setInput({ ...input, ["Name"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["Name"]: true });
                  }
                }}
              />
              <FormHelperText
                error
                sx={{
                  visibility: input?.Name ? "hidden" : "visible",
                  mb: 1,
                }}
              >
                Name must not contain space at first place, number or special
                character
              </FormHelperText>
            </Grid>
            <Grid item lg={5.5} md={5.5} sm={12} xs={12}>
              <TextField
                size="small"
                fullWidth
                margin="normal"
                required
                value={formData?.PhoneNumber || ""}
                name="PhoneNumber"
                label="Phone Number"
                type="tel"
                id="PhoneNumber"
                error={!input?.phn}
                sx={{ my: 0.2 }}
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
              <FormHelperText
                error
                sx={{
                  visibility: input?.phn ? "hidden" : "visible",
                  mb: 1,
                }}
              >
                Phone Number must contain only number.
              </FormHelperText>
            </Grid>
            <Grid item lg={5.5} md={5.5} sm={12} xs={12}>
              <TextField
                size="small"
                fullWidth
                margin="normal"
                required
                value={formData?.EmailId || ""}
                name="EmailId"
                label="EmailId"
                type="email"
                id="EmailId"
                sx={{ my: 0.2 }}
                error={!input?.Email}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = EmailValidation(e.target.value);
                    setInput({ ...input, ["Email"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["Email"]: true });
                  }
                }}
              />{" "}
              <FormHelperText
                error
                sx={{ visibility: input?.Email ? "hidden" : "visible", mb: 1 }}
              >
                Enter a valid Email ID
              </FormHelperText>
            </Grid>
            <Grid item lg={5.5} md={5.5} sm={12} xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  ml: 3,
                  alignItems: "center",
                }}
              >
                <FormControl>
                  <FormLabel
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography sx={{ mr: 2, mt: 1 }}>Gender*</Typography>
                    <RadioGroup
                      row
                      required
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="Sex"
                      value={formData?.Sex}
                    >
                      <FormControlLabel
                        value="Female"
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
              <TextField
                size="small"
                required
                value={formData?.Address || ""}
                fullWidth
                label="Address"
                multiline={true}
                rows="5"
                cols="100"
                name="Address"
                type="text"
                id="SuperUser_Address"
                style={{ width: "94%" }}
              />
            </Grid>
            <Grid
              item
              md={5.5}
              sm={10}
              xs={12}
              mt={2}
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space between"}
              flexWrap={"wrap"}
            >
              <ReusableDropDown4
                required
                label={"Designation*"}
                data={des}
                ObjectKey={["Designation"]}
                uniquekey={"Did"}
                onChange={handleInput}
                Field={formData["Did"]}
              />
            </Grid>
            <Grid
              item
              lg={5.8}
              md={5.8}
              sm={10}
              xs={12}
              mt={2}
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space between"}
              flexWrap={"wrap"}
            >
              <ReusableDropDown4
                required
                label={"Branch*"}
                data={branch}
                ObjectKey={["BranchName"]}
                uniquekey={"BranchId"}
                Field={formData["BranchId"]}
                onChange={handleInput}
              />
            </Grid>
            <Grid item lg={5.5} md={5.5} sm={12} xs={12} mt={2}>
              <ReusableDropDown3
                label={"Applicant's Id Proof Type*"}
                data={[
                  { IdProoftype: "Aadhaar Card" },
                  { IdProoftype: "Voter Card" },
                  { IdProoftype: "Passport" },
                  { IdProoftype: "Driving Licence" },
                  //{ IDProofType: "Pan Card" },
                ]}
                ObjectKey={["IdProoftype"]}
                uniquekey={"IdProoftype"}
                setState={setFormData}
                state={formData}
                handleChange={ManageIdProofNumberDD}
              />
            </Grid>
            <Grid item lg={5.5} md={5.5} sm={12} xs={12} mt={2}>
              <TextField
                value={formData?.IdProofNumber || ""}
                size="small"
                fullWidth
                required
                label="IdProofNumber"
                name="IdProofNumber"
                type="text"
                id="IdProofNumber"
                inputProps={{
                  maxLength: getMaxLengthForIDProof(formData?.IdProoftype),
                }}
                error={!input?.IdProofNumber}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res1 = IdProofValidation(e.target.value);
                    setInput({ ...input, ["IdProofNumber"]: res1 });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["IdProofNumber"]: true });
                  }
                }}
                sx={{ mt: 1 }}
              />
              {!input?.IdProofNumber ? (
                <FormHelperText error>
                  Enter Correct IdProof Number
                </FormHelperText>
              ) : null}
            </Grid>

            <Grid item lg={3.5} md={3.5} sm={12} xs={12} mt={2}>
              <label>
                Upload Photo*
                <br />
                <input
                  required
                  style={{
                    width: "90%",
                    padding: "5px",
                    borderBottom: "1px solid grey",
                  }}
                  onChange={HandleChangePic}
                  name="Photo"
                  label="Upload Photo*"
                  type="file"
                  id="SuperUser_pic"
                  ref={PhotoRef}
                />{" "}
              </label>
            </Grid>
            <Grid item lg={3.5} md={3.5} sm={12} xs={12} mt={2}>
              <label>
                Id Proof Photo*
                <br />
                <input
                  required
                  style={{
                    width: "90%",
                    padding: "5px",
                    borderBottom: "1px solid grey",
                  }}
                  onChange={HandleChangePic}
                  name="IdProofPic"
                  label="Upload Photo*"
                  type="file"
                  id="IdProofPic"
                  ref={IdProofPicRef}
                />{" "}
              </label>
            </Grid>
            <Grid item lg={3.5} md={3.5} sm={12} xs={12} mt={2}>
              <label>
                Photo of Signature*
                <br />
                <input
                  required
                  onChange={HandleChangePic}
                  name="Signature"
                  label="Upload Photo*"
                  type="file"
                  id="Signature"
                  ref={SignatureRef}
                  style={{
                    width: "90%",
                    padding: "5px",
                    borderBottom: "1px solid grey",
                  }}
                />
              </label>
            </Grid>
            <Grid
              item
              lg={12}
              md={12}
              sm={12}
              xs={12}
              mt={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                ml: 2,
              }}
            >
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      value={formData?.SUtype == 1 ? null : 1}
                      color="primary"
                      checked={formData?.SUtype == 1 ? true : false}
                      name="SUtype"
                    />
                  }
                  label="Admin"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      value={formData?.SUtype == 2 ? null : 2}
                      color="primary"
                      checked={formData?.SUtype == 2 ? true : false}
                      name="SUtype"
                    />
                  }
                  label="Backoffice User"
                />
              </div>
            </Grid>
            <Grid
              item
              sm={12}
              md={12}
              xs={12}
              lg={12}
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"center"}
              flexWrap={"wrap"}
            >
              <OnOffButton
                yes={"Submit"}
                no={"Reset"}
                theme1={"success"}
                theme2={"error"}
                type1={"submit"}
                type2={"reset"}
                disabled1={
                  formData?.Signature &&
                  formData?.Address &&
                  formData?.EmailId &&
                  formData?.IdProofPic &&
                  formData?.Sex &&
                  formData?.Photo &&
                  formData?.IdProofNumber &&
                  formData?.IdProoftype &&
                  formData?.PhoneNumber &&
                  formData?.BranchId &&
                  formData?.Did &&
                  formData?.Name &&
                  formData?.SUtype &&
                  pic?.IdProofPic &&
                  pic?.Photo &&
                  pic?.Signature &&
                  input?.Name == true &&
                  input?.phn == true &&
                  input?.Email == true &&
                  input?.IdProofNumber == true
                    ? false
                    : true
                }
                functrigger1={OnSubmitForm}
                functrigger2={ResetAll}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
