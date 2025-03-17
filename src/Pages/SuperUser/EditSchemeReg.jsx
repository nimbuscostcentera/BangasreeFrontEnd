import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  TextField,
  Button,
  Typography,
  Divider,
  FormHelperText,
  Modal,
  InputAdornment,
  Grid,
} from "@mui/material";
import { Box } from "@mui/system";

import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import ReusableDropDown3 from "../../Components/Global/ReusableDropDown3";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";

import MaxMinDate from "../../Apps/GlobalFunctions/MaxMinDate";

import IconOnOffButton from "../../Components/Global/IconOnOffButton";
import PictureInspection2 from "../../Components/Global/PictureInspection2";
import BiSepBox from "../../Components/styledComponent/BiSepBox";
import Loader from "../../Components/Global/loader";

import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";

// import PhnoValidation from "../../Apps/GlobalFunctions/PhnoValidation";
import AdhaarValidation from "../../Apps/GlobalFunctions/AdhaarValidation";
import PassportValidation from "../../Apps/GlobalFunctions/PassportValidation";
import VoterCardValidation from "../../Apps/GlobalFunctions/VoterCardValidation";
import DrivingLicenceValidation from "../../Apps/GlobalFunctions/DrivingLicenceValidation";
import AlphabetOnly from "../../Apps/GlobalFunctions/AlphabetOnly";

import useFetchSchemeById from "../../Apps/CustomHook/useFetchSchemeById";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchScheme from "../../Apps/CustomHook/useFetchScheme";
import {
  EditNomineeFunc,
  ClearState57,
} from "../../Slice/Scheme/EditNomineeSlice";

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

