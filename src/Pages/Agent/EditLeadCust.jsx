import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";

import {
  Grid,
  TextField,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  FormHelperText,
  FormControl,
  Divider,
  Modal,
} from "@mui/material";

import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import ReusableDropDown3 from "../../Components/Global/ReusableDropDown3";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";
import OnOffButton from "../../Components/Global/OnOffButton";
import BiSepBox from "../../Components/styledComponent/BiSepBox";
import CenterBox from "../../Components/styledComponent/CenterBox";
import Loader from "../../Components/Global/loader";

import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AlphabetOnly from "../../Apps/GlobalFunctions/AlphabetOnly";
import EmailValidation from "../../Apps/GlobalFunctions/EmailValidation";
import PhnoValidation from "../../Apps/GlobalFunctions/PhnoValidation";

import {
  LeadCustList,
  ClearState26,
} from "../../Slice/PortableCustomer/PortableCustListSlice";
import {
  ClearState34,
  LeadEditfunc,
} from "../../Slice/PortableCustomer/LeadEditSlice";

import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchAcode from "../../Apps/CustomHook/useFetchAcode";
import useFetchBranch from "../../Apps/CustomHook/useFetchBranch";
import useFetchArea from "../../Apps/CustomHook/useFetchArea";
import { useMemo } from "react";

