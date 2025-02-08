import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import {
  TextField,
  Typography,
  FormHelperText,
  Divider,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  InputAdornment,
  Modal,
} from "@mui/material";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import Grid from "@mui/system/Unstable_Grid/Grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ReusableDataTable from "../../Components/Global/ReusableTable";
import OnOffButton from "../../Components/Global/OnOffButton";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";
import PictureInspection2 from "../../Components/Global/PictureInspection2";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import ReusableDropDown3 from "../../Components/Global/ReusableDropDown3";
import BiSepBox from "../../Components/styledComponent/BiSepBox";
import CenterBox from "../../Components/styledComponent/CenterBox";
import Loader from "../../Components/Global/loader";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { AgentEdit, ClearState12 } from "../../Slice/Agent/AgentEditSlice";

import PassportValidation from "../../Apps/GlobalFunctions/PassportValidation";
import DrivingLicenceValidation from "../../Apps/GlobalFunctions/DrivingLicenceValidation";
import AdhaarValidation from "../../Apps/GlobalFunctions/AdhaarValidation";
import VoterCardValidation from "../../Apps/GlobalFunctions/VoterCardValidation";

import AlphabetOnly from "../../Apps/GlobalFunctions/AlphabetOnly";
import NumberOnly from "../../Apps/GlobalFunctions/NumberOnly";
import EmailValidation from "../../Apps/GlobalFunctions/EmailValidation";
import IFSCvalidation from "../../Apps/GlobalFunctions/IFSCValidation";
import BankAccNovalidation from "../../Apps/GlobalFunctions/BankAccNoValidate";
import MaxMinDate from "../../Apps/GlobalFunctions/MaxMinDate";

import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchBranch from "../../Apps/CustomHook/useFetchBranch";
import useFetchAgentByID from "../../Apps/CustomHook/useFetchAgentByID";
import useFetchCustPayList from "../../Apps/CustomHook/useFetchCustPayList";
import useFetchArea from "../../Apps/CustomHook/useFetchArea";

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