function EditSchemeReg() {
  //console.log("EditSchemeReg");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [Edit, setEdit] = useState(false);
  const [freq, setfreq] = useState([]);
  const [open, setOpen] = useState(false);

  const [EditPic, setEditPic] = useState({
    NomineeIdProofPhoto: null,
    NomineePhoto: null,
    Nomineesignature: null,
  });
  const [input, setInput] = useState({
    Nomineename: true,
    Relation: true,
    NomineeIdProofNumber: true,
    // NomineePhone: true,
  });
  const [obj, setobj] = useState({
    EMI: null,
    frequency: null,
    SUUid: null,
    Nomineename: null,
    Relation: null,
    NomineeDOB: null,
    NomineeIdProofNumber: null,
    // NomineePhone: null,
    NomineeIdProofType: null,
  });

  let datetime = moment().format("DD/MM/YYYY HH:mm:SS");

  const { SchemeRegId, CustomerName, CustUUid } = location.state;

  const { isloading57, Resp57, error57, isError57, isSuccess57 } = useSelector(
    (state) => state.EditCustSchemeReg
  );
  const { SchemeData } = useFetchSchemeById(
    {
      ID: SchemeRegId,
      CustUUid: CustUUid?.UUid,
    },
    [isSuccess57, Edit]
  );
  const { Scheme } = useFetchScheme({ Status: 1 });

  const { global } = UseFetchLogger();

  const nomAge = MaxMinDate(12);

  const handleClose = () => {
    setOpen(false);
  };
  const HandleChange = (e) => {
    var key = e.target.name;
    let value = e.target.value;
    console.log(key, value);
    setobj({ ...obj, [key]: value });
  };

  const IdProofValidation2 = (args) => {
    var b = false;
    if (obj?.NomineeIdProofType == "Aadhaar Card") {
      b = AdhaarValidation(args);
    } else if (obj?.NomineeIdProofType == "Voter Card") {
      b = VoterCardValidation(args);
    } else if (obj?.NomineeIdProofType == "Passport") {
      b = PassportValidation(args);
    } else if (obj?.NomineeIdProofType == "Driving Licence") {
      b = DrivingLicenceValidation(args);
    }
    return b;
  };

  const SubmitHandler = (e) => {
    e.preventDefault();
    const final = Object.keys(obj).reduce((acc, key) => {
      console.log(key, obj[key]);
      if (obj[key] != "" && obj[key] != null && obj[key] != undefined && obj[key]!="0000-00-00") {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
    console.log(final);
    dispatch(
      EditNomineeFunc({
        ...final,
        ...global,
        SchemeRegId: SchemeRegId,
      })
    );
  };

  const HandleEditPic = (e) => {
    e.preventDefault();
    let key = e.target.name;
    let file = e.target.files[0];
    setEditPic({ ...EditPic, [key]: file });
  };
  const SubmitPic = () => {
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
      EditNomineeFunc({
        ...final,
        ...global,
        SchemeRegId: SchemeRegId,
        NomineeIdProofNumber: SchemeData?.NomineeIdProofNumber,
      })
    );
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
    if (obj?.NomineeIdProofType !== value) {
      setobj({ ...obj, NomineeIdProofNumber: null, NomineeIdProofType: value });
      setInput({ ...input, NomineeIdProofNumber: true });
    } else {
      setobj({ ...obj, NomineeIdProofType: value });
    }
  };

  const ManageFrequency = (e) => {
    let value = e.target.value;
    if (obj?.SUUid && obj?.SUUid !== value) {
      setobj({ ...obj, frequency: null, SUUid: value });
    } else {
      setobj({ ...obj, SUUid: value });
    }
  };

  //columns
  const Photos = [
    {
      field: "NomineeIdProofPhoto",
      Label: "Nominee IdProof Photo",
      type: "image",
      id: 1,
      url: "Customer/NomineeIdProof",
    },
    {
      field: "NomineePhoto",
      Label: "Nominee Photo",
      type: "image",
      id: 2,
      url: "Customer/NomineeProfilePhoto",
    },
    {
      field: "Nomineesignature",
      Label: "Nominee Signature",
      type: "image",
      id: 3,
      url: "Customer/NomineeSignature",
    },
  ];

  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Customer")[0];

  //Edit msg of schemereg
  useEffect(() => {
    if (!isloading57 && isSuccess57) {
      toast.success(`${Resp57}`, { positions: toast.POSITION.TOP_RIGHT });
      setEdit(false);
      dispatch(ClearState57());
    }
    if (isError57 && !isloading57) {
      toast.error(`${error57}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState57());
    }
    if (isloading57) {
      setOpen(true);
    } else {
      if (SchemeData?.ID == SchemeRegId) {
        setOpen(false);
        setobj({
          EMI: SchemeData?.EMI,
          frequency: SchemeData?.frequency,
          SUUid: SchemeData?.SUUid,
          Nomineename: SchemeData?.Nomineename || null,
          Relation: SchemeData?.Relation || null,
          NomineeDOB:
            SchemeData?.NomineeDOB !== "0000-00-00" &&
            SchemeData?.NomineeDOB !== undefined &&
            SchemeData?.NomineeDOB !== null &&
            SchemeData?.NomineeDOB !== ""
              ? SchemeData?.NomineeDOB
              : null,
          NomineeIdProofNumber: SchemeData?.NomineeIdProofNumber || null,
          // NomineePhone: SchemeData?.NomineePhone || null,
          NomineeIdProofType: SchemeData?.NomineeIdProofType || null,
        });
      } else {
        setOpen(true);
      }
    }
  }, [isError57, isSuccess57, isloading57, SchemeData, Edit]);

  useEffect(() => {
    var arr = [];
    if (obj?.SUUid) {
      var p = Scheme.filter((i) => i?.SUUid == obj?.SUUid);
      if (p[0].Monthly == 1) {
        arr.push({ frequency: "Monthly" });
      }
      if (p[0].Daily == 1) {
        arr.push({ frequency: "Daily" });
      }
      if (p[0].Weekly == 1) {
        arr.push({ frequency: "Weekly" });
      }
    }
    setfreq(arr);
  }, [obj?.SUUid]);

  return (
    <ThemeProvider theme={CustomTheme}>
      <Grid container maxWidth={"xxxl"} rowGap={2} mt={2} ml={2}>
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
        <ToastContainer autoClose={5000} />
        <Grid
          item
          sm={12}
          xs={12}
          md={12}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
            ml: 1,
          }}
        >
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
                title: "Assign New Scheme to Customer",
                link: "/executive/addcustscheme",
                uniqueID: "CustUUid",
                value: CustUUid,
                icon: "note_add",
              },
              {
                title: "Edit Customer Scheme",
                link: "#",
                icon: "note_add",
              },
            ]}
          />
          <Typography variant="h6" color={"grey"} mt={1}>
            {CustomerName}
          </Typography>{" "}
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          color={"black"}
          ml={1}
          mt={-1}
        >
          {" "}
          <Divider />
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          color={"black"}
          ml={2}
          mt={-3}
        >
          <BiSepBox>
            <Typography variant="h6">Edit Nominee Details</Typography>
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
              h2={"Back"}
              Tooltip1={Edit ? "View" : "Edit"}
              Tooltip2={"Back"}
              state={Edit}
              setState={setEdit}
              funcTrigger1={() => {
                setEdit(!Edit);
                setEditPic({
                  NomineeIdProofPhoto: null,
                  NomineePhoto: null,
                  Nomineesignature: null,
                });
                setobj({
                  EMI: SchemeData?.EMI,
                  frequency: SchemeData?.frequency,
                  SUUid: SchemeData?.SUUid,
                  Nomineename: SchemeData?.Nomineename || null,
                  Relation: SchemeData?.Relation || null,
                  NomineeDOB:
                    SchemeData?.NomineeDOB !== "0000-00-00" &&
                    SchemeData?.NomineeDOB !== undefined &&
                    SchemeData?.NomineeDOB !== null &&
                    SchemeData?.NomineeDOB !== ""
                      ? SchemeData?.NomineeDOB
                      : null,
                  NomineeIdProofNumber:
                    SchemeData?.NomineeIdProofNumber || null,
                  // NomineePhone: SchemeData?.NomineePhone || null,
                  NomineeIdProofType: SchemeData?.NomineeIdProofType || null,
                });
              }}
              funcTrigger2={() => {
                navigate("/executive/addcustscheme", {
                  state: { CustUUid: CustUUid },
                });
              }}
            />{" "}
          </BiSepBox>
          <Divider />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box
            component={"form"}
            onSubmit={SubmitHandler}
            //onChange={HandleChange}
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              width: "100%",
              ml: 2,
            }}
          >
            <Grid container columnGap={3} rowGap={3} maxWidth={"xxxl"}>
              {Edit ? (
                <>
                  <Grid item lg={2.7} md={5.7} sm={12} xs={12}>
                    <ReusableDropDown3
                      label={"Scheme"}
                      data={Scheme}
                      id={"Scheme"}
                      ObjectKey={["SchemeTitle"]}
                      uniquekey={"SUUid"}
                      state={obj}
                      handleChange={ManageFrequency}
                    />
                  </Grid>
                  <Grid item lg={2.7} md={5.7} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      id="SchemeTitle"
                      name="SchemeTitle"
                      label="SchemeTitle"
                      disabled={true}
                      fullWidth
                      value={SchemeData?.SCHEMETITLE || ""}
                      onChange={HandleChange}
                      type="text"
                      variant="outlined"
                      inputProps={{ maxLength: 6 }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item lg={2.7} md={5.7} sm={12} xs={12}>
                  <TextField
                    size="small"
                    id="SchemeTitle"
                    name="SchemeTitle"
                    label="SchemeTitle"
                    fullWidth
                    disabled={true}
                    value={SchemeData?.SCHEMETITLE}
                    type="text"
                    variant="outlined"
                    inputProps={{ maxLength: 6 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
              {!Edit ? (
                <Grid item lg={2.7} md={5.7} sm={12} xs={12}>
                  <TextField
                    size="small"
                    id="frequency"
                    name="frequency"
                    label="EMI Frequency"
                    fullWidth
                    disabled={true}
                    value={SchemeData?.frequency}
                    type="text"
                    variant="outlined"
                    inputProps={{ maxLength: 50 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item lg={2.7} md={5.7} sm={12} xs={12}>
                    <ReusableDropDown4
                      label={"EMI frequency"}
                      data={freq}
                      id={"frequency"}
                      ObjectKey={["frequency"]}
                      Field={obj?.frequency}
                      uniquekey={"frequency"}
                      onChange={HandleChange}
                    />
                  </Grid>
                  <Grid item lg={2.7} md={5.7} sm={12} xs={12} mt={1}>
                    <TextField
                      size="small"
                      id="frequency"
                      name="frequency"
                      label="frequency"
                      disabled={true}
                      fullWidth
                      value={SchemeData?.frequency}
                      type="text"
                      variant="outlined"
                      inputProps={{ maxLength: 50 }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </>
              )}
              <Grid item lg={2.7} md={5.7} sm={12} xs={12}>
                <TextField
                  size="small"
                  name="EMI"
                  label="EMI"
                  fullWidth
                  disabled={!Edit}
                  value={obj?.EMI || ""}
                  type="number"
                  variant="outlined"
                  inputProps={{ maxLength: 6 }}
                  id="outlined-adornment-weight"
                  endAdornment={
                    <InputAdornment position="end">₹</InputAdornment>
                  }
                  InputLabelProps={{ shrink: true }}
                  onChange={HandleChange}
                />
              </Grid>
              <Grid item lg={2.7} md={5.7} sm={12} xs={12}>
                <TextField
                  size="small"
                  id="Nomineename"
                  name="Nomineename"
                  label="Nominee Name"
                  fullWidth
                  disabled={!Edit}
                  value={obj?.Nomineename || ""}
                  type="text"
                  variant="outlined"
                  inputProps={{ maxLength: 50 }}
                  InputLabelProps={{ shrink: true }}
                  error={!input?.Nomineename}
                  onChange={(e) => {
                    console.log(e.target.value);
                    HandleChange(e);
                    console.log(SchemeData?.Nomineename, obj?.Nomineename);
                    if (e.target.value == "") {
                      setInput({ ...input, ["Nomineename"]: true });
                    } else {
                      var res = AlphabetOnly(e.target.value);
                      setInput({ ...input, ["Nomineename"]: res });
                    }
                  }}
                />
                {!input?.Nomineename ? (
                  <FormHelperText error>
                    Name must not contain space at first place, number or
                    special character
                  </FormHelperText>
                ) : null}
              </Grid>
              {/* <Grid item lg={2.7} md={5.7} sm={12} xs={12}>
                <TextField
                  size="small"
                  id="NomineePhone"
                  name="NomineePhone"
                  label="NomineePhone"
                  disabled={!Edit}
                  value={obj?.NomineePhone || ""}
                  fullWidth
                  type="text"
                  variant="outlined"
                  inputProps={{ maxLength: 10 }}
                  InputLabelProps={{ shrink: true }}
                  error={!input?.NomineePhone}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["NomineePhone"]: true });
                    } else {
                      var res = PhnoValidation(e.target.value);
                      setInput({ ...input, ["NomineePhone"]: res });
                    }
                    HandleChange(e);
                  }}
                />
                {!input?.NomineePhone ? (
                  <FormHelperText error>
                    Phone Number should start from 6 to 9
                  </FormHelperText>
                ) : null}
              </Grid> */}
              <Grid item lg={2.7} md={5.7} sm={12} xs={12}>
                <TextField
                  size="small"
                  id="Relation"
                  name="Relation"
                  label="Relation"
                  disabled={!Edit}
                  value={!Edit ? SchemeData?.Relation : null}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  inputProps={{ maxLength: 25 }}
                  error={!input?.Relation}
                  onChange={(e) => {
                    if (e.target.value == "") {
                      setInput({ ...input, ["Relation"]: true });
                    } else {
                      var res = AlphabetOnly(e.target.value);
                      setInput({ ...input, ["Relation"]: res });
                    }
                    HandleChange(e);
                  }}
                />
                {!input?.Relation ? (
                  <FormHelperText error>
                    Relation must contain alphabet only.
                  </FormHelperText>
                ) : null}
              </Grid>{" "}
              <Grid item lg={2.7} md={5.7} sm={12} xs={12} color={"black"}>
                <TextField
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  id="NomineeDOB"
                  name="NomineeDOB"
                  disabled={!Edit}
                  value={obj?.NomineeDOB || ""}
                  fullWidth
                  variant="outlined"
                  type="Date"
                  label="Date of Birth"
                  inputProps={{ max: nomAge }}
                  onChange={HandleChange}
                />
              </Grid>
              {!Edit ? (
                <Grid item lg={2.7} md={5.7} sm={12} xs={12}>
                  <TextField
                    size="small"
                    disabled={true}
                    value={SchemeData?.NomineeIdProofType}
                    id="NomineeIdProofType"
                    name="NomineeIdProofType"
                    label="Nominee's IdProof Type"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ maxLength: 20 }}
                  />{" "}
                </Grid>
              ) : (
                <>
                  <Grid
                    item
                    lg={2.7}
                    md={5.7}
                    sm={12}
                    xs={12}
                    sx={{
                      mt: {
                        lg: -1,
                        md: -1,
                      },
                    }}
                  >
                    <ReusableDropDown3
                      label={"Nominee's Id Proof Type"}
                      data={[
                        { NomineeIdProofType: "Aadhaar Card" },
                        { NomineeIdProofType: "Voter Card" },
                        { NomineeIdProofType: "Passport" },
                        { NomineeIdProofType: "Driving Licence" },
                        //{ NomineeIdProofType: "Pan Card" },
                      ]}
                      id={"NomineeIdProofType"}
                      ObjectKey={["NomineeIdProofType"]}
                      uniquekey={"NomineeIdProofType"}
                      setState={setobj}
                      state={obj}
                      handleChange={ManageIdProofNumberDD}
                    />
                  </Grid>
                  <Grid item lg={2.7} md={5.7} sm={12} xs={12}>
                    <TextField
                      size="small"
                      disabled={true}
                      fullWidth
                      value={SchemeData?.NomineeIdProofType}
                      id="NomineeIdProofType"
                      name="NomineeIdProofType"
                      label="Nominee's IdProof Type"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ maxLength: 20 }}
                    />
                  </Grid>
                </>
              )}
              {!Edit ? (
                <Grid
                  item
                  lg={2.7}
                  md={5.7}
                  sm={12}
                  xs={12}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                  }}
                >
                  <TextField
                    size="small"
                    disabled={true}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ maxLength: 20 }}
                    value={SchemeData?.NomineeIdProofNumber}
                    id="NomineeIdProofNumber"
                    name="NomineeIdProofNumber"
                    label="Nominee's IdProof Number"
                    variant="outlined"
                  />
                </Grid>
              ) : (
                <>
                  <Grid item lg={2.7} md={5.7} sm={12} xs={12}>
                    <TextField
                      size="small"
                      id="NomineeIdProofNumber"
                      value={obj?.NomineeIdProofNumber || ""}
                      name="NomineeIdProofNumber"
                      label="Nominee's IdProof Number"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        maxLength: getMaxLengthForIDProof(
                          obj?.NomineeIdProofType
                        ),
                      }}
                      error={!input?.NomineeIdProofNumber}
                      fullWidth
                      onChange={(e) => {
                        if (e.target.value == "") {
                          setInput({
                            ...input,
                            ["NomineeIdProofNumber"]: true,
                          });
                        } else {
                          var res = IdProofValidation2(e.target.value);
                          setInput({
                            ...input,
                            ["NomineeIdProofNumber"]: res,
                          });
                        }
                        HandleChange(e);
                      }}
                    />
                    {!input?.NomineeIdProofNumber ? (
                      <FormHelperText error>
                        Enter Correct IdProof Number
                      </FormHelperText>
                    ) : null}
                  </Grid>
                </>
              )}
              {!Edit ? null : (
                <>
                  <Grid
                    item
                    lg={12}
                    sm={12}
                    md={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      mt: 0,
                    }}
                  >
                    <Button
                      color="success"
                      variant="contained"
                      type="submit"
                      disabled={
                        !(
                          input?.NomineeIdProofNumber &&
                          // input?.NomineePhone &&
                          input?.Nomineename &&
                          input?.Relation
                        )
                      }
                    >
                      Edit
                    </Button>
                  </Grid>
                </>
              )}
              <Grid item xs={12} sm={12} md={12} lg={12} color={"black"}>
                <Box
                  id="picform"
                  component={"form"}
                  encType="multipart/form-data"
                  method="POST"
                >
                  <PictureInspection2
                    data={SchemeData}
                    Image={Photos}
                    label={"Nominee ID Proof Details"}
                    state={EditPic}
                    setState={setEditPic}
                    Edit={Edit}
                    reload={datetime}
                    HandleChange={HandleEditPic}
                  />
                  <br />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      visibility: Edit ? "visible" : "hidden",
                    }}
                  >
                    <Button
                      onClick={SubmitPic}
                      variant="outlined"
                      color="success"
                      disabled={
                        !(
                          EditPic?.NomineeIdProofPhoto ||
                          EditPic?.NomineePhoto ||
                          EditPic?.Nomineesignature
                        ) && Edit == true
                      }
                    >
                      Edit ID Proof
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
export default EditSchemeReg;