export default function EditLeadCust() {
  let CurrentDate = moment().format("YYYY-MM-DD");
  const dispatch = useDispatch();
  const [rawData, setRawData] = useState({
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
  const [Edit, setEdit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { Leadid } = location.state;
  const [input, setInput] = useState({
    CustomerName: true,
    phn: true,
    Email: true,
  });

  //global logger details
  const { userInfo, global } = UseFetchLogger();

  //area
  const { AreaList } = useFetchArea({ Status: 1 });

  //branch
  const { branch } = useFetchBranch({ status: 1 }, [], "");

  //agent
  const { AgentCode } = useFetchAcode(
    {
      Status: 1,
      BranchId: rawData?.BranchId,
    },
    [rawData?.BranchId],
    "BranchId"
  );

  //Lead Leadcust List
  const { isloading26, LeadCustData, error26, isError26, isSuccess26 } =
    useSelector((state) => state.leadCustList);

  //Edit Lead
  const { isloading34, Resp34, error34, isError34, isSuccess34 } = useSelector(
    (state) => state.LeadEdit
  );

  //lead cust list
  useEffect(() => {
    if (Leadid) {
      var lid = { LeadId: Leadid };
      var finalobj = { ...global, ...lid };
      dispatch(LeadCustList(finalobj));
    }
  }, [isSuccess34, Leadid]);

  let prevData = useMemo(() => {
    if (LeadCustData[0]?.CustomerID == Leadid) {
      return LeadCustData[0];
    }
    else {
      return {
        CustomerName: null,
        PhoneNumber: null,
        EmailId: null,
        Address: null,
        Sex: null,
        AreaID: null,
        BranchId: null,
        AgentCode: null,
        FollowUpDate: null,
      };
    }
  }, [isSuccess34, isSuccess26, LeadCustData[0]?.CustomerID, dispatch, Edit]);

  useEffect(() => {
    // Set a timeout to check the condition after 5 minutes (300,000 milliseconds)
    const timer = setTimeout(() => {
      if (LeadCustData.length === 0) {
        navigate("/executive/manageleads");
      }
    }, 2000);
    // Cleanup the timeout if the component unmounts or if prevData changes
    return () => clearTimeout(timer);
  }, [prevData, navigate, isSuccess34]);

  //Lead Edit toaster
  useEffect(() => {
    if (isSuccess34 && !isloading34) {
      toast.success(`${Resp34}`, { positions: toast.POSITION.TOP_RIGHT });
      setInput({
        CustomerName: true,
        phn: true,
        Email: true,
      });
      setEdit(false);
      dispatch(ClearState34());
    }
    if (isError34 && !isloading34) {
      toast.error(`${error34}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState34());
    }
  }, [isSuccess34, isError34]);

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
          [key]: "",
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
      if (
        rawData[key] !== null &&
        rawData[key] !== undefined &&
        rawData[key] !== ""
      ) {
        acc[key] = rawData[key];
      }
      return acc;
    }, {});
    if (global?.Utype === 1) {
      finalobj.SuperUserID = userInfo?.details?.SuperUserID;
      finalobj.AgentCode = rawData?.AgentCode || prevData?.AgentCode;
    } else if (global?.Utype === 2) {
      finalobj.SuperUserID = userInfo?.details?.SuperUserID;
      finalobj.AgentCode = userInfo?.details?.AgentCode;
    }

    var Obj = { ...finalobj, ...global, CustomerID: Leadid };
    dispatch(LeadEditfunc(Obj));
  };

  function SendRawDatafunc(e) {
    e.preventDefault();
    var obj = { LeadId: prevData?.CustomerID };
    var a = { ...prevData, ...obj };
    navigate("/executive/customerregistration", { state: a });
  }

  const ManageDropDown = (e) => {
    let value = e.target.value;
    //console.log("hi");
    if (rawData?.BranchId !== null && rawData?.BranchId !== value) {
      setRawData({ ...rawData, AgentCode: null, BranchId: value });
    } else {
      setRawData({ ...rawData, BranchId: value });
    }
  };

  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Leads")[0];
  var CustRegPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Customer")[0];

  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (isloading26 || isloading34) {
      setOpen(true);
    } else {
      if (
        Object.keys(prevData).length !== 0 &&
        Leadid !== null &&
        Leadid !== undefined &&
        prevData?.CustomerID == Leadid
      ) {
        //console.log("in leadid check true");
        setRawData({
          CustomerName: prevData?.CustomerName,
          PhoneNumber: prevData?.PhoneNumber,
          EmailId: prevData?.EmailId,
          Address: prevData?.Address,
          Sex: prevData?.Sex,
          AreaID: prevData?.AreaID,
          BranchId: prevData?.BranchId,
          AgentCode: prevData?.AgentCode,
          FollowUpDate: prevData?.FollowUpDate,
        });
        setOpen(false);
      } else {
        //console.log("in leadid check false");
        setOpen(true);
      }
    }
    //console.log(isloading34, isloading26);
  }, [isloading34, isloading26, prevData, Leadid]);
  //console.log("open:", open);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Grid container maxWidth={"xl"} ml={2} mt={5}>
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
        md={12}
        lg={12}
        sm={12}
        xs={12}
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
              title: "Manage Leads",
              link:myPermission?.ViewPage == 1 ? "/executive/manageleads" : "#",
              icon: "browser_updated",
            },
            {
              title: "Edit Leads",
              link: "#",
              icon: "update",
            },
          ]}
        />
      </Grid>
      <Grid item md={12} lg={12} sm={12} xs={12}>
        <Divider />
        <BiSepBox>
          <Typography variant="h6" color={"#000000"}>
            Lead Edit Form
          </Typography>
          {myPermission?.Edit == 1 ? (
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
                setRawData({
                  CustomerName: prevData?.CustomerName,
                  PhoneNumber: prevData?.PhoneNumber,
                  EmailId: prevData?.EmailId,
                  Address: prevData?.Address,
                  Sex: prevData?.Sex,
                  AreaID: prevData?.AreaID,
                  BranchId: prevData?.BranchId,
                  AgentCode: prevData?.AgentCode,
                  FollowUpDate: moment(prevData?.FollowUpDate).format(
                    "YYYY-MM-DD"
                  ),
                });
                setEdit(!Edit);
              }}
              funcTrigger2={() => {
                navigate("/executive/manageleads");
              }}
            />
          ) : null}
        </BiSepBox>
        <Divider />
      </Grid>
      <Grid item md={12} lg={12} sm={12} xs={12} mt={3}>
        <Box
          component="form"
          id="EditLeads"
          //onChange={onChangeHandler}
          onSubmit={OnSubmitHandler}
        >
          <Grid container rowGap={2} columnGap={5}>
            <Grid item lg={5.5} md={5.2} sm={12} xs={12}>
              <TextField
                size="small"
                required
                value={rawData?.CustomerName || ""}
                disabled={!Edit}
                InputLabelProps={{ shrink: true }}
                id="CustomerName"
                name="CustomerName"
                label="Applicant's Name"
                fullWidth
                variant="outlined"
                inputProps={{ maxLength: 50 }}
                error={!input?.CustomerName}
                onChange={(e) => {
                  var res = AlphabetOnly(e.target.value);
                  setInput({ ...input, ["CustomerName"]: res });
                  onChangeHandler(e);
                }}
              />
              <FormHelperText
                error
                sx={{
                  visibility: input?.CustomerName ? "hidden" : "initial",
                }}
              >
                Name must not contain space at first place, number or special
                character
              </FormHelperText>
            </Grid>
            <Grid item lg={5.5} md={5.2} sm={12} xs={12}>
              <TextField
                size="small"
                required
                value={rawData?.PhoneNumber || ""}
                disabled={!Edit}
                InputLabelProps={{ shrink: true }}
                id="PhoneNumber"
                name="PhoneNumber"
                label="Phone Number"
                fullWidth
                type="tel"
                error={!input?.phn}
                inputProps={{ maxLength: 10 }}
                onChange={(e) => {
                  var res = PhnoValidation(e.target.value);
                  setInput({ ...input, ["phn"]: res });
                  onChangeHandler(e);
                }}
                variant="outlined"
              />
              <FormHelperText
                error
                sx={{
                  visibility: input?.phn ? "hidden" : "initial",
                }}
              >
                Phone Number must contain only number.
              </FormHelperText>
            </Grid>
            <Grid item lg={5.5} md={5.2} sm={12} xs={12}>
              <TextField
                size="small"
                required
                value={rawData?.EmailId || ""}
                disabled={!Edit}
                InputLabelProps={{ shrink: true }}
                id="EmailId"
                name="EmailId"
                label="Email ID"
                fullWidth
                variant="outlined"
                type="email"
                inputProps={{ maxLength: 40 }}
                error={!input?.Email}
                onChange={(e) => {
                  var res = EmailValidation(e.target.value);
                  setInput({ ...input, ["Email"]: res });
                  onChangeHandler(e);
                }}
              />
              <FormHelperText
                error
                sx={{
                  visibility: input?.Email ? "hidden" : "initial",
                }}
              >
                Enter a valid Email ID
              </FormHelperText>
            </Grid>
            <Grid item lg={5.5} md={5.2} sm={12} xs={12} mt={-2}>
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
                      value={rawData?.Sex || ""}
                    >
                      <FormControlLabel
                        value="Female"
                        control={
                          <Radio
                            value="Female"
                            disabled={!Edit}
                            InputLabelProps={{ shrink: true }}
                            name="Sex"
                            checked={rawData?.Sex == "Female" ? true : false}
                            inputProps={{ "aria-label": "Female" }}
                            onChange={onChangeHandler}
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
                            checked={rawData?.Sex == "Male" ? true : false}
                            inputProps={{ "aria-label": "Male" }}
                            onChange={onChangeHandler}
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
                  value={prevData?.Sex}
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
            <Grid
              item
              lg={5.5}
              md={5.2}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <TextField
                label="FollowUp Date"
                size="small"
                type="date"
                fullWidth
                name="FollowUpDate"
                inputProps={{ Min: CurrentDate }}
                disabled={!Edit ? true : false}
                InputLabelProps={{ shrink: true }}
                value={moment(rawData?.FollowUpDate).format("YYYY-MM-DD") || ""}
                onChange={onChangeHandler}
              />
            </Grid>
            {!Edit ? (
              <>
                <Grid item lg={5.5} md={5.2} sm={12} xs={12}>
                  <TextField
                    size="small"
                    value={`${prevData?.AreaName}`}
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    id="AreaName_arial"
                    label="AreaName "
                    fullWidth
                    variant="outlined"
                    type="text"
                    inputProps={{ maxLength: 40 }}
                  />
                </Grid>

                <Grid item lg={5.5} md={5.2} sm={12} xs={12} mt={2}>
                  <TextField
                    size="small"
                    value={`${prevData?.BranchName} : ${prevData?.BranchCode}`}
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    id="Branch"
                    label="Branch"
                    fullWidth
                    variant="outlined"
                    type="text"
                    inputProps={{ maxLength: 40 }}
                  />
                </Grid>

                <Grid item lg={5.5} md={5.2} sm={12} xs={12} mt={2.5}>
                  <TextField
                    size="small"
                    value={`${prevData?.AgentCode} : ${prevData?.Name}`}
                    disabled={true}
                    InputLabelProps={{ shrink: true }}
                    id="AgentCode"
                    name="AgentCode"
                    label="AgentCode "
                    fullWidth
                    variant="outlined"
                    type="text"
                    mt={1}
                    inputProps={{ maxLength: 40 }}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item lg={5.5} md={5.2} sm={12} xs={12} mt={-0.8}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ width: 250, mr: 2 }}>
                      <ReusableDropDown4
                        label={"Area*"}
                        data={AreaList || []}
                        id={"Lead_dropdown_Area"}
                        ObjectKey={["AreaName"]}
                        Field={rawData?.AreaID}
                        uniquekey={"AreaID"}
                        deselectvalue={false}
                        onChange={onChangeHandler}
                      />
                    </Box>
                    <Box mt={1}>
                      <TextField
                        label={"Area"}
                        size="small"
                        disabled={true}
                        value={prevData?.AreaName || ""}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item lg={5.5} md={5.2} sm={12} xs={12} mt={2}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ width: 250, mr: 2 }}>
                      <ReusableDropDown3
                        label={"Branch*"}
                        data={branch}
                        id={"Lead_dropdown_branch"}
                        ObjectKey={["BranchName", "BranchCode"]}
                        uniquekey={"BranchId"}
                        setState={setRawData}
                        state={rawData}
                        handleChange={ManageDropDown}
                      />
                    </Box>
                    <Box mt={1}>
                      <TextField
                        label={"Branch"}
                        size="small"
                        disabled={true}
                        value={
                          `${prevData?.BranchName} : ${prevData?.BranchCode}` ||
                          ""
                        }
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item lg={5.5} md={5.2} sm={12} xs={12} mt={2}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ width: 250, mr: 2 }}>
                      <ReusableDropDown4
                        label={"Agent Code*"}
                        data={AgentCode}
                        id={"Lead_dropdown_agent"}
                        disabled={rawData?.BranchId ? false : true}
                        ObjectKey={["Name", "AgentCode"]}
                        Field={rawData?.AgentCode}
                        uniquekey={"AgentCode"}
                        deselectvalue={false}
                        onChange={onChangeHandler}
                      />
                    </Box>
                    <Box mt={1}>
                      <TextField
                        label={"Agent"}
                        size="small"
                        disabled={true}
                        value={`${prevData?.AgentCode} : ${prevData?.Name}`}
                      />
                    </Box>{" "}
                  </Box>
                </Grid>
              </>
            )}
            <Grid item lg={12} md={12} sm={12} xs={12} mt={1}>
              <TextField
                value={rawData?.Address || ""}
                disabled={!Edit}
                InputLabelProps={{ shrink: true }}
                name="Address"
                id="Address"
                label="Address"
                fullWidth
                variant="outlined"
                multiline={true}
                rows={4}
                onChange={onChangeHandler}
              />
            </Grid>
          </Grid>
          <CenterBox>
            <OnOffButton
              yes={CustRegPermission?.Edit == 1 ? "Edit Lead Customer" : null}
              no={CustRegPermission?.Create == 1 ? "Convert to Customer" : null}
              type1={CustRegPermission?.Edit == 1 ? "submit" : null}
              type2={CustRegPermission?.Create == 1 ? "info" : null}
              disabled1={
                Edit == true &&
                (rawData?.CustomerName ||
                  rawData?.PhoneNumber ||
                  rawData?.EmailId ||
                  rawData?.Address ||
                  rawData?.Sex ||
                  rawData?.FollowUpDate > CurrentDate ||
                  rawData?.AreaID ||
                  (rawData?.BranchId && rawData?.AgentCode)) &&
                input?.CustomerName == true &&
                input?.phn == true &&
                input?.Email == true
                  ? false
                  : true
              }
              disabled2={Edit}
              functrigger1={
                CustRegPermission?.Edit == 1 ? OnSubmitHandler : null
              }
              functrigger2={
                CustRegPermission?.Create == 1 ? SendRawDatafunc : null
              }
              theme1={CustRegPermission?.Edit == 1 ? "secondary" : null}
              theme2={CustRegPermission?.Create == 1 ? "info" : null}
            />
          </CenterBox>
        </Box>
      </Grid>
    </Grid>
  );
}