function InspectEditAgentData() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { AgentID } = location.state;
  const [Edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [check, setCheck] = useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  //const [PaymentDetails, setPaymentDetails] = useState([]);
  const [EditData, setEditData] = useState({
    Name: null,
    Phonenumber: null,
    EmailId: null,
    Dob: null,
    Sex: null,
    Status: null,
    AreaID: null,
    Address: null,
    Geolocation: null,
    BranchId: null,
    BankName: null,
    AccountType: null,
    AccountNumber: null,
    IFSCCode: null,
    MICR: null,
    NomineeName: null,
    Relation: null,
    IDProofType: null,
    IDProofNumber: null,
    Commision: 0,
  });
  const [EditPic, setEditPic] = useState({
    Photo: null,
    IDProofPhoto: null,
    Signature: null,
  });
  const [input, setInput] = useState({
    Name: true,
    phn: true,
    Email: true,
    BankName: true,
    AccountNo: true,
    IFSC: true,
    MICR: true,
    NomineeName: true,
    Relation: true,
    IDProofNumber: true,
    Commision: true,
  });
  var datetime = moment().format("DD/MM/YYYY HH:mm:SS");
  //Agent Edit
  const { isloading12, Msg12, error12, isError12, isSuccess12 } = useSelector(
    (state) => state.AgentEdit
  );
  //Login List for Table
  const { userInfo, global } = UseFetchLogger();
  //branch
  const { branch } = useFetchBranch({ Status: 1 }, [], "");
  //area
  const { AreaList } = useFetchArea({ Status: 1 });
  //agent details by id
  let [data, setData] = useState({
    Name: null,
    Phonenumber: null,
    EmailId: null,
    DOB: null,
    Sex: null,
    Status: null,
    AreaID: null,
    areaname: null,
    Address: null,
    Geolocation: null,
    BranchId: null,
    branchcode: null,
    BankName: null,
    AccountType: null,
    AccountNumber: null,
    IFSCCode: null,
    MICR: null,
    NomineeName: null,
    Relation: null,
    IDProofType: null,
    IDProofNumber: null,
    Commision: 0,
  });
  //agentdetail
  const { AgentByIdDetail } = useFetchAgentByID(
    { ...global, AgentID: AgentID },
    [isSuccess12, AgentID],
    "AgentID"
  );
  //redirect
  useEffect(() => {
    if (AgentByIdDetail) {
      if (AgentID == AgentByIdDetail?.AgentID) {
        setData(AgentByIdDetail);
        setEditData({
          Name: AgentByIdDetail?.Name,
          EmailId: AgentByIdDetail?.EmailId,
          Dob: AgentByIdDetail?.DOB,
          Sex: AgentByIdDetail?.Sex,
          Status: AgentByIdDetail?.Status,
          Address: AgentByIdDetail?.Address,
          Geolocation: AgentByIdDetail?.Geolocation,
          BranchId: AgentByIdDetail?.BranchId,
          BankName: AgentByIdDetail?.BankName,
          AccountType: AgentByIdDetail?.AccountType,
          AccountNumber: AgentByIdDetail?.AccountNumber,
          IFSCCode: AgentByIdDetail?.IFSCCode,
          MICR: AgentByIdDetail?.MICR,
          NomineeName: AgentByIdDetail?.NomineeName,
          Relation: AgentByIdDetail?.Relation,
          IDProofType: AgentByIdDetail?.IDProofType,
          IDProofNumber: AgentByIdDetail?.IDProofNumber,
          Commision: AgentByIdDetail?.Commision,
        });
        setOpen(false);
      } else {
        let time = setTimeout(() => {
          setData({
            Name: null,
            Phonenumber: null,
            EmailId: null,
            DOB: null,
            Sex: null,
            Status: null,
            AreaID: null,
            areaname: null,
            Address: null,
            Geolocation: null,
            BranchId: null,
            BankName: null,
            AccountType: null,
            AccountNumber: null,
            IFSCCode: null,
            MICR: null,
            NomineeName: null,
            Relation: null,
            IDProofType: null,
            IDProofNumber: null,
            Commision: 0,
          });

          setOpen(false);
          navigate("/superuser/agentmanagement");
        }, 4000);
        return () => clearTimeout(time);
      }
    } else {
      setOpen(true);
    }
  }, [navigate, isSuccess12, AgentID, AgentByIdDetail, Edit]);
  //console.log(data?.areaname,AgentByIdDetail?.areaname);
  const { pay: PaymentDetails = [], isloading29 } = useFetchCustPayList(
    {
      AgentID: AgentID,
      AgentCode: data?.AgentCode,
      global,
    },
    [isSuccess12, AgentID, data?.AgentCode]
  );

  //Result of Agent Edit data by Id
  useEffect(() => {
    if (isSuccess12 && !isloading12) {
      toast.success(`${Msg12}`, { positions: toast.POSITION.TOP_RIGHT });
      setEdit(false);
      setCheck(true);
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
        IDProofNumber: true,
        Commision: true,
      });
      dispatch(ClearState12());
    }
    if (isError12 && !isloading12) {
      toast.error(`${error12}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState12());
    }
    if (isloading12) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isError12, isSuccess12, isloading12, AgentID]);

  const handleInput = (event) => {
    var key = event?.target?.name;
    console.log(key, event.target.value);
    var value = null;
    if (
      key == "Commision" &&
      (event?.target?.value >= 100 || event?.target?.value < 0)
    ) {
      value = 0;
    } else if (key == "Dob") {
      let now = new moment().add(-18, "years");

      let inputdate = new moment(event?.target?.value);

      let diffdays = now.diff(inputdate, "days");

      if (diffdays < 0) {
        value = "";
      } else {
        value = event?.target?.value;
      }
    } else {
       value = event?.target?.value;
    }
    setCheck(false);

    setEditData({ ...EditData, [key]: value });
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

    finalobj.UUid = data?.UUid;
    finalobj.AgentID = AgentID;
    finalobj.Utype = 2;
    finalobj.SuperUserID = userInfo?.details?.SuperUserID;

    var a = { ...finalobj, ...global, Phonenumber: data?.Phonenumber };
    // console.log(a);
    dispatch(AgentEdit(a));
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
  };
  //console.log(EditData, "EditAgent");
  var agentmindate = MaxMinDate(18);

  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Agent")[0];

  //columns
  const AgentPhotos = [
    {
      field: "Photo",
      Label: "Agent's Photo",
      type: "image",
      id: 1,
      url: "Agent/ProfilePhoto",
    },
    {
      field: "IDProofPhoto",
      Label: "Photo of IdProof",
      type: "image",
      id: 2,
      url: "Agent/IdProof",
    },
    {
      field: "Signature",
      Label: "Photo of Signature",
      type: "image",
      url: "Agent/Signature",
      id: 3,
    },
  ];
  const columns = [
    { field: "CustomerName", headerName: "Customer Name", width: 150 },
    { field: "AgentCode", headerName: "Agent Code", width: 150 },
    { field: "EMI", headerName: "EMI Amount", width: 100 },
    { field: "SchemeTitle", headerName: "SchemeTitle", width: 180 },
    { field: "CollDate", headerName: "Collection Date", width: 150 },
    { field: "totcolection", headerName: "Collected Amount", width: 150 },
    {
      field: "PaymentStatus",
      headerName: "Payment Status",
      width: 180,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.PaymentStatus === 1
              ? "Collected"
              : item?.row?.PaymentStatus === 2
              ? "Submitted"
              : item?.row?.PaymentStatus === 3
              ? "Approved"
              : item?.row?.PaymentStatus === 4
              ? "rejected"
              : ""}
          </>
        );
      },
    },
  ];
  useEffect(() => {
    if (isloading12 || !data || data?.AgentID != AgentID) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isloading12, data]);
  return (
    <ThemeProvider theme={CustomTheme}>
      <Grid container ml={3} mt={2} maxWidth={"xl"}>
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
        <ToastContainer autoClose={8000} />
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
                  title: "Manage Agent Details",
                  link:
                    myPermission?.ViewPage == 1
                      ? "/superuser/agentmanagement"
                      : "#",
                  icon: "manage_accounts",
                },
                {
                  title: "Edit Agent",
                  link: "#",
                  icon: "edit_square",
                },
              ]}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} mt={1}>
          <Divider />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} m={0} p={0}>
          <BiSepBox m={0} p={0}>
            {" "}
            <Typography variant="h6" my={0}>
              Agent Details : <i>{data?.AgentCode}</i>
            </Typography>
            {myPermission?.Edit == 1 ? (
              <IconOnOffButton
                icon1={Edit ? <VisibilityIcon /> : <EditIcon />}
                icon2={<ArrowBackIcon />}
                mt={0.5}
                mb={0.5}
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
                  if (Edit) {
                    setEditData({
                      Name: data?.Name,
                      EmailId: data?.EmailId,
                      Dob: data?.DOB,
                      Sex: data?.Sex,
                      Status: data?.Status,
                      Address: data?.Address,
                      Geolocation: data?.Geolocation,
                      BranchId: data?.BranchId,
                      BankName: data?.BankName,
                      AccountType: data?.AccountType,
                      AccountNumber: data?.AccountNumber,
                      IFSCCode: data?.IFSCCode,
                      MICR: data?.MICR,
                      NomineeName: data?.NomineeName,
                      Relation: data?.Relation,
                      IDProofType: data?.IDProofType,
                      IDProofNumber: data?.IDProofNumber,
                      Commision: data?.Commision,
                    });
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
                      IDProofNumber: true,
                      Commision: true,
                    });
                    setEdit(!Edit);
                    setCheck(true);
                  } else {
                    setEditData({
                      Name: data?.Name,
                      EmailId: data?.EmailId,
                      Dob: data?.DOB,
                      Sex: data?.Sex,
                      Status: data?.Status,
                      Address: data?.Address,
                      Geolocation: data?.Geolocation,
                      BranchId: data?.BranchId,
                      BankName: data?.BankName,
                      AccountType: data?.AccountType,
                      AccountNumber: data?.AccountNumber,
                      IFSCCode: data?.IFSCCode,
                      MICR: data?.MICR,
                      NomineeName: data?.NomineeName,
                      Relation: data?.Relation,
                      IDProofType: data?.IDProofType,
                      IDProofNumber: data?.IDProofNumber,
                      Commision: data?.Commision,
                    });
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
                      IDProofNumber: true,
                      Commision: true,
                    });
                    setEdit(!Edit);
                    setCheck(true);
                  }
                }}
                funcTrigger2={() => {
                  // uuid = null;
                  setEditData({
                    Name: null,
                    Phonenumber: null,
                    EmailId: null,
                    Dob: null,
                    Sex: null,
                    Status: null,
                    Address: null,
                    Geolocation: null,
                    BranchId: null,
                    BankName: null,
                    AccountType: null,
                    AccountNumber: null,
                    IFSCCode: null,
                    MICR: null,
                    NomineeName: null,
                    Relation: null,
                    IDProofType: null,
                    IDProofNumber: null,
                    Commision: null,
                  });
                  setEditPic({
                    Photo: null,
                    IDProofPhoto: null,
                    Signature: null,
                  });
                  navigate("/superuser/agentmanagement");
                }}
              />
            ) : null}
          </BiSepBox>
          <Divider sx={{ color: "black", mt: -1 }}>Personal Details</Divider>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box
            component={"form"}
            // onChange={handleInput}
            color={"black"}
            width={"100%"}
            m={0}
            p={0}
          >
            <Grid container columnGap={3} rowGap={1} maxWidth={"xxxl"}>
              <Grid item lg={5.7} md={5.7} xs={12} sm={12}>
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
                    Name is required field it must not be blank. It must not
                    contain space at first place, number or special character
                  </FormHelperText>
                ) : null}
              </Grid>
              <Grid item lg={5.7} md={5.7} xs={12} sm={12}>
                <TextField
                  size="small"
                  value={data?.Phonenumber}
                  fullWidth
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  required
                  name="Phonenumber"
                  label={"Mobile Number "}
                  type="tel"
                  id="Agent_phn"
                  error={!input?.phn}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid item lg={5.7} md={5.7} xs={12} sm={12}>
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
              </Grid>
              <Grid item lg={5.7} md={5.7} xs={12} sm={12}>
                <TextField
                  fullWidth
                  value={EditData?.Dob || ""}
                  disabled={!Edit}
                  size="small"
                  id="outlined-required"
                  InputLabelProps={{ shrink: true }}
                  type="Date"
                  name="Dob"
                  inputProps={{ max: agentmindate }}
                  required
                  label="Date Of Birth"
                  onChange={handleInput}
                  sx={{ mt: 2 }}
                />
              </Grid>
              <Grid item lg={5.7} md={5.7} xs={12} sm={12}>
                {Edit ? (
                  <FormControl>
                    <FormLabel
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        pt: 1.5,
                      }}
                    >
                      <Typography sx={{ mt: 1, mr: 2 }}> Gender* </Typography>
                      <RadioGroup
                        required
                        disabled={!Edit}
                        InputLabelProps={{ shrink: true }}
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="Sex"
                        value={EditData?.Sex}
                      >
                        <FormControlLabel
                          value="Female"
                          control={
                            <Radio
                              value="Female"
                              disabled={!Edit}
                              checked={EditData?.Sex == "Female" ? true : false}
                              InputLabelProps={{ shrink: true }}
                              name="Sex"
                              onChange={handleInput}
                              inputProps={{ "aria-label": "Female" }}
                            />
                          }
                          label="Female"
                        />
                        <FormControlLabel
                          control={
                            <Radio
                              value="Male"
                              disabled={!Edit}
                              checked={EditData?.Sex == "Male" ? true : false}
                              InputLabelProps={{ shrink: true }}
                              name="Sex"
                              onChange={handleInput}
                              inputProps={{ "aria-label": "Male" }}
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
                    label="Gender"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                    required
                    name="Sex"
                    type="text"
                    id="lead_Sex"
                    inputProps={{ maxLength: 30 }}
                  />
                )}
              </Grid>

              {Edit ? (
                <>
                  <Grid item lg={2.7} md={2.7} sm={12} xs={12} mt={2}>
                    <ReusableDropDown4
                      label={"Status*"}
                      data={[
                        { Status: 1, value: "Active" },
                        { Status: 2, value: "Inactive" },
                        { Status: 3, value: "Pending" },
                      ]}
                      id={"arial_st"}
                      disabled={!Edit}
                      Field={EditData?.Status}
                      ObjectKey={["value"]}
                      uniquekey={"Status"}
                      deselectvalue={false}
                      onChange={handleInput}
                    />
                  </Grid>
                  <Grid item lg={2.5} md={2.5} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      fullWidth
                      value={
                        !Edit
                          ? null
                          : data?.Status == 1
                          ? "Active"
                          : data?.Status == 0
                          ? "Inactive"
                          : "Pending"
                      }
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      required
                      name="Status"
                      type="text"
                      id="Status"
                      inputProps={{ maxLength: 30 }}
                      label={"Status"}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item lg={5.7} md={5.7} sm={12} xs={12}>
                  <TextField
                    size="small"
                    value={
                      data?.Status == 1
                        ? "Active"
                        : data?.Status == 0
                        ? "Inactive"
                        : "Pending"
                    }
                    disabled={!Edit}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                    required
                    name="Status"
                    type="text"
                    id="Status"
                    inputProps={{ maxLength: 30 }}
                    label={"Status"}
                  />
                </Grid>
              )}

              <Grid item md={12} lg={12} sm={12} xs={12}>
                <Divider>Address Details</Divider>
              </Grid>
              <Grid item lg={5.7} md={5.7} xs={12} sm={12}>
                <TextField
                  size="small"
                  value={EditData?.Address || ""}
                  fullWidth
                  margin="normal"
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  required
                  label="Address"
                  name="Address"
                  type="text"
                  id="Agent_Address"
                  multiline={true}
                  rows={4}
                  column={25}
                  onChange={handleInput}
                />
              </Grid>
              <Grid item lg={5.7} md={5.7} xs={12} sm={12}>
                <TextField
                  size="small"
                  value={EditData?.Geolocation || ""}
                  label="Geo Location"
                  fullWidth
                  margin="normal"
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  name="Geolocation"
                  type="text"
                  id="GeoLocation"
                  rows={4}
                  multiline={true}
                  onChange={handleInput}
                />
              </Grid>

              {Edit ? (
                <>
                  <Grid item lg={2.8} md={5.7} sm={12} xs={12} mt={1}>
                    <ReusableDropDown4
                      label={"Branch*"}
                      data={branch}
                      id={"arial_br"}
                      disabled={!Edit}
                      ObjectKey={["BranchName"]}
                      Field={EditData?.BranchId}
                      uniquekey={"BranchId"}
                      deselectvalue={false}
                      onChange={handleInput}
                    />
                  </Grid>
                  <Grid item lg={2.7} md={5.7} xs={12} sm={12}>
                    <TextField
                      size="small"
                      value={data?.branchcode}
                      disabled={true}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      required
                      name="BranchCode"
                      type="text"
                      id="BranchCode"
                      inputProps={{ maxLength: 30 }}
                      label="Branch"
                    />
                  </Grid>
                </>
              ) : (
                <Grid
                  item
                  lg={5.7}
                  md={5.7}
                  xs={12}
                  sm={12}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <TextField
                    size="small"
                    value={data?.branchcode}
                    disabled={true}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    required
                    name="BranchId"
                    type="text"
                    id="BranchId"
                    inputProps={{ maxLength: 30 }}
                    label="Branch"
                  />
                </Grid>
              )}

              {Edit ? (
                <>
                  <Grid item lg={2.8} md={5.7} sm={12} xs={12} mt={1}>
                    <ReusableDropDown4
                      label={"Area*"}
                      data={AreaList}
                      id={"arial_ar"}
                      disabled={!Edit}
                      ObjectKey={["AreaName"]}
                      Field={EditData?.AreaID}
                      uniquekey={"AreaID"}
                      deselectvalue={false}
                      onChange={handleInput}
                    />
                  </Grid>
                  <Grid item lg={2.6} md={5.7} xs={12} sm={12}>
                    <TextField
                      size="small"
                      value={data?.areaname}
                      disabled={true}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      type="text"
                      id="AreaName"
                      inputProps={{ maxLength: 30 }}
                      label="Area*"
                    />
                  </Grid>
                </>
              ) : (
                <Grid
                  item
                  lg={5.8}
                  md={5.7}
                  xs={12}
                  sm={12}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <TextField
                    size="small"
                    value={data?.areaname}
                    disabled={true}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    type="text"
                    id="AreaName"
                    inputProps={{ maxLength: 30 }}
                    label="Area*"
                  />
                </Grid>
              )}

              <Grid item md={12} lg={12} sm={12} xs={12}>
                <Divider>Bank Details</Divider>
              </Grid>
              <Grid item md={5.7} lg={5.7} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={EditData?.BankName || ""}
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                  required
                  name="BankName"
                  type="text"
                  id="Bank_Name"
                  inputProps={{ maxLength: 30 }}
                  error={!input?.BankName}
                  label={"Bank Name"}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["BankName"]: true });
                    } else {
                      var res = AlphabetOnly(e.target.value);
                      setInput({ ...input, ["BankName"]: res });
                    }
                    handleInput(e);
                  }}
                />
                {!input?.BankName ? (
                  <FormHelperText error>
                    Bank Name must not contain space at first place,Number or
                    special character.
                  </FormHelperText>
                ) : null}
              </Grid>

              {Edit ? (
                <>
                  <Grid item lg={2.7} md={2.6} sm={12} xs={12} mt={1}>
                    <ReusableDropDown4
                      label={"Account Type*"}
                      data={[
                        { AccountType: "Savings" },
                        { AccountType: "Current" },
                      ]}
                      id={"arial_act"}
                      disabled={!Edit}
                      ObjectKey={["AccountType"]}
                      Field={EditData?.AccountType}
                      uniquekey={"AccountType"}
                      deselectvalue={false}
                      onChange={handleInput}
                    />
                  </Grid>
                  <Grid item lg={2.6} md={2.5} sm={12} xs={12}>
                    <TextField
                      size="small"
                      value={data?.AccountType}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      fullWidth
                      name="AccountType"
                      type="text"
                      id="AccountType"
                      inputProps={{ maxLength: 14 }}
                      label={"Account Type*"}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item lg={5.7} md={5.7} sm={12} xs={12}>
                  <TextField
                    size="small"
                    value={data?.AccountType}
                    disabled={!Edit}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                    name="AccountType"
                    type="text"
                    id="AccountType"
                    inputProps={{ maxLength: 30 }}
                    label={"Account Type*"}
                  />
                </Grid>
              )}

              <Grid item md={5.7} lg={5.7} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={EditData?.AccountNumber || ""}
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                  required
                  name="AccountNumber"
                  label={"Account Number"}
                  type="text"
                  id="AccountNo"
                  inputProps={{ maxLength: 14 }}
                  error={!input?.AccountNo}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["AccountNo"]: true });
                    } else {
                      var res = BankAccNovalidation(e.target.value);
                      setInput({ ...input, ["AccountNo"]: res });
                    }
                    handleInput(e);
                  }}
                />
                {!input?.AccountNo ? (
                  <FormHelperText error>
                    Bank Account Number must contain numbers or alphabets in
                    upper case only.
                  </FormHelperText>
                ) : null}
              </Grid>
              <Grid item md={5.7} lg={5.7} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={EditData?.IFSCCode || ""}
                  fullWidth
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  required
                  name="IFSCCode"
                  type="text"
                  id="IFSCCode"
                  label={"IFSC Number"}
                  inputProps={{ maxLength: 11 }}
                  error={!input?.IFSC}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["IFSC"]: true });
                    } else {
                      var res = IFSCvalidation(e.target.value);
                      setInput({ ...input, ["IFSC"]: res });
                    }
                    handleInput(e);
                  }}
                />
                {!input?.IFSC ? (
                  <FormHelperText error>
                    IFSC Code must contain numbers or alphabets in upper case
                    only.
                  </FormHelperText>
                ) : null}
              </Grid>
              <Grid item md={5.7} lg={5.7} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={EditData?.MICR || ""}
                  fullWidth
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  name="MICR"
                  type="text"
                  id="MICR"
                  label={"MICR Number"}
                  inputProps={{ maxLength: 9 }}
                  error={!input?.MICR}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["MICR"]: true });
                    } else {
                      var res = NumberOnly(e.target.value);
                      setInput({ ...input, ["MICR"]: res });
                    }
                    handleInput(e);
                  }}
                />
                {!input?.MICR ? (
                  <FormHelperText error>
                    MICR Number must contain numbers only.
                  </FormHelperText>
                ) : null}
              </Grid>
              <Grid item md={5.7} lg={5.7} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={EditData?.Commision || ""}
                  fullWidth
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  name="Commision"
                  type="text"
                  id="Commission"
                  label={"Commission Percentage"}
                  inputProps={{ maxLength: 5 }}
                  error={!input?.Commision}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["Commision"]: true });
                    } else {
                      var res = NumberOnly(e.target.value);
                      setInput({ ...input, ["Commision"]: res });
                    }
                    handleInput(e);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
                <FormHelperText
                  error
                  sx={{ visibility: input?.Commision ? "hidden" : "initial" }}
                >
                  Commission must contain numbers Only.
                </FormHelperText>
              </Grid>
              <Grid item md={12} lg={12} sm={12} xs={12}>
                <Divider>Nominee Details</Divider>
              </Grid>
              <Grid item md={5.7} lg={5.7} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={EditData?.NomineeName || ""}
                  fullWidth
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  name="NomineeName"
                  type="text"
                  id="Nominee_Name"
                  inputProps={{ maxLength: 50 }}
                  error={!input?.NomineeName}
                  label={"NomineeName"}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["NomineeName"]: true });
                    } else {
                      var res = AlphabetOnly(e.target.value);
                      setInput({ ...input, ["NomineeName"]: res });
                    }
                    handleInput(e);
                  }}
                />
                {!input?.NomineeName ? (
                  <FormHelperText error>
                    Nominee Name must contain alphabet only.
                  </FormHelperText>
                ) : null}
              </Grid>
              <Grid item md={5.7} lg={5.7} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={EditData?.Relation || ""}
                  fullWidth
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  name="Relation"
                  type="text"
                  id="Relation"
                  inputProps={{ maxLength: 20 }}
                  error={!input?.Relation}
                  label={"Relation"}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["Relation"]: true });
                    } else {
                      var res = AlphabetOnly(e.target.value);
                      setInput({ ...input, ["Relation"]: res });
                    }
                    handleInput(e);
                  }}
                />
                {!input?.Relation ? (
                  <FormHelperText error>
                    Relation must contain alphabet only.
                  </FormHelperText>
                ) : null}
              </Grid>
              <Grid item md={12} lg={12} sm={12} xs={12}>
                <Divider>ID Proof Details</Divider>
              </Grid>

              {Edit ? (
                <>
                  <Grid item lg={2.8} md={5.7} sm={12} xs={12} mt={1}>
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
                  <Grid item lg={2.7} md={5.7} sm={12} xs={12}>
                    <TextField
                      size="small"
                      value={data?.IDProofType}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      name="IDProofType"
                      type="text"
                      id="IDProofType"
                      label="IDProof Type*"
                      inputProps={{ maxLength: 11 }}
                      fullWidth
                    />
                  </Grid>
                </>
              ) : (
                <Grid item md={5.7} lg={5.7} sm={12} xs={12}>
                  <TextField
                    size="small"
                    value={data?.IDProofType}
                    fullWidth
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    name="IDProofType"
                    type="text"
                    id="IDProofType"
                    label="IDProof Type*"
                    inputProps={{ maxLength: 11 }}
                  />{" "}
                </Grid>
              )}

              {Edit ? (
                <>
                  <Grid item lg={2.7} md={5.7} sm={12} xs={12}>
                    <TextField
                      value={EditData?.IDProofNumber || ""}
                      size="small"
                      fullWidth
                      margin="normal"
                      required
                      name="IDProofNumber"
                      label="IDProofNumber"
                      type="text"
                      id="IDProofNumber"
                      inputProps={{
                        maxLength: getMaxLengthForIDProof(
                          EditData?.IDProofType
                        ),
                      }}
                      error={!input?.IDProofNumber}
                      onChange={(e) => {
                        if (e.target.value == "") {
                          setInput({ ...input, ["IDProofNumber"]: true });
                        } else {
                          var res1 = IdProofValidation(e.target.value);
                          setInput({ ...input, ["IDProofNumber"]: res1 });
                        }
                        handleInput(e);
                      }}
                    />
                    <FormHelperText
                      error
                      sx={{
                        visibility: !input?.IDProofNumber
                          ? "visible"
                          : "hidden",
                      }}
                    >
                      Enter Correct IdProof Number
                    </FormHelperText>
                  </Grid>
                  <Grid item lg={2.7} md={5.7} sm={12} xs={12}>
                    <TextField
                      size="small"
                      value={data?.IDProofNumber}
                      disabled={true}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      name="IDProofNumber"
                      type="text"
                      id="IDProofNumber"
                      label={"ID Proof Number*"}
                      inputProps={{ maxLength: 20 }}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item lg={5.7} md={5.7} sm={12} xs={12}>
                  <TextField
                    size="small"
                    value={data?.IDProofNumber}
                    fullWidth
                    disabled={!Edit}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    name="IDProofNumber"
                    type="text"
                    id="IDProofNumber"
                    label={"ID Proof Number*"}
                    inputProps={{ maxLength: 20 }}
                  />
                </Grid>
              )}

              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                justifyContent={"center"}
              >
                {" "}
                {Edit ? (
                  <CenterBox mb={2}>
                    <OnOffButton
                      yes={"Update"}
                      type1={"Edit"}
                      theme1={"info"}
                      disabled1={
                        !Edit ||
                        check ||
                        !(
                          input?.AccountNo == true &&
                          input?.BankName == true &&
                          input?.Email == true &&
                          input?.IDProofNumber == true &&
                          input?.IFSC == true &&
                          input?.MICR == true &&
                          input?.Name == true &&
                          input?.NomineeName == true &&
                          input?.Relation == true &&
                          input?.phn == true &&
                          input?.Commision == true
                        ) ||
                        !(
                          EditData?.Name !== "" &&
                          EditData?.Phonenumber !== "" &&
                          EditData?.Dob !== "" &&
                          EditData?.Sex !== "" &&
                          EditData?.Status !== "" &&
                          EditData?.Address !== "" &&
                          EditData?.BranchId !== "" &&
                          EditData?.BankName !== "" &&
                          EditData?.AccountType !== "" &&
                          EditData?.AccountNumber !== "" &&
                          EditData?.IFSCCode !== "" &&
                          EditData?.IDProofType !== "" &&
                          EditData?.IDProofNumber
                        )
                      }
                      functrigger1={OnsubmitHandler}
                    />
                  </CenterBox>
                ) : null}
              </Grid>
            </Grid>
          </Box>

          <Divider />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box
            mt={1}
            color={"black"}
            encType="multipart/form-data"
            component={"form"}
            onSubmit={(e) => {
              e.preventDefault();
              let finalobj = Object.keys(EditPic).reduce((acc, key) => {
                if (
                  EditPic[key] !== "" &&
                  EditPic[key] !== null &&
                  EditPic[key] !== undefined
                ) {
                  acc[key] = EditPic[key];
                }
                return acc;
              }, {});
              finalobj.UUid = data?.UUid;
              finalobj.AgentID = data?.AgentID;
              finalobj.Utype = 2;
              finalobj.SuperUserID = userInfo?.details?.SuperUserID;
              var a = {
                ...finalobj,
                ...global,
                Phonenumber: data?.Phonenumber,
              };
              dispatch(AgentEdit(a));
              //  console.log(a);
              setEdit(false);
              setCheck(true);
            }}
          >
            <PictureInspection2
              data={data}
              Image={AgentPhotos}
              label={"Agent's Photo ID Proof"}
              Edit={Edit}
              reload={datetime}
              HandleChange={(e) => {
                var key = e.target.name;
                let files = e.target.files;
                setEditPic({ ...EditPic, [key]: files });
              }}
            />

            {Edit == true ? (
              <CenterBox mb={2} sx={{ my: 0.5 }}>
                <Button
                  variant="outlined"
                  color="success"
                  type="submit"
                  disabled={
                    EditPic?.Photo ||
                    EditPic?.IDProofPhoto ||
                    EditPic?.Signature
                      ? false
                      : true
                  }
                >
                  Submit
                </Button>
              </CenterBox>
            ) : null}
          </Box>
        </Grid>{" "}
        <Grid item xs={12} sm={12} md={12} lg={12} my={1} color={"black"}>
          <Divider />
          <CenterBox mb={1} mt={1}>
            <Typography variant="h5">Collection History</Typography>
          </CenterBox>
          <Divider />
          <br />
          <CenterBox>
            <ReusableDataTable
              uniqueid={"CollectionUUId"}
              columns={columns}
              rows={PaymentDetails || []}
              isloading={isloading29}
            />
          </CenterBox>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default InspectEditAgentData;
