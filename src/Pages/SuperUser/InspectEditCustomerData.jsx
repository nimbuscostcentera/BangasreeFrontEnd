import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  TextField,
  FormHelperText,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Typography,
  Box,
  Button,
  FormControl,
  Modal,
  IconButton,
  Alert,
  AlertTitle,
  Stack,
} from "@mui/material";

import Grid from "@mui/system/Unstable_Grid/Grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import BiSepBox from "../../Components/styledComponent/BiSepBox";
import CenterBox from "../../Components/styledComponent/CenterBox";

import ReusableDialogue from "../../Components/Global/ReusableDialogue";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import ReusableDataTable from "../../Components/Global/ReusableTable";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import ReusableDropDown3 from "../../Components/Global/ReusableDropDown3";
import Loader from "../../Components/Global/loader";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";
import PictureInspection2 from "../../Components/Global/PictureInspection2";
import OnOffButton from "../../Components/Global/OnOffButton";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";

import {
  CustomerEdit,
  ClearState11,
} from "../../Slice/Customer/CustomerEditSlice";
import {
  CutomerStatusUpdate,
  ClearState10,
} from "../../Slice/Customer/CutomerStatusUpdateSlice";

import {
  CollectionList,
  ClearState23,
} from "../../Slice/Collection/CollectionListSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchBranch from "../../Apps/CustomHook/useFetchBranch";
import useFetchArea from "../../Apps/CustomHook/useFetchArea";
import useFetchCustomer from "../../Apps/CustomHook/useFetchCustomer";
import useFetchAgentCode from "../../Apps/CustomHook/useFetchAcode";

import AlphabetOnly from "../../Apps/GlobalFunctions/AlphabetOnly";
import EmailValidation from "../../Apps/GlobalFunctions/EmailValidation";
import AlphaNumeric from "../../Apps/GlobalFunctions/AlphaNumeric";
import PassportValidation from "../../Apps/GlobalFunctions/PassportValidation";
import DrivingLicenceValidation from "../../Apps/GlobalFunctions/DrivingLicenceValidation";
import AdhaarValidation from "../../Apps/GlobalFunctions/AdhaarValidation";
import VoterCardValidation from "../../Apps/GlobalFunctions/VoterCardValidation";
import PhnoValidation from "../../Apps/GlobalFunctions/PhnoValidation";
import MaxMinDate from "../../Apps/GlobalFunctions/MaxMinDate";

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

