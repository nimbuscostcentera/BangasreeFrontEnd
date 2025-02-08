import  { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import {
  TextField,
  Typography,
  FormHelperText,
  Divider,
  Box,
  Button,
  Modal,
  FormControlLabel,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import Grid from "@mui/system/Unstable_Grid/Grid";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PictureInspection2 from "../../Components/Global/PictureInspection2";
import OnOffButton from "../../Components/Global/OnOffButton";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import ReusableDropDown3 from "../../Components/Global/ReusableDropDown3";
import StyledBox from "../../Components/styledComponent/StyledBox";
import Loader from "../../Components/Global/loader";

import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
  SuperUserEditfunc,
  ClearState41,
} from "../../Slice/BackofficeUser/SuperUserEditSlice";

import AlphabetOnly from "../../Apps/GlobalFunctions/AlphabetOnly";
import EmailValidation from "../../Apps/GlobalFunctions/EmailValidation";
import AdhaarValidation from "../../Apps/GlobalFunctions/AdhaarValidation";
import VoterCardValidation from "../../Apps/GlobalFunctions/VoterCardValidation";
import PassportValidation from "../../Apps/GlobalFunctions/PassportValidation";
import DrivingLicenceValidation from "../../Apps/GlobalFunctions/DrivingLicenceValidation";

import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchDesignation from "../../Apps/CustomHook/useFetchDesignation";
import useFetchBranch from "../../Apps/CustomHook/useFetchBranch";
import useFetchSuperUser from "../../Apps/CustomHook/useFetchSuperUser";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const CustomTheme = createTheme({
  breakpoints: {
    keys: ["xxs", "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"],
    values: {
      xxs: 100,
      xs: 200,
      sm: 400,
      mid: 550,
      md: 695,
      lg: 1000,
      xl: 1110,
      xxl: 1210,
      xxxl: 1345,
      Big: 1500,
    },
  },
});

function InspectSuperUser() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { SuperUserID } = location.state;
  const [Edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [check, setCheck] = useState(true);
  const [EditPic, setEditPic] = useState({
    Photo: null,
    IdPhoto: null,
    Signature: null,
  });
  const [input, setInput] = useState({
    Name: true,
    Email: true,
    Designation: true,
    Password: true,
    IDProofNumber: true,
  });
  const [EditData, setEditData] = useState({
    Name: null,
    EmailId: null,
    Did: null,
    IDProofType: null,
    IDProofNumber: null,
    Status: null,
    BranchId: null,
    Sex: null,
    SUtype: null,
  });

  const handleClose = () => {
    setOpen(false);
  };

  //SuperUserEdit Edit
  const { isloading41, Resp41, error41, isError41, isSuccess41 } = useSelector(
    (state) => state.SuperUserEdit
  );

  //Login List for Table
  const { global } = UseFetchLogger();
  //branch list
  const { branch } = useFetchBranch({ Status: 1 }, [], "");
  //Designation
  const { des } = useFetchDesignation();
  //super user details
  const { buList } = useFetchSuperUser(
    { SuperUserID: SuperUserID, BranchCode: global?.LoggerBranchId },
    [SuperUserID, isSuccess41],
    ""
  );

  let [data, setData] = useState({
    Name: null,
    PhoneNumber: null,
    EmailId: null,
    DID: null,
    IDProofType: null,
    IDProofNumber: null,
    Status: null,
    BranchId: null,
    Sex: null,
    SuperUserType: null,
    Photo: null,
    IdPhoto: null,
    Signature: null,
  });
  //buList[0];
  useEffect(() => {
    if (buList?.length !== 0 && buList[0]?.SuperUserID == SuperUserID) {
      setData(buList[0]);
      //console.log(buList[0], "check1");
    } else if (buList?.length == 0 || buList[0]?.SuperUserID !== SuperUserID) {
      let timeout = setTimeout(() => {
        setData({
          Name: null,
          PhoneNumber: null,
          EmailId: null,
          DID: null,
          IDProofType: null,
          IDProofNumber: null,
          Status: null,
          BranchId: null,
          Sex: null,
          SUtype: null,
        });
        navigate("/superuser/SuperUsermanagement");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [buList, isSuccess41, navigate, SuperUserID]);

  let datetime = moment().format("DD/MM/YYYY HH:mm:SS");

  const SuperUserPhotos = [
    {
      field: "Photo",
      Label: "SuperUser's Photo",
      type: "image",
      id: 1,
      url: "Superuser/ProfilePhoto",
    },
    {
      field: "IdPhoto",
      Label: "Photo of IdProof",
      type: "image",
      id: 2,
      url: "Superuser/IdProof",
    },
    {
      field: "Signature",
      Label: "Photo of Signature",
      type: "image",
      id: 3,
      url: "Superuser/Signature",
    },
  ];
  //Result of superuser Edit data by Id
  useEffect(() => {
    if (isSuccess41 && !isloading41) {
      toast.success(`${Resp41}`, { positions: toast.POSITION.TOP_RIGHT });
      setEdit(false);
      setCheck(true);
      setEditData({
        Name: null,
        EmailId: null,
        Did: null,
        IDProofType: null,
        IDProofNumber: null,
        Status: null,
        BranchId: null,
        Sex: null,
        SUtype: null,
      });
      setEditPic({ Photo: null, IdPhoto: null, Signature: null });
    }
    if (isError41 && !isloading41) {
      toast.error(`${error41}`, { positions: toast.POSITION.TOP_RIGHT });
    }
    dispatch(ClearState41());
  }, [isError41, isSuccess41]);

  const handleInput = (event) => {
    var key = event?.target?.name;
    var value = event?.target?.value;
    console.log(value, key, "check");
    setEditData({ ...EditData, [key]: value });
    setCheck(false);
  };

  const OnsubmitHandler = (e) => {
    e.preventDefault();
    var finalobj = Object.keys(EditData).reduce((acc, key) => {
      if (
        EditData[key] !== "" &&
        EditData[key] !== null &&
        EditData[key] !== undefined
      ) {
        if (key == "Status" && EditData[key] == 2) {
          acc[key] = 0;
        } else {
          acc[key] = EditData[key];
        }
      }
      return acc;
    }, {});

    var a = { ...finalobj, ...global, UUid: data?.UUid };
    console.log(a);
    dispatch(SuperUserEditfunc(a));
  };

  const IdProofValidation = (a) => {
    var b = false;
    if (EditData?.IDProofType == "Aadhaar Card") {
      b = AdhaarValidation(a);
    } else if (EditData?.IDProofType == "Voter Card") {
      b = VoterCardValidation(a);
    } else if (EditData?.IDProofType == "Passport") {
      b = PassportValidation(a);
    } else if (EditData?.IDProofType == "Driving Licence") {
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
    if (EditData?.IDProofType !== value) {
      setEditData({ ...EditData, IDProofNumber: null, IDProofType: value });
      setInput({ ...input, IDProofNumber: true });
    } else {
      setEditData({ ...EditData, IDProofType: value });
    }
    setCheck(false);
  };

  //permission List data Fetch
  let storedData = localStorage.getItem("loggerPermission");
  if (storedData && storedData.length !== 0) {
    let parray = JSON.parse(storedData);
    var myPermission =
      parray && parray.filter((i) => i?.PageName == "Manage Backoffice")[0];
  }

  useEffect(() => {
    if (isloading41 || data?.Name == null) {
      setOpen(true);
    } else {
      setOpen(false);
      setEditData({
        Name: data?.Name,
        EmailId: data?.EmailId,
        Did: data?.DID,
        IDProofType: data?.IDProofType,
        IDProofNumber: data?.IDProofNumber,
        Status: data?.Status,
        BranchId: data?.BranchId,
        Sex: data?.Sex,
      });
    }
  }, [isloading41, data]);
  // console.log(EditData?.Sex == "Male", "malee", EditData?.Sex);
  const onChangeHandlePic = (e) => {
    let key = e.target.name;
    let file = e.target.files[0];
    setEditPic({ ...EditPic, [key]: file });
  };
  const onSubmitPic = (e) => {
    e.preventDefault();
    const final = Object.keys(EditPic).reduce((acc, key) => {
      if (
        EditPic[key] !== "" &&
        EditPic[key] !== null &&
        EditPic[key] !== undefined
      ) {
        acc[key] = EditPic[key];
      }
      return acc;
    }, {});
    dispatch(
      SuperUserEditfunc({
        ...final,
        ...global,
        ...EditData,
      })
    );
  };
  return (
    <ThemeProvider theme={CustomTheme}>
      <Grid container ml={3} mt={2} maxWidth={"xl"}>
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
          sm={12}
          xs={12}
          md={12}
          lg={12}
          display={"flex"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
        >
          <Box mr={3} mt={1}>
            <ReusableBreadcrumbs
              props={[
                {
                  title: "Home",
                  link: global.Utype == 1 ? "/executive" : "/agent",
                  icon: "home",
                },
                {
                  title: "Manage SuperUser Details",
                  link: myPermission?.ViewPage
                    ? "/superuser/SuperUsermanagement"
                    : "#",
                  icon: "manage_accounts",
                },
                {
                  title: "Edit SuperUser",
                  link: "#",
                  icon: "edit_square",
                },
              ]}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} justifyContent={"center"}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
          >
            <Typography
              variant="h5"
              sx={{ color: "#000000", width: "contained", mt: 1.5 }}
            >
              SuperUser Details
            </Typography>
            {myPermission?.Edit == 1 ? (
              <IconOnOffButton
                icon1={Edit ? <VisibilityIcon /> : <EditIcon />}
                h1={
                  Edit ? (
                    <Typography>Edit Mode :</Typography>
                  ) : (
                    <Typography>View Mode:</Typography>
                  )
                }
                Tooltip1={Edit ? "View" : "Edit"}
                state={Edit}
                setState={setEdit}
                funcTrigger1={() => {
                  if (Edit) {
                    setEditData({
                      Name: data?.Name,
                      EmailId: data?.EmailId,
                      Did: data?.DID,
                      IDProofType: data?.IDProofType,
                      IDProofNumber: data?.IDProofNumber,
                      Status: data?.Status,
                      BranchId: data?.BranchId,
                      Sex: data?.Sex,
                      SUtype: data?.SuperUserType,
                    });
                    setEdit(!Edit);
                    setCheck(true);
                  } else {
                    setEditData({
                      Name: data?.Name,
                      EmailId: data?.EmailId,
                      Did: data?.DID,
                      IDProofType: data?.IDProofType,
                      IDProofNumber: data?.IDProofNumber,
                      Status: data?.Status,
                      BranchId: data?.BranchId,
                      Sex: data?.Sex,
                    });
                    setEditPic({
                      Photo: null,
                      IdPhoto: null,
                      Signature: null,
                    });
                    setEdit(!Edit);
                    setCheck(true);
                  }
                }}
              />
            ) : null}
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          {" "}
          <Divider />
          <StyledBox
            component={"form"}
            // method="POST"
            encType="multipart/form-data"
            // onChange={handleInput}
            onSubmit={OnsubmitHandler}
            color={"black"}
            width={"100%"}
            px={1}
          >
            <Grid container columnGap={3} maxWidth={"Big"}>
              <Grid item lg={5.5} md={5.5} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={EditData?.Name || ""}
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                  required
                  label={"Name"}
                  name="Name"
                  type="text"
                  id="Agent_Name"
                  inputProps={{ maxLength: 50 }}
                  error={!input?.Name}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["Name"]: true });
                    } else {
                      var res = AlphabetOnly(e.target.value);
                      setInput({ ...input, ["Name"]: res });
                    }
                    handleInput(e);
                  }}
                />
                {!input?.Name ? (
                  <FormHelperText error>
                    Name must not contain space at first place, number or
                    special character
                  </FormHelperText>
                ) : null}
              </Grid>
              {/**readonly*/}
              <Grid item lg={5.5} md={5.5} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={data?.PhoneNumber}
                  fullWidth
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  name="PhoneNumber"
                  label={"Phone Number*"}
                  type="tel"
                  id="Agent_phn"
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid item lg={5.5} md={5.5} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={EditData?.EmailId || ""}
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                  name="EmailId"
                  label={"Email Id"}
                  type="email"
                  id="Email_Id"
                  inputProps={{ maxLength: 50 }}
                  error={!input?.Email}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["Email"]: true });
                    } else {
                      var res = EmailValidation(e.target.value);
                      setInput({ ...input, ["Email"]: res });
                    }
                    handleInput(e);
                  }}
                />
                {!input?.Email ? (
                  <FormHelperText error>Enter a valid Email ID</FormHelperText>
                ) : null}
              </Grid>{" "}
              <Grid item lg={5.5} md={5.5} xs={12} sm={12}>
                {Edit ? (
                  <FormControl>
                    <FormLabel
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        pt: 1,
                        mt: 1,
                        pl: 2,
                      }}
                    >
                      <Typography sx={{ mt: 1, mr: 2 }}> Gender* </Typography>
                      <RadioGroup
                        required
                        disabled={!Edit}
                        InputLabelProps={{ shrink: true }}
                        row
                        value={EditData?.Sex}
                        aria-labelledby="demo-row-radio-buttons-group-label"
                      >
                        <FormControlLabel
                          value="Female"
                          control={
                            <Radio
                              value="Female"
                              disabled={!Edit}
                              InputLabelProps={{ shrink: true }}
                              name="Sex"
                              inputProps={{ "aria-label": "Female" }}
                              checked={EditData?.Sex == "Female" ? true : false}
                              onChange={handleInput}
                            />
                          }
                          label="Female"
                        />
                        {}
                        <FormControlLabel
                          control={
                            <Radio
                              value="Male"
                              disabled={!Edit}
                              checked={EditData?.Sex == "Male" ? true : false}
                              InputLabelProps={{ shrink: true }}
                              name="Sex"
                              inputProps={{ "aria-label": "Male" }}
                              onChange={handleInput}
                            />
                          }
                          label="Male"
                        />
                      </RadioGroup>
                    </FormLabel>
                  </FormControl>
                ) : (
                  <TextField
                    size="small"
                    value={data?.Sex}
                    disabled={true}
                    label="Gender*"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                    name="Sex"
                    type="text"
                    id="lead_Sex"
                    inputProps={{ maxLength: 30 }}
                    sx={{ mt: 3 }}
                  />
                )}
              </Grid>
              {Edit ? (
                <>
                  <Grid item lg={2.7} md={5.5} sm={12} xs={12} mt={2}>
                    <ReusableDropDown4
                      label={"Designation*"}
                      data={des}
                      id={"areal_did"}
                      disabled={!Edit}
                      ObjectKey={["Designation"]}
                      Field={EditData?.Did}
                      uniquekey={"Did"}
                      onChange={handleInput}
                    />
                  </Grid>
                  <Grid item lg={2.5} md={5.5} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      value={data?.Designation}
                      fullWidth
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      name="Designation"
                      label={"Previous Designation*"}
                      type="text"
                      id="Designation"
                      inputProps={{ maxLength: 50 }}
                      error={!input?.Designation}
                      onChange={handleInput}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item lg={5.5} md={5.5} sm={12} xs={12} mt={1}>
                  <TextField
                    size="small"
                    value={data?.Designation}
                    disabled={!Edit}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                    name="Designation"
                    label={"Designation*"}
                    type="text"
                    id="Designation"
                    inputProps={{ maxLength: 50 }}
                    error={!input?.Designation}
                  />
                </Grid>
              )}
              {Edit ? (
                <>
                  <Grid item lg={2.7} md={5.5} sm={12} xs={12} mt={2}>
                    <ReusableDropDown4
                      label={"SuperUser Type*"}
                      data={[
                        { SUtype: 1, value: "Admin" },
                        { SUtype: 2, value: "Backoffice User" },
                      ]}
                      id={"SUtype"}
                      disabled={!Edit}
                      ObjectKey={["value"]}
                      Field={EditData?.SUtype}
                      uniquekey={"SUtype"}
                      onChange={handleInput}
                    />
                  </Grid>
                  <Grid item lg={2.5} md={5.5} sm={12} xs={12} mt={1}>
                    <TextField
                      fullWidth
                      size="small"
                      value={
                        data?.SuperUserType === 1
                          ? "Admin"
                          : data?.SuperUserType === 2
                          ? "BackOffice User"
                          : null
                      }
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      name="SUtype"
                      label={"Super User Type*"}
                      type="text"
                      id="SUtype"
                      inputProps={{ maxLength: 50 }}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item lg={5.5} md={5.5} sm={12} xs={12} mt={1}>
                  <TextField
                    size="small"
                    fullWidth
                    value={
                      data?.SuperUserType == 1
                        ? "Admin"
                        : data?.SuperUserType == 2
                        ? "BackOffice User"
                        : null
                    }
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    name="SUtype"
                    label={"Super User Type*"}
                    type="text"
                    id="SUtype"
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
              )}
              {Edit ? (
                <>
                  {" "}
                  <Grid item lg={2.7} md={5.5} sm={12} xs={12} mt={2}>
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
                      setState={setEditData}
                      state={EditData}
                      handleChange={ManageIdProofNumberDD}
                    />
                  </Grid>
                  <Grid item lg={2.5} md={5.5} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      fullWidth
                      value={data?.IDProofType}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      required
                      name="IDProofType"
                      type="text"
                      id="IDProofType"
                      label="Previous IDProof Type"
                      sx={{ mt: 2 }}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item lg={5.5} md={5.5} sm={12} xs={12} mt={2}>
                  <TextField
                    size="small"
                    value={data?.IDProofType}
                    fullWidth
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    required
                    name="IDProofType"
                    type="text"
                    id="IDProofType"
                    label="IDProof Type*"
                    inputProps={{ maxLength: 11 }}
                  />
                </Grid>
              )}
              {Edit ? (
                <>
                  <Grid item lg={2.7} md={5.5} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      fullWidth
                      value={EditData?.IDProofNumber || ""}
                      disabled={!Edit}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      required
                      name="IDProofNumber"
                      type="text"
                      id="IDProofNumber"
                      label={"ID Proof Number"}
                      inputProps={{
                        maxLength: getMaxLengthForIDProof(
                          EditData?.IDProofType
                        ),
                      }}
                      error={!input?.IDProofNumber}
                      onChange={(e) => {
                        if (e.target.value == "") {
                          var res = IdProofValidation(e.target.value);
                          setInput({ ...input, ["IDProofNumber"]: res });
                        } else {
                          setInput({ ...input, ["IDProofNumber"]: true });
                        }
                        handleInput(e);
                      }}
                      sx={{ mr: 2 }}
                    />
                    {!input?.IDProofNumber ? (
                      <FormHelperText error sx={{ height: 2, mb: 1.5 }}>
                        Enter Correct IdProof Number
                      </FormHelperText>
                    ) : null}
                  </Grid>
                  <Grid item lg={2.5} md={5.5} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      fullWidth
                      value={data?.IDProofNumber}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      type="text"
                      id="IDProofNumber"
                      label={"IDProof Number*"}
                      inputProps={{ maxLength: 20 }}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item lg={5.5} md={5.5} sm={12} xs={12} mt={2}>
                  <TextField
                    size="small"
                    fullWidth
                    value={data?.IDProofNumber}
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    type="text"
                    id="IDProofNumber"
                    label={"IDProof Number*"}
                    inputProps={{ maxLength: 20 }}
                  />
                </Grid>
              )}
              {Edit ? (
                <>
                  <Grid item lg={2.7} md={5.5} sm={12} xs={12} mt={2}>
                    <ReusableDropDown4
                      label={"Status*"}
                      data={[
                        {
                          Status: 1,
                          value: "Active",
                        },
                        {
                          Status: 2,
                          value: "Inctive",
                        },
                      ]}
                      id={"arial_status"}
                      disabled={!Edit}
                      ObjectKey={["value"]}
                      uniquekey={"Status"}
                      Field={EditData?.Status}
                      deselectvalue={false}
                      onChange={handleInput}
                    />
                  </Grid>
                  <Grid item lg={2.5} md={5.5} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      value={
                        data?.Status === 1
                          ? "Active"
                          : data?.Status === 0
                          ? "Inactive"
                          : "Pending"
                      }
                      disabled={true}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      type="text"
                      label=" Previous Status*"
                      inputProps={{ maxLength: 11 }}
                      sx={{ mt: 2 }}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item lg={5.5} md={5.5} sm={12} xs={12} mt={2}>
                  <TextField
                    size="small"
                    value={
                      data?.Status === 1
                        ? "Active"
                        : data?.Status === 0
                        ? "Inactive"
                        : "Pending"
                    }
                    fullWidth
                    disabled={!Edit}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    required
                    type="text"
                    label="Status*"
                    inputProps={{ maxLength: 11 }}
                  />
                </Grid>
              )}
              {Edit ? (
                <>
                  <Grid item lg={2.7} md={5.5} sm={12} xs={12} mt={2}>
                    <ReusableDropDown4
                      label={"Branch Code*"}
                      data={branch}
                      id={"arial_br"}
                      disabled={!Edit}
                      ObjectKey={["BranchCode"]}
                      Field={EditData?.BranchId}
                      uniquekey={"BranchId"}
                      deselectvalue={false}
                      onChange={handleInput}
                    />{" "}
                  </Grid>
                  <Grid item lg={2.5} md={5.5} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      fullWidth
                      value={data?.BranchCode}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      name="BranchCode"
                      type="text"
                      id="BranchCode"
                      label="Previous Branch*"
                      inputProps={{ maxLength: 11 }}
                      sx={{ mt: 2 }}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item lg={5.5} md={5.5} sm={12} xs={12} mt={2}>
                  <TextField
                    size="small"
                    value={data?.BranchCode}
                    fullWidth
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    required
                    name="BranchCode"
                    type="text"
                    id="BranchCode"
                    label="Branch Code*"
                    inputProps={{ maxLength: 11 }}
                  />
                </Grid>
              )}
              {Edit ? (
                <Grid
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  ml={-3}
                  justifyContent={"center"}
                  my={3}
                >
                  {console.log(
                    !Edit,
                    check,
                    !(
                      input?.Name == true &&
                      input?.Email == true &&
                      input?.IDProofNumber == true &&
                      input?.IDProofNumber == true
                    ),
                    !(
                      EditData?.Name !== "" &&
                      EditData?.Status !== "" &&
                      EditData?.EmailId !== "" &&
                      EditData?.Did !== "" &&
                      EditData?.Status !== "" &&
                      EditData?.Sex !== "" &&
                      EditData?.SUtype !== "" &&
                      EditData?.BranchId !== "" &&
                      EditData?.IDProofNumber !== "" &&
                      EditData?.IDProofNumber !== null &&
                      EditData?.IDProofType !== ""
                    ),
                    EditData?.IDProofNumber
                  )}
                  <OnOffButton
                    yes={"Update"}
                    type1={"submit"}
                    disabled1={
                      !Edit ||
                      check ||
                      !(
                        input?.Name == true &&
                        input?.Email == true &&
                        input?.IDProofNumber == true
                      ) ||
                      !(
                        EditData?.Name !== "" &&
                        EditData?.Status !== "" &&
                        EditData?.EmailId !== "" &&
                        EditData?.Did !== "" &&
                        EditData?.Status !== "" &&
                        EditData?.Sex !== "" &&
                        EditData?.SUtype !== "" &&
                        EditData?.BranchId !== "" &&
                        EditData?.IDProofNumber !== "" &&
                        EditData?.IDProofNumber !== null &&
                        EditData?.IDProofType !== ""
                      )
                    }
                    theme1={"info"}
                    functrigger1={OnsubmitHandler}
                  />
                </Grid>
              ) : null}
            </Grid>
          </StyledBox>
        </Grid>
        <Divider /> <br />
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} color={"#000000"}>
          <Box
            component={"form"}
            method="POST"
            encType="multipart/form-data"
            onSubmit={(e) => {
              e.preventDefault();
              let picobj = Object.keys(EditPic).reduce((acc, key) => {
                if (
                  EditPic[key] !== "" &&
                  EditPic[key] !== undefined &&
                  EditPic[key] !== null
                ) {
                  acc[key] = EditPic[key];
                }
                return acc;
              }, {});
              var a = {
                ...picobj,
                ...global,
                PhoneNumber: data?.PhoneNumber,
                UUid: data?.UUid,
              };
              console.log(a);
              dispatch(SuperUserEditfunc(a));
            }}
          >
            {" "}
            <Divider mt={3} />
            <PictureInspection2
              data={data}
              Image={SuperUserPhotos}
              label={"SuperUser's Photo ID Proof"}
              Edit={Edit}
              reload={datetime}
              HandleChange={onChangeHandlePic}
            />
            <br />
            {Edit ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: 0.5,
                }}
              >
                <Button
                  variant="outlined"
                  color="success"
                  type="submit"
                  onChange={onSubmitPic}
                  disabled={
                    EditPic?.IdPhoto == "" &&
                    EditPic?.Photo == "" &&
                    EditPic?.Signature == ""
                      ? true
                      : false
                  }
                >
                  Submit
                </Button>
              </Box>
            ) : null}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default InspectSuperUser;