function InspectEditCustomerData() {
  //-----------------------------------------hooks-----------------------------------//
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  var { CustUUid } = location.state;
  let datetime = moment().format("DD/MM/YYYY HH:mm:SS");
  const [sub, setSub] = useState([]);
  const [params, setParams] = useState({ warning: "", alert: false });
  const [scid, setScid] = useState([]);
  const [openPrompt, setOpenPrompt] = useState(false);
  const [comment, setComment] = useState({ Comment: "" });
  const [Edit, setEdit] = useState(false);
  const [open, setOpen] = useState(true);
  const [EditPic, setEditPic] = useState({
    IdProofPhoto: null,
    AplicantPhoto: null,
    Customersignature: null,
  });
  const [data, setData] = useState({
    CustomerID: null,
    CustomerName: null,
    Guardian: null,
    PhoneNumber: null,
    AlternateNo: null,
    DOB: null,
    Sex: null,
    EmailId: null,
    Occupation: null,
    AgentCode: null,
    Status: null,
    Address: null,
    Geolocation: null,
    BranchId: null,
    AreaID: null,
    LocalBody: null,
    LandMark: null,
    IdProofType: null,
    IdProofNumber: null,
  });
  const [EditData, setEditData] = useState({
    CustomerName: null,
    Guardian: null,
    PhoneNumber: null,
    AlternateNo: null,
    DOB: null,
    Sex: null,
    EmailId: null,
    Occupation: null,
    AgentCode: null,
    Status: null,
    Address: null,
    Geolocation: null,
    BranchId: null,
    AreaID: null,
    LocalBody: null,
    LandMark: null,
    IdProofType: null,
    IdProofNumber: null,
  });
  const [input, setInput] = useState({
    CustomerName: true,
    Guardian: true,
    LocalBody: true,
    LandMark: true,
    PhoneNumber: true,
    AlternateNo: true,
    EmailId: true,
    Occupation: true,
    CustomerAccNo: true,
    IdProofNumber: true,
    Nomineename: true,
    Relation: true,
    NomineeIdProofNumber: true,
  });
  //---------------------------------------API call-------------------------------------//

  //status
  const { isloading10, Msg10, isError10, error10, isSuccess10 } = useSelector(
    (state) => state.CustStatus
  );
  //Edit Customer
  const { isloading11, Msg11, error11, isError11, isSuccess11 } = useSelector(
    (state) => state.CustomerEdit
  );

  //Collection List for Table
  const { isloading23 } = useSelector(
    (state) => state.CollectionList
  );

  const { userInfo, global } = UseFetchLogger();

  const { AreaList } = useFetchArea({ Status: 1 });

  const { branch} = useFetchBranch(
    { Status: 1 },
    [CustUUid],
    ""
  );

  const { custList,isSuccess6,isloading6,isError6 } = useFetchCustomer(
    {
      UUid: userInfo?.details?.UUid,
      Utype: 3,
      CustUUid: CustUUid,
      ...global,
    },
    [isSuccess11, isSuccess10, Edit]
  );
  console.log(custList, "custList");
  //agent code
  const { AgentCode} = useFetchAgentCode(
    {
      Status: 1,
      BranchId: EditData?.BranchId || data?.BranchId,
    },
    [EditData?.BranchId, data?.BranchId]
  );
  //---------------------------------functions------------------------------//
  const handleClose = () => {
    setOpen(false);
  };
  const NavigateToPaymentHistory = () => {
    console.log(scid);

    if (scid.length == 1) {
      navigate("/customer/custpaymenthistory", {
        state: { SchemeRegId: scid[0] },
        replace: true,
      });
    } else {
      setParams({ alert: true, warning: "Select 1 Customer Account." });
    }
  };
  const BlockUser = (event) => {
    event.preventDefault();
    const UserData = {
      Status: 2,
      CustUUid: CustUUid,
      CustomerID: data?.CustomerID,
      LoggerId: global?.LoggerID,
      UUid: global?.LoggerUUid,
      ...comment,
      ...global,
    };

    dispatch(CutomerStatusUpdate(UserData));
    setOpenPrompt(false);
  };
  const OnSubmitHandler = (e) => {
    e.preventDefault();
    var finalobj = Object.keys(EditData).reduce((acc, key) => {
      if (
        EditData[key] !== null &&
        EditData[key] !== undefined &&
        EditData[key] !== ""
      ) {
        if (key === "Status" && EditData[key] == 4) {
          acc[key] = 0;
        } else {
          acc[key] = EditData[key];
        }
      }
      return acc;
    }, {});

    finalobj.UUid = userInfo?.details?.UUid;
    finalobj.Utype = 3;
    finalobj.CustUUid = CustUUid;
    finalobj.CustomerID = data?.CustomerID;
    finalobj.BranchId = finalobj.BranchId || userInfo?.details?.BranchId;
    console.log({ ...finalobj, ...global, PhoneNumber: data?.PhoneNumber });
    dispatch(
      CustomerEdit({ ...finalobj, ...global, PhoneNumber: data?.PhoneNumber })
    );
  };
  const InputHandler = (e) => {
    var value = e.target.value;
    var key = e.target.name;
    if (key === "DOB") {
      let now = new moment().add(-18, "years");
      let inputdate = new moment(e?.target?.value);
      let diffdays = now.diff(inputdate, "days");

      if (diffdays < 0) {
        value = null;
      } else {
        value = e?.target?.value;
      }
    }
    setEditData({ ...EditData, [key]: value });
  };
  const IdProofValidation = (a) => {
    var b = false;
    if (EditData?.IdProofType == "Aadhaar Card") {
      b = AdhaarValidation(a);
    } else if (EditData?.IdProofType == "Voter Card") {
      b = VoterCardValidation(a);
    } else if (EditData?.IdProofType == "Passport") {
      b = PassportValidation(a);
    } else if (EditData?.IdProofType == "Driving Licence") {
      b = DrivingLicenceValidation(a);
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
  const ManageIdProofNumberDD = (e) => {
    let value = e.target.value;
    if (EditData?.IdProofType !== value) {
      setEditData({
        ...EditData,
        IdProofNumber: null,
        IdProofType: value,
      });
      setInput({ ...input, IdProofNumber: true });
    } else {
      setEditData({ ...EditData, IdProofType: value });
    }
  };
  //-------------------------------------------useEffects---------------------------------//
  console.log(custList[0], AreaList[0],AgentCode[0]);
  useEffect(() => {
    if (
AreaList?.length >0 && 
      AgentCode?.length > 0 
    ) {
      if((custList?.length == 0 && !isloading6 && isSuccess6)||isError6){
        navigate("/superuser/customermanagement");
      }
      if (Array.isArray(custList) && custList?.length > 0) {
        let apidata = custList[0];
        setData({ ...apidata, IdProofNumber: custList[0]?.IDProofNumber });
        setEditData({ ...apidata, IdProofNumber: custList[0]?.IDProofNumber });
        dispatch(
          CollectionList({
            ...global,
            CustomerID: custList[0]?.CustomerID,
          })
        )
          .then(async (resp) => {
            setSub(resp?.payload);
            dispatch(ClearState23());
            handleClose();
          })
          .catch((err) => {
            console.log(err);
          });
      }
      
    } else {
      return;
    }
  }, [
    CustUUid,
    Edit,
    AgentCode,branch,AreaList,custList,isSuccess10,isSuccess11
  ]);

  //toaster
  useEffect(() => {
    if (isSuccess11 && !isloading11) {
      toast.success(`${Msg11}`, { positions: toast.POSITION.TOP_RIGHT });
      setEdit(false);
      dispatch(ClearState11());
    }
    if (isError11 && !isloading11) {
      toast.error(`${error11}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState11());
    }
  }, [isSuccess11, isError11]);

  //block customer
  useEffect(() => {
    if (isSuccess10 && !isloading10) {
      toast.success(`${Msg10}`, { positions: toast.POSITION.TOP_RIGHT });
    }
    if (isError10 && !isloading10) {
      toast.error(`${error10}`, { positions: toast.POSITION.TOP_RIGHT });
    }
    dispatch(ClearState10());
  }, [isSuccess10, isError10]);

  const columns = [
    {
      field: `CustomerAccNo`,
      headerName: "Cust. A/C No.",
      width: 140,
      hideable: false,
    },
    {
      field: `CustomerName`,
      headerName: "Customer Name",
      width: 130,
    },
    { field: `SchemeTitle`, headerName: "Scheme Title", width: 150 },

    {
      field: `amttobepaid`,
      headerName: "Total Amt.",
      width: 95,
      renderCell: (item) => {
        return <Typography> ₹ {item.row.amttobepaid || 0} /-</Typography>;
      },
    },
    {
      field: `totcolection`,
      headerName: "Collected Amt.",
      hideable: false,
      width: 105,
      renderCell: (item) => {
        return <Typography> ₹ {item.row.totcolection || 0} /-</Typography>;
      },
    },
    {
      field: `RedeemAmt`,
      headerName: "Redeem Amt.",
      hideable: false,
      width: 98,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.MaturityStatus === 2 ||
            item?.row?.MaturityStatus === 3 ? (
              <Typography> ₹ {item?.row?.RedeemAmt || 0} /-</Typography>
            ) : null}
          </>
        );
      },
    },
    {
      field: `MaturityStatus`,
      headerName: "Maturity Status",
      hideable: false,
      width: 110,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.MaturityStatus === 1 ? (
              <Typography>Active</Typography>
            ) : item?.row?.MaturityStatus === 3 ? (
              <Typography>Matured</Typography>
            ) : item?.row?.MaturityStatus === 2 ? (
              <Typography>Premature</Typography>
            ) : item?.row?.MaturityStatus === 0 ? (
              <Typography>Inactive</Typography>
            ) : null}
          </>
        );
      },
    },
    {
      field: `BonusStatus`,
      headerName: "Bonus Status",
      hideable: false,
      width: 100,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.BonusStatus == 1 ? (
              <Typography>Active</Typography>
            ) : item?.row?.BonusStatus == 0 ? (
              <Typography>InActive</Typography>
            ) : (
              <Typography>Processing</Typography>
            )}
          </>
        );
      },
    },
    {
      field: `AgentCode`,
      headerName: "Agent Code",
      width: 100,
    },
  ];

  const Photos = [
    {
      field: "IdProofPhoto",
      Label: "IdProof Photo",
      type: "image",
      id: 4,
      url: "Customer/IdProof",
    },
    {
      field: "AplicantPhoto",
      Label: "Customer Photo",
      type: "image",
      id: 5,
      url: "Customer/ProfilePhoto",
    },
    {
      field: "Customersignature",
      Label: "Customer Sign",
      type: "image",
      id: 6,
      url: "Customer/Signature",
    },
  ];

  const custAge = MaxMinDate(18);

  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Customer")[0];

  // useEffect(() => {
  //   if ((isloading11 || isloading10) && data?.PhoneNumber == undefined) {
  //     setOpen(true);
  //   } else {
  //     setOpen(false);
  //   }
  // }, [isloading11, isloading10, data]);

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
                  title: "Manage Customer",
                  link:
                    myPermission?.ViewPage == 1
                      ? "/superuser/customermanagement"
                      : "#",
                  icon: "manage_accounts",
                },
                {
                  title: "Manage Customer",
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
        <Grid item xs={12} sm={12} md={12} lg={12} color={"black"}>
          <BiSepBox>
            <Typography variant="h6">Customer Details</Typography>
            {myPermission?.Edit == 1 ? (
              <IconOnOffButton
                mt={0.5}
                mb={0.5}
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
                  if (Edit) {
                    setEditPic({
                      IdProofPhoto: data?.IdProofPhoto,
                      AplicantPhoto: data?.AplicantPhoto,
                      Customersignature: data?.Customersignature,
                    });
                    setEditData({
                      CustomerName: data?.CustomerName,
                      Guardian: data?.Guardian,
                      AlternateNo: data?.AlternateNo,
                      DOB: data?.DOB,
                      Sex: data?.Sex,
                      EmailId: data?.EmailId,
                      Occupation: data?.Occupation,
                      AgentCode: data?.AgentCode,
                      Status: data?.Status,
                      Address: data?.Address,
                      Geolocation: data?.Geolocation,
                      BranchId: data?.BranchId,
                      AreaID: data?.AreaID,
                      LocalBody: data?.LocalBody,
                      LandMark: data?.LandMark,
                      IdProofType: data?.IdProofType,
                      IdProofNumber: data?.IdProofNumber,
                    });
                    setEdit(!Edit);
                  } else {
                    setEditPic({
                      IdProofPhoto: data?.IdProofPhoto,
                      AplicantPhoto: data?.AplicantPhoto,
                      Customersignature: data?.Customersignature,
                    });
                    setEditData({
                      CustomerName: data?.CustomerName,
                      Guardian: data?.Guardian,
                      AlternateNo: data?.AlternateNo,
                      DOB: data?.DOB,
                      Sex: data?.Sex,
                      EmailId: data?.EmailId,
                      Occupation: data?.Occupation,
                      AgentCode: data?.AgentCode,
                      Status: data?.Status,
                      Address: data?.Address,
                      Geolocation: data?.Geolocation,
                      BranchId: data?.BranchId,
                      AreaID: data?.AreaID,
                      LocalBody: data?.LocalBody,
                      LandMark: data?.LandMark,
                      IdProofType: data?.IdProofType,
                      IdProofNumber: data?.IDProofNumber,
                    });
                    setEdit(!Edit);
                  }
                }}
                funcTrigger2={() => {
                  setEditData({
                    CustomerName: null,
                    Guardian: null,
                    PhoneNumber: null,
                    AlternateNo: null,
                    DOB: null,
                    Sex: null,
                    EmailId: null,
                    Occupation: null,
                    AgentCode: null,
                    Status: null,
                    Address: null,
                    Geolocation: null,
                    BranchId: null,
                    LocalBody: null,
                    LandMark: null,
                    IdProofType: null,
                    IdProofNumber: null,
                  });
                  navigate("/superuser/customermanagement");
                }}
              />
            ) : null}
          </BiSepBox>
          <Divider sx={{ mt: -1 }}>Personal Detail</Divider>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box component={"form"} onSubmit={OnSubmitHandler} color={"black"}>
            <Grid container columnGap={4}>
              <Grid item lg={5.7} md={5.5} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={EditData?.CustomerName || ""}
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                  label="Customer Name"
                  required
                  name="CustomerName"
                  type="text"
                  id="CustomerName"
                  inputProps={{ maxLength: 50 }}
                  error={!input?.CustomerName}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["CustomerName"]: true });
                    } else {
                      var res = AlphabetOnly(e.target.value);
                      setInput({ ...input, ["CustomerName"]: res });
                    }
                    InputHandler(e);
                  }}
                />
                {!input?.CustomerName ? (
                  <FormHelperText error>
                    Name must not contain space at first place, number or
                    special character
                  </FormHelperText>
                ) : null}
              </Grid>
              <Grid item lg={5.7} md={5.5} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={EditData?.Guardian || ""}
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                  required
                  label={"Guardian"}
                  name="Guardian"
                  type="text"
                  id="Guardian"
                  inputProps={{ maxLength: 50 }}
                  error={!input?.Guardian}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["Guardian"]: true });
                    } else {
                      var res = AlphabetOnly(e.target.value);
                      setInput({ ...input, ["Guardian"]: res });
                    }
                    InputHandler(e);
                  }}
                />
                {!input?.Guardian ? (
                  <FormHelperText error>
                    Name must not contain space at first place, number or
                    special character
                  </FormHelperText>
                ) : null}
              </Grid>
              <Grid item lg={5.7} md={5.5} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={data?.PhoneNumber || ""}
                  fullWidth
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  required
                  name="PhoneNumber"
                  label={"Phone Number"}
                  type="tel"
                  id="PhoneNumber"
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid item lg={5.7} md={5.5} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={EditData?.AlternateNo || ""}
                  fullWidth
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  name="AlternateNo"
                  label="Alternate Phone Number"
                  type="tel"
                  id="AlternateNo"
                  error={!input?.AlternateNo}
                  inputProps={{ maxLength: 10 }}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["AlternateNo"]: true });
                    } else {
                      var res = PhnoValidation(e.target.value);
                      setInput({ ...input, ["AlternateNo"]: res });
                    }
                    InputHandler(e);
                  }}
                />
                {!input?.AlternateNo ? (
                  <FormHelperText error>
                    Phone Number must contain only number.
                  </FormHelperText>
                ) : null}{" "}
              </Grid>
              <Grid item lg={2.1} md={5.5} sm={12} xs={12}>
                <TextField
                  fullWidth
                  value={EditData?.DOB || ""}
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  type="Date"
                  name="DOB"
                  label="Date Of Birth"
                  size="small"
                  id="outlined-required"
                  inputProps={{ max: custAge }}
                  required
                  onChange={InputHandler}
                  sx={{ mt: 2 }}
                />
              </Grid>
              <Grid item lg={3.3} md={5.5} sm={12} xs={12} color={"#000000"}>
                {Edit ? (
                  <FormControl>
                    <FormLabel
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        mt: 2,
                      }}
                    >
                      <Typography sx={{ mt: 1 }}> Gender* </Typography>
                      <RadioGroup
                        required
                        disabled={!Edit}
                        InputLabelProps={{ shrink: true }}
                        row
                        value={EditData?.Sex || ""}
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
                              onChange={InputHandler}
                            />
                          }
                          label="Female"
                        />
                        <FormControlLabel
                          control={
                            <Radio
                              value="Male"
                              disabled={!Edit}
                              InputLabelProps={{ shrink: true }}
                              name="Sex"
                              inputProps={{ "aria-label": "Male" }}
                              checked={EditData?.Sex == "Male" ? true : false}
                              onChange={InputHandler}
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
                    value={data?.Sex || ""}
                    disabled={true}
                    label="Gender"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                    required
                    name="Sex"
                    type="text"
                    id="Sex"
                    inputProps={{ maxLength: 30 }}
                  />
                )}
              </Grid>
              <Grid item lg={5.7} md={5.5} sm={12} xs={12}>
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
                  id="EmailId"
                  inputProps={{ maxLength: 50 }}
                  error={!input?.EmailId}
                  onChange={(e) => {
                    console.log(e.target.value);
                    if (e.target.value == "") {
                      setInput({ ...input, ["EmailId"]: true });
                    } else {
                      var res = EmailValidation(e.target.value);
                      setInput({ ...input, ["EmailId"]: res });
                    }
                    InputHandler(e);
                  }}
                />
                {!input?.EmailId ? (
                  <FormHelperText error>Enter a valid Email ID</FormHelperText>
                ) : null}
              </Grid>
              <Grid item lg={5.7} md={5.5} sm={12} xs={12} mt={1}>
                <TextField
                  size="small"
                  value={EditData?.Occupation || ""}
                  fullWidth
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  name="Occupation"
                  label="Occupation"
                  type="text"
                  id="Occupation"
                  inputProps={{ maxLength: 30 }}
                  error={!input?.Occupation}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["Occupation"]: false });
                    } else {
                      var res = AlphabetOnly(e.target.value);
                      setInput({ ...input, ["Occupation"]: res });
                    }
                    InputHandler(e);
                  }}
                />
                {!input?.Occupation ? (
                  <FormHelperText error>
                    Occupation contain alphabets only.
                  </FormHelperText>
                ) : null}
              </Grid>

              {!Edit ? (
                <Grid item lg={5.7} md={5.5} sm={12} xs={12} mt={1}>
                  <TextField
                    size="small"
                    value={
                      data?.Status == 1
                        ? "Active"
                        : data?.Status == 0
                        ? "Inactive"
                        : data?.Status == 3
                        ? "Pending"
                        : data?.Status == 2
                        ? "Blocked"
                        : ""
                    }
                    fullWidth
                    disabled={!Edit}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    required
                    name="Status"
                    type="text"
                    id="Status"
                    label="Status"
                    inputProps={{ maxLength: 11 }}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item lg={2.65} md={5.5} sm={12} xs={12} mt={2}>
                    <ReusableDropDown4
                      label={"Status*"}
                      data={[
                        { Status: 1, value: "Active" },
                        { Status: 4, value: "Inactive" },
                        { Status: 3, value: "Pending" },
                      ]}
                      id={"arial_st_cust"}
                      disabled={!Edit}
                      ObjectKey={["value"]}
                      Field={EditData?.Status}
                      uniquekey={"Status"}
                      deselectvalue={false}
                      onChange={InputHandler}
                    />{" "}
                  </Grid>
                  <Grid item lg={2.7} md={5.5} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      value={
                        data?.Status == 1
                          ? "Active"
                          : data?.Status == 0
                          ? "Inactive"
                          : data?.Status == 2
                          ? "Block"
                          : data?.Status == 3
                          ? "Pending"
                          : ""
                      }
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      required
                      name="Status"
                      type="text"
                      id="Status"
                      label="Status"
                      inputProps={{ maxLength: 11 }}
                      fullWidth
                    />
                  </Grid>
                </>
              )}

              <Grid item md={12} sm={12} xs={12} lg={12}>
                <Divider>Address Details</Divider>
              </Grid>
              <Grid item lg={5.7} md={5.5} sm={12} xs={12}>
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
                  onChange={InputHandler}
                />
              </Grid>
              <Grid item lg={5.7} md={5.5} sm={12} xs={12}>
                <TextField
                  size="small"
                  value={EditData?.Geolocation || ""}
                  fullWidth
                  margin="normal"
                  label="GeoLocation"
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  name="Geolocation"
                  type="text"
                  id="GeoLocation"
                  rows={4}
                  multiline={true}
                  onChange={InputHandler}
                />
              </Grid>

              {/**Branch */}
              {!Edit ? (
                <Grid item lg={5.7} md={5.5} sm={12} xs={12} mt={1}>
                  <TextField
                    size="small"
                    fullWidth
                    value={`${data?.branchname}` || ""}
                    disabled={!Edit}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    type="text"
                    id="branchcode"
                    label="Branch"
                    inputProps={{ maxLength: 11 }}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item lg={2.75} md={5.5} sm={12} xs={12} mt={2}>
                    <ReusableDropDown3
                      disabled={!Edit}
                      InputLabelProps={{ shrink: true }}
                      label={"Branch*"}
                      data={branch}
                      ObjectKey={["BranchName"]}
                      uniquekey={"BranchId"}
                      setState={setEditData}
                      state={EditData}
                      handleChange={(e) => {
                        let Value = e.target.value;
                        if (
                          EditData?.BranchId !== Value &&
                          EditData?.AgentCode !== null &&
                          EditData?.AgentCode !== ""
                        ) {
                          setEditData({
                            ...EditData,
                            AgentCode: null,
                            BranchId: Value,
                          });
                        } else {
                          setEditData({
                            ...EditData,
                            BranchId: Value,
                          });
                        }
                      }}
                    />
                  </Grid>
                  <Grid item lg={2.6} md={5.5} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      value={`${data?.branchname}` || ""}
                      disabled={true}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      required
                      name="branchcode"
                      type="text"
                      id="branchcode"
                      label="Branch"
                      inputProps={{ maxLength: 11 }}
                    />
                  </Grid>
                </>
              )}
              {/**agent code */}

              {!Edit ? (
                <Grid item lg={5.7} md={5.5} sm={12} xs={12} mt={1}>
                  <TextField
                    size="small"
                    fullWidth
                    value={`${data?.AgentCode} : ${data?.Name}` || ""}
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    required
                    name="AgentCode"
                    type="text"
                    id="AgentCode"
                    label="AgentCode"
                    inputProps={{ maxLength: 11 }}
                  />{" "}
                </Grid>
              ) : (
                <>
                  <Grid item lg={2.7} md={5.5} sm={12} xs={12} mt={2}>
                    <ReusableDropDown4
                      label={"AgentCode*"}
                      data={AgentCode}
                      id={"arial_ac"}
                      disabled={!Edit}
                      ObjectKey={["Name", "AgentCode"]}
                      uniquekey={"AgentCode"}
                      Field={EditData?.AgentCode}
                      deselectvalue={false}
                      onChange={InputHandler}
                    />
                  </Grid>
                  <Grid item lg={2.7} md={5.5} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      value={`${data?.AgentCode} : ${data?.Name}` || ""}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      required
                      name="AgentCode"
                      type="text"
                      id="AgentCode"
                      label="AgentCode"
                      fullWidth
                      inputProps={{ maxLength: 11 }}
                    />
                  </Grid>
                </>
              )}

              {/**Area */}
              {!Edit ? (
                <Grid item lg={5.7} md={5.5} sm={12} xs={12} mt={1}>
                  <TextField
                    size="small"
                    fullWidth
                    value={`${data?.AreaName}` || ""}
                    disabled={!Edit}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    type="text"
                    id="area_arial"
                    label="Area"
                    inputProps={{ maxLength: 11 }}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item lg={2.75} md={5.5} sm={12} xs={12} mt={2}>
                    <ReusableDropDown4
                      label={"Area*"}
                      data={AreaList}
                      id={"arial_area_cust"}
                      disabled={!Edit}
                      ObjectKey={["AreaName"]}
                      Field={EditData?.AreaID}
                      uniquekey={"AreaID"}
                      deselectvalue={false}
                      onChange={InputHandler}
                    />
                  </Grid>
                  <Grid item lg={2.6} md={5.5} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      value={`${data?.AreaName}` || ""}
                      disabled={true}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      required
                      name="Area"
                      type="text"
                      id="Area_arial"
                      label="Area"
                      inputProps={{ maxLength: 11 }}
                    />
                  </Grid>
                </>
              )}

              <Grid item lg={2.7} md={5.5} sm={12} xs={12} mt={1}>
                <TextField
                  size="small"
                  value={EditData?.LocalBody || ""}
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                  required
                  name="LocalBody"
                  type="text"
                  id="LocalBody"
                  inputProps={{ maxLength: 200 }}
                  error={!input?.LocalBody}
                  label="Local Body"
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["LocalBody"]: true });
                    } else {
                      var res = AlphabetOnly(e.target.value);
                      setInput({ ...input, ["LocalBody"]: res });
                    }
                    InputHandler(e);
                  }}
                />
                {!input?.LocalBody ? (
                  <FormHelperText error>
                    Local Body Name must not contain space at first place,Number
                    or special character.
                  </FormHelperText>
                ) : null}
              </Grid>
              <Grid item lg={2.7} md={5.5} sm={12} xs={12} mt={1}>
                <TextField
                  size="small"
                  value={EditData?.LandMark || ""}
                  disabled={!Edit}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                  required
                  name="LandMark"
                  label="LandMark"
                  type="text"
                  id="LandMark"
                  inputProps={{ maxLength: 200 }}
                  error={!input?.LandMark}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["LandMark"]: true });
                    } else {
                      var res = AlphaNumeric(e.target.value);
                      setInput({ ...input, ["LandMark"]: res });
                    }
                    InputHandler(e);
                  }}
                />
                {!input?.LandMark ? (
                  <FormHelperText error>
                    Land Mark must contain numbers or alphabets in upper case
                    only.
                  </FormHelperText>
                ) : null}
              </Grid>
              <Grid item md={12} sm={12} lg={12} xs={12} mt={1}>
                <Divider>ID Proof Details</Divider>
              </Grid>

              {!Edit ? (
                <Grid item lg={5.7} md={5.5} sm={12} xs={12}>
                  <TextField
                    size="small"
                    value={data?.IdProofType || ""}
                    fullWidth
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    required
                    name="IdProofType"
                    type="text"
                    id="IdProofType"
                    label="ID Proof Type "
                    inputProps={{ maxLength: 20 }}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item lg={2.75} md={5.5} sm={12} xs={12} mt={2}>
                    <ReusableDropDown3
                      label={"Applicant's Id Proof Type*"}
                      data={[
                        { IdProofType: "Aadhaar Card" },
                        { IdProofType: "Voter Card" },
                        { IdProofType: "Passport" },
                        { IdProofType: "Driving Licence" },
                        //{ IdProofType: "Pan Card" },
                      ]}
                      ObjectKey={["IdProofType"]}
                      uniquekey={"IdProofType"}
                      setState={setEditData}
                      state={EditData}
                      handleChange={ManageIdProofNumberDD}
                    />
                  </Grid>
                  <Grid item lg={2.6} md={5.5} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      value={data?.IdProofType || ""}
                      fullWidth
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      required
                      name="IdProofType"
                      type="text"
                      id="IdProofType"
                      label="ID Proof Type "
                      inputProps={{ maxLength: 20 }}
                    />{" "}
                  </Grid>
                </>
              )}

              {!Edit ? (
                <Grid item lg={5.7} md={5.5} sm={12} xs={12}>
                  <TextField
                    size="small"
                    fullWidth
                    value={data?.IdProofNumber || ""}
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    name="IdProofNumber"
                    type="text"
                    id="IdProofNumber"
                    label="IdProof Number"
                    InputProps={{ maxLength: 16 }}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item lg={2.75} md={5.5} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      fullWidth
                      value={EditData?.IdProofNumber || ""}
                      disabled={!Edit}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      required
                      name="IdProofNumber"
                      type="text"
                      id="IdProofNumber"
                      label="ID Proof Number"
                      inputProps={{
                        maxLength: getMaxLengthForIDProof(
                          EditData?.IdProofType
                        ),
                      }}
                      error={!input?.IdProofNumber}
                      onChange={(e) => {
                        if (e.target.value == "") {
                          setInput({ ...input, ["IdProofNumber"]: true });
                        } else {
                          var res = IdProofValidation(e.target.value);
                          setInput({ ...input, ["IdProofNumber"]: res });
                        }
                        InputHandler(e);
                      }}
                    />
                    {!input?.IdProofNumber ? (
                      <FormHelperText error>
                        Give Correct ID Proof Number
                      </FormHelperText>
                    ) : null}
                  </Grid>
                  <Grid item lg={2.6} md={5.5} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      fullWidth
                      value={data?.IdProofNumber || ""}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      margin="normal"
                      name="IdProofNumber"
                      type="text"
                      id="IdProofNumber"
                      label="IdProof Number"
                      InputProps={{ maxLength: 16 }}
                    />
                  </Grid>
                </>
              )}

              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                justifyContent={"center"}
                my={2}
              >
                {Edit ? (
                  <Box>
                    <OnOffButton
                      yes={"Update"}
                      type1={"submit"}
                      disabled1={
                        !Edit ||
                        !(
                          EditData?.CustomerName !== "" &&
                          EditData?.Guardian !== "" &&
                          EditData?.PhoneNumber !== "" &&
                          EditData?.DOB !== "" &&
                          EditData?.Sex !== "" &&
                          EditData?.AgentCode !== "" &&
                          EditData?.AgentCode !== null &&
                          EditData?.Status !== "" &&
                          EditData?.Address !== "" &&
                          EditData?.BranchId !== "" &&
                          EditData?.AreaID !== "" &&
                          EditData?.LocalBody !== "" &&
                          EditData?.LandMark !== "" &&
                          EditData?.IdProofType !== "" &&
                          (EditData?.IdProofNumber !== "" ||
                            EditData?.IdProofNumber !== null)
                        ) ||
                        !(
                          input?.CustomerName &&
                          input?.Guardian &&
                          input?.LocalBody &&
                          input?.LandMark &&
                          input?.PhoneNumber &&
                          input?.AlternateNo &&
                          input?.EmailId &&
                          input?.Occupation &&
                          input?.CustomerAccNo &&
                          input?.IdProofNumber &&
                          input?.Nomineename &&
                          input?.Relation &&
                          input?.NomineeIdProofNumber
                        )
                      }
                      functrigger1={OnSubmitHandler}
                    />
                  </Box>
                ) : null}
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box
            mt={-1.3}
            color={"black"}
            component={"form"}
            encType="multipart/form-data"
            onSubmit={(e) => {
              e.preventDefault();
              var a = {
                ...EditPic,
                ...global,
                PhoneNumber: data?.PhoneNumber,
                CustUUid: CustUUid,
              };
              dispatch(CustomerEdit(a));
            }}
          >
            <PictureInspection2
              data={data || []}
              Image={Photos}
              label={"ID Proof Details"}
              Edit={Edit}
              reload={datetime}
              HandleChange={(e) => {
                var key = e.target.name;
                let files = e.target.files;
                setEditPic({ ...EditPic, [key]: files });
              }}
            />
            {Edit ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="success"
                  type="submit"
                  disabled={
                    EditPic?.IdProofPhoto ||
                    EditPic?.AplicantPhoto ||
                    EditPic?.Customersignature
                      ? false
                      : true
                  }
                >
                  Submit
                </Button>
              </Box>
            ) : null}

            <Divider />
          </Box>{" "}
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} mt={1}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color={"#000000"} ml={"2%"} mb={1}>
              Customer Accounts
            </Typography>
            <div style={{ color: "black" }}>
              Payment History
              <IconButton variant="outlined" onClick={NavigateToPaymentHistory}>
                <HistoryIcon />
              </IconButton>
            </div>
          </Box>
          <Divider />

          {params?.alert ? (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert
                severity="error"
                onClose={() => {
                  setParams({
                    alert: false,
                    warning: "",
                  });
                }}
              >
                <AlertTitle>Warning</AlertTitle>
                {params?.warning}
              </Alert>
            </Stack>
          ) : null}

          <CenterBox mt={2}>
            <ReusableDataTable
              columns={columns}
              rows={sub || []}
              uniqueid={"SchemeRegId"}
              isloading={isloading23}
              selectState={(arr) => {
                setScid(arr);
              }}
              state={scid}
              width="100%"
              height={"auto"}
            />
          </CenterBox>
          <br />
        </Grid>
        {userInfo?.details?.Utype == 1 && data?.Status !== 2 ? (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
              <ReusableDialogue
                button={true}
                color={"error"}
                title={"Block"}
                reason={"Mention the reason below"}
                b1={"Submit"}
                b2={"Cancel"}
                TextFieldName={"Comment"}
                handleClickOpen={() => {
                  setOpenPrompt(true);
                }}
                handleClose={() => {
                  setOpenPrompt(false);
                }}
                open={openPrompt}
                setopen={setOpenPrompt}
                OnSubmit={BlockUser}
                state={comment}
                setState={setComment}
              />
            </Box>
          </Grid>
        ) : null}
      </Grid>
    </ThemeProvider>
  );
}

export default InspectEditCustomerData;
