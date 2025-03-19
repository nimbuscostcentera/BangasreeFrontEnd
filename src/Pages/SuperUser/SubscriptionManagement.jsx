import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { WorkspacePremium } from "@mui/icons-material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Popover from "@mui/material/Popover";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Typography,
  Alert,
  AlertTitle,
  Stack,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/system";
import {
  GRID_CHECKBOX_SELECTION_COL_DEF,
} from "@mui/x-data-grid";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import GenCertificateIcon from "../../Components/styledComponent/GenCertificateIcon";
import VerifiedIcon from "@mui/icons-material/Verified";
import BackspaceIcon from "@mui/icons-material/Backspace";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

import IconOnOffButton from "../../Components/Global/IconOnOffButton";
import ReusableDataTable from "../../Components/Global/ReusableTable";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import ReusableDialogue from "../../Components/Global/ReusableDialogue";
import SingleIconButton from "../../Components/Global/SingleIconButton";

import { CollectionList } from "../../Slice/Collection/CollectionListSlice";
import {
  MaturityUpdate,
  ClearState32,
} from "../../Slice/Collection/MaturityUpdateSlice";
import {
  ClearState33,
  BonusUpdate,
} from "../../Slice/Collection/BonusUpdateSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import moment from "moment/moment";
const CustomTheme = createTheme({
  breakpoints: {
    keys: ["xxs", "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"],
    values: {
      xxs: 100,
      xs: 200,
      sm: 475,
      mid: 550,
      md: 813,
      lg: 970,
      l: 1060,
      xl: 1175,
      xxl: 1210,
      xxxl: 1345,
      Big: 1500,
    },
  },
});

function SubscriptionManagement() {
  const location = useLocation();
  const {
    AgentCode = null,
    BranchId = null,
    AreaID = null,
    MaturityStatus: ms = null,
  } = location.state || {};
  const navigate = useNavigate();
  const [alert, setalert] = useState(false);
  const [warning, setwarning] = useState("");
  const [disbool, setDisBool] = useState(false); //for multiple id selection
  const [disbool2, setDisBool2] = useState(false); //for restrict further edit on premature and mature account
  const [disbool3, setDisBool3] = useState(false); // for restrict further edit on deactivated maturity account
  const [disbool4, setDisBool4] = useState(true); //0 selection
  const [checkedDues, setChekedDues] = useState(false);
  const [CId, setCId] = useState([]);
  const [openPrompt1, setOpenPrompt1] = useState(false);
  const [openPrompt2, setOpenPrompt2] = useState(false);
  const [openPrompt3, setOpenPrompt3] = useState(false);
  const [comment, setComment] = useState({ Comment: "" });
  const [CollectionDetails, setCollectionDetails] = useState([]);
  const [Filters, setFilters] = useState({
    MaturityStatus: ms || null,
    BonusStatus: null,
    AgentCode: AgentCode || null,
    BranchId: BranchId || null,
    AreaID: AreaID || null,
  });

  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [Pop, setPop] = useState(null);
  const [checkedMatured, setChekedMatures] = useState(false);

  const handlePopoverOpenMaturity = (event, params) => {
    setAnchorEl(event.currentTarget);
    setPop(params.row.MaturityComment);
  };
  const handlePopoverOpenBonus = (e, p) => {
    setAnchorEl(e.currentTarget);
    setPop(p.row.BonusComment);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPop(null);
  };

  const open = Boolean(anchorEl);

  //Collection List for Table
  const { isloading23, Response, isSuccess23 } = useSelector(
    (state) => state.CollectionList
  );

  //Maturity Update
  const { isloading32, Resp32, isError32, error32, isSuccess32 } = useSelector(
    (state) => state.maturity
  );

  //Bonus Update
  const { Resp33, error33, isError33, isSuccess33 } = useSelector(
    (state) => state.bonus
  );

  //auth
  const { userInfo, global } = UseFetchLogger();

  //alert
  useEffect(() => {
    if (CId && CId.length > 1) {
      setDisBool(true);
      setwarning(warning + " Select 1 record for further execution.");
      setalert(true);
    } else if (CId == undefined || CId.length == 0) {
      setalert(false);
      setwarning("");
      setDisBool(false);
      setDisBool2(false);
      setDisBool3(false);
      setDisBool4(true);
    } else if (CId && CId.length == 1) {
      setDisBool(false);
      setDisBool4(false);
      var p = CollectionDetails.filter((i) => i?.SchemeRegId == CId);
      if (p[0]?.MaturityStatus == 3 || p[0]?.MaturityStatus == 2) {
        setDisBool2(true);
        setalert(true);
        setwarning(
          warning +
            "Matured and Prematured Account can not be further edited But You Can Generate Certificate."
        );
      } else if (p[0]?.MaturityStatus === 0) {
        setDisBool3(true);
        setalert(true);
        setwarning(
          warning +
            "Deactivated Maturity Account can not be Mature or Premature.Also Bonus is not Applied to this account"
        );
      } else {
        setDisBool3(false);
        setDisBool2(false);
        setalert(false);
        setwarning("");
      }
    }
  }, [CId]);

  //Collection List
  useEffect(() => {
    var obj = {};
    if (userInfo?.details?.Utype == 2) {
      obj.AgentCode = userInfo?.details?.AgentCode;
    }
    if (checkedMatured === false) {
      dispatch(CollectionList({ ...global, ...Filters, ...obj }));
    } else {
      var obj1 = { TimeToMature: 1 };
      dispatch(CollectionList({ ...global, ...Filters, ...obj, ...obj1 }));
    }
  }, [Filters, isError32, isSuccess32, isError33, isSuccess33, checkedMatured]);

  //collection data
  useEffect(() => {
    if (isSuccess23 && !isloading23) {
      if (checkedDues) {
        var data = Response.filter((item) => item?.red === 1);

        setCollectionDetails(data);
      } else {
        setCollectionDetails(Response);
      }
    }
  }, [
    isSuccess23,
    Filters,
    isSuccess32,
    isSuccess33,
    checkedDues,
    checkedMatured,
  ]);

  useEffect(() => {
    //toaster on Update of Maturity
    if (isSuccess32 && !isloading32) {
      toast.success(`Maturity Status ${Resp32}`, {
        positions: toast.POSITION.TOP_RIGHT,
      });
      dispatch(ClearState32());
    }
    if (isError32 && !isloading32) {
      toast.error(`${error32}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState32());
    }

    //toaster on Update of bonus
    if (isSuccess33) {
      toast.success(`Bonus Status ${Resp33}`, {
        positions: toast.POSITION.TOP_RIGHT,
      });
      dispatch(ClearState33());
    }
    if (isError33) {
      toast.error(`${error33}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState33());
    }
    dispatch(ClearState33());
  }, [isSuccess32, isError32, isSuccess33, isError33]);

  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Subscriptions")[0];

  //active maturity
  const ApprovedMaturityStatusHandler = () => {
    if (CId && CId.length == 1) {
      const UserData = { Status: 1, SchemeRegId: CId[0] };
      dispatch(MaturityUpdate({ ...UserData, ...global }));
    }
  };
  //reject maturity
  function RejectMaturityStatus() {
    if (CId && CId.length == 1) {
      const UserData = { Status: 0, SchemeRegId: CId[0], ...comment };

      dispatch(MaturityUpdate({ ...UserData, ...global }));
      setOpenPrompt1(false);
    }
  }
  //mature
  function OnMaturedFunc() {
    const UserData = { Status: 3, SchemeRegId: CId[0], ...comment };

    dispatch(MaturityUpdate({ ...UserData, ...global }));
  }
  //premature
  function OnPreMaturedFunc() {
    const UserData = { Status: 2, SchemeRegId: CId[0], ...comment };

    dispatch(MaturityUpdate({ ...UserData, ...global }));
    setOpenPrompt3(false);
  }
  //active bonus
  const ApprovedBonusStatusHandler = () => {
    const UserData = { Status: true, SchemeRegId: CId[0], ...comment };
    dispatch(BonusUpdate({ ...UserData, ...global }));
  };
  //reject bonus
  function RejectBonusStatus() {
    const UserData = { Status: 0, SchemeRegId: CId[0], ...comment };

    dispatch(BonusUpdate({ ...UserData, ...global }));
    setOpenPrompt2(false);
  }

  const columns = [
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      hideable: false,
    },
    {
      field: `CustomerAccNo`,
      headerName: "Account No.",
      width: 170,
      hideable: false,
    },
    {
      field: `CustomerName`,
      headerName: "Customer Name",
      width: 168,
    },
    {
      field: `AgentCode`,
      headerName: "Agent Code",
      width: 100,
    },
    { field: `SchemeTitle`, headerName: "Scheme", width: 165 },

    {
      field: `amttobepaid`,
      headerName: "Payable Amt",
      width: 120,
      renderCell: (item) => {
        return <Typography> ₹ {item.row.amttobepaid || 0} /-</Typography>;
      },
    },
    {
      field: `totcolection`,
      headerName: "Collected Amt",
      hideable: false,
      width: 120,
      renderCell: (item) => {
        return <Typography> ₹ {item.row.totcolection || 0} /-</Typography>;
      },
    },
    {
      field: `RedeemAmt`,
      headerName: "Redeem Amt",
      hideable: false,
      width: 120,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.MaturityStatus === 2 ||
            item?.row?.MaturityStatus === 3 ? (
              <Typography> ₹ {item?.row?.RedeemAmt || 0} /-</Typography>
            ) : (
              "N/A"
            )}
          </>
        );
      },
    },
    {
      field: "StartDate",
      headerName: "Start Date",
      width: 90,
      renderCell: (pramas) => {
        return <span>{moment(pramas.row.StartDate).format("DD/MM/YYYY")}</span>;
      },
    },
    {
      field: "EndDate",
      headerName: "End Date",
      width: 90,
      renderCell: (pramas) => {
        return <span>{moment(pramas.row.EndDate).format("DD/MM/YYYY")}</span>;
      },
    },
    {
      field: `MaturityStatus`,
      headerName: "Maturity",
      hideable: false,
      width: 100,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.MaturityStatus === 1 ? (
              <Typography>Active</Typography>
            ) : item?.row?.MaturityStatus === 3 ? (
              <Typography>Matured</Typography>
            ) : item?.row?.MaturityStatus === 2 ? (
              <>
                <Typography
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={(e) => {
                    handlePopoverOpenMaturity(e, item);
                  }}
                  onMouseLeave={handlePopoverClose}
                >
                  Premature
                </Typography>{" "}
              </>
            ) : item?.row?.MaturityStatus === 0 ? (
              <>
                <Typography
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={(e) => {
                    handlePopoverOpenMaturity(e, item);
                  }}
                  onMouseLeave={handlePopoverClose}
                >
                  Inactive
                </Typography>{" "}
              </>
            ) : null}
          </>
        );
      },
    },
    {
      field: `BonusStatus`,
      headerName: "Bonus",
      hideable: false,
      width: 100,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.BonusStatus == 1 ? (
              <Typography>Active</Typography>
            ) : item?.row?.BonusStatus == 0 ? (
              <>
                <Typography
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={(e) => {
                    handlePopoverOpenBonus(e, item);
                  }}
                  onMouseLeave={handlePopoverClose}
                >
                  InActive
                </Typography>
              </>
            ) : (
              <Typography>Processing</Typography>
            )}
          </>
        );
      },
    },
  ];

  //handle filter
  const FilterHandler = (e) => {
    var key = e.target.name;
    var value = e.target.value;
    console.log(key, value);
    setFilters({ ...Filters, [key]: value });
  };

  return (
    <ThemeProvider theme={CustomTheme}>
      <Grid
        container
        maxWidth={"l"}
        ml={2}
        mt={2}
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={{
          xl: "flex-start",
          lg: "flex-start",
          md: "flex-start",
          sm: "center",
          xs: "center",
        }}
        flexWrap={"wrap"}
      >
        {" "}
        <ToastContainer autoClose={8000} />
        <Grid
          item
          sm={12}
          xs={12}
          md={12}
          lg={12}
          display={"flex"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
        >
          <Box
            mr={3}
            mt={1}
            display={"flex"}
            justifyContent={{
              xxl: "flex-start",
              xl: "flex-start",
              lg: "flex-start",
              md: "flex-start",
              sm: "center",
              xs: "center",
            }}
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
                  title: "Manage Subscription",
                  link: "#",
                  icon: "manage_accounts",
                },
              ]}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: {
                xxl: "flex-end",
                xl: "flex-end",
                lg: "flex-end",
                md: "flex-end",
                sm: "flex-start",
                xs: "flex-start",
              },
              flexWrap: "wrap",
            }}
          >
            {myPermission?.ViewPage == 1 ? (
              <SingleIconButton
                icon1={
                  <WorkspacePremium color={disbool2 ? "success" : "disabled"} />
                }
                Tooltip1={"View Certificate"}
                h1={"View Certificate"}
                disable1={!disbool2 && !disbool4}
                funcTrigger1={() => {
                  console.log(CId[0]);

                  navigate("/superuser/viewcertificate", {
                    state: { SchemeRegId: CId[0] },
                  });
                }}
                textcolor1={disbool2 ? "green" : "grey"}
                mb={-1}
              />
            ) : null}
            {myPermission?.Create == 1 ? (
              <SingleIconButton
                icon1={
                  <GenCertificateIcon
                    color={disbool2 ? "success" : "disabled"}
                  />
                }
                Tooltip1={"Generate Certificate"}
                h1={"Generate Certificate"}
                disable1={!disbool2 && !disbool4}
                funcTrigger1={() => {
                  console.log(CId[0]);
                  let data = CollectionDetails?.filter(
                    (item) => item?.SchemeRegId === CId[0]
                  )[0];
                  if (data?.CertificateStatus == "Certificate Generated") {
                    setalert(true);
                    setwarning("Certificate already generated");
                  } else {
                    navigate("/superuser/generatecertificate", {
                      state: { SchemeRegId: CId[0] },
                    });
                  }
                }}
                mt1={1}
                textcolor1={disbool2 ? "green" : "grey"}
              />
            ) : null}
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Divider />
        </Grid>
        {alert ? (
          <Grid item md={12} sm={12} xs={12} lg={12} mt={2}>
            {" "}
            <Box display={"flex"} justifyContent={"space-between"}>
              <Stack sx={{ width: "100%" }} spacing={2}>
                <Alert
                  severity="error"
                  onClose={() => {
                    setalert(false);
                  }}
                >
                  <AlertTitle>Warning</AlertTitle>
                  {warning}
                </Alert>
              </Stack>
            </Box>
          </Grid>
        ) : null}
        {userInfo?.details?.Utype === 1 && myPermission?.Edit == 1 ? (
          <>
            <Grid
              item
              xs={12}
              sm={5.5}
              lg={2.4}
              md={3.8}
              pt={0.5}
              display={"flex"}
              justifyContent={{
                xxl: "flex-start",
                xl: "flex-start",
                lg: "flex-start",
                md: "center",
                sm: "center",
                xs: "center",
              }}
              flexWrap={"wrap"}
              pl={1}
            >
              <IconOnOffButton
                icon1={
                  <CheckCircleOutlineOutlinedIcon
                    fontSize="medium"
                    color={disbool4 || disbool2 ? "disabled" : "success"}
                  />
                }
                Tooltip1={"Activate Maturity"}
                textcolor1={disbool4 || disbool2 ? "grey" : "#1b5e20"}
                h1={"Activate Maturity"}
                disable1={disbool4 || disbool2}
                funcTrigger1={ApprovedMaturityStatusHandler}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={5.5}
              lg={2.8}
              md={4}
              display={"flex"}
              justifyContent={{
                xxl: "flex-start",
                xl: "flex-start",
                lg: "flex-start",
                md: "center",
                sm: "center",
                xs: "center",
              }}
              flexWrap={"wrap"}
            >
              <div
                style={{
                  paddingTop: "20px",
                }}
              >
                <ReusableDialogue
                  h1={"Deactivate Maturity"}
                  textcolor={
                    disbool || disbool4 || disbool2 || disbool3
                      ? "grey"
                      : "#c62828"
                  }
                  icon={
                    <CancelOutlinedIcon
                      fontSize="medium"
                      color={
                        disbool || disbool4 || disbool2 || disbool3
                          ? "disabled"
                          : "error"
                      }
                    />
                  }
                  title={"Confirm"}
                  reason={"Mention the reason below"}
                  b1={"submit"}
                  b2={"cancel"}
                  handleClickOpen={() => {
                    setOpenPrompt1(true);
                  }}
                  handleClose={() => {
                    setOpenPrompt1(false);
                  }}
                  open={openPrompt1}
                  setopen={setOpenPrompt1}
                  disabledId={disbool || disbool4 || disbool2 || disbool3}
                  TooltipMsg={"InActive Maturity Status"}
                  state={comment}
                  setState={setComment}
                  TextFieldName={"Comment"}
                  OnSubmit={RejectMaturityStatus}
                />{" "}
              </div>
            </Grid>
            <Grid
              item
              xxl={2.5}
              xl={2.5}
              lg={2.5}
              md={4}
              sm={5.5}
              xs={12}
              display={"flex"}
              justifyContent={{
                xxl: "flex-start",
                xl: "flex-start",
                lg: "flex-start",
                md: "center",
                sm: "center",
                xs: "center",
              }}
              flexWrap={"wrap"}
              pl={1}
            >
              <IconOnOffButton
                icon1={
                  <VerifiedIcon
                    fontSize="medium"
                    color={
                      disbool4 || disbool2 || disbool3 ? "disabled" : "success"
                    }
                  />
                }
                Tooltip1={"Activate Bonus"}
                h1={"Activate Bonus"}
                textcolor1={
                  disbool4 || disbool2 || disbool3 ? "grey" : "#1b5e20"
                }
                disable1={disbool4 || disbool2 || disbool3}
                funcTrigger1={ApprovedBonusStatusHandler}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={5.5}
              lg={2.4}
              md={3.8}
              pt={0.5}
              display={"flex"}
              justifyContent={{
                xxl: "flex-start",
                xl: "flex-start",
                lg: "flex-start",
                md: "center",
                sm: "center",
                xs: "center",
              }}
              flexWrap={"wrap"}
              pl={1}
            >
              <ReusableDialogue
                h1={"Deactivate Bonus"}
                textcolor={
                  disbool || disbool4 || disbool2 || disbool3
                    ? "grey"
                    : "#c62828"
                }
                icon={
                  <BackspaceIcon
                    fontSize="medium"
                    color={
                      disbool || disbool4 || disbool2 || disbool3
                        ? "disabled"
                        : "error"
                    }
                  />
                }
                title={"Confirm"}
                reason={"Mention the reason below"}
                b1={"submit"}
                b2={"cancel"}
                handleClickOpen={() => {
                  setOpenPrompt2(true);
                }}
                handleClose={() => {
                  setOpenPrompt2(false);
                }}
                open={openPrompt2}
                setopen={setOpenPrompt2}
                state={comment}
                setState={setComment}
                TextFieldName={"Comment"}
                disabledId={disbool || disbool4 || disbool2 || disbool3}
                TooltipMsg={"InActive Bonus Status"}
                OnSubmit={RejectBonusStatus}
              />
            </Grid>
            <Grid
              item
              xxl={2.5}
              xl={2.8}
              lg={2.8}
              md={3.8}
              sm={5.5}
              xs={12}
              display={"flex"}
              justifyContent={{
                xxl: "flex-start",
                xl: "flex-start",
                lg: "flex-start",
                md: "center",
                sm: "center",
                xs: "center",
              }}
              flexWrap={"wrap"}
            >
              <IconOnOffButton
                icon1={
                  <CheckCircleOutlineOutlinedIcon
                    fontSize="medium"
                    color={
                      disbool || disbool4 || disbool2 || disbool3
                        ? "disabled"
                        : "success"
                    }
                  />
                }
                textcolor1={
                  disbool || disbool4 || disbool2 || disbool3
                    ? "grey"
                    : "#1b5e20"
                }
                Tooltip1={"Matured Account"}
                h1={"Matured A/C."}
                disable1={disbool || disbool4 || disbool2 || disbool3}
                funcTrigger1={OnMaturedFunc}
              />
            </Grid>
            <Grid
              item
              xxl={2.5}
              xl={2.5}
              lg={2.5}
              md={3.8}
              sm={5.5}
              xs={12}
              display={"flex"}
              justifyContent={{
                xxl: "flex-start",
                xl: "flex-start",
                lg: "flex-start",
                md: "center",
                sm: "center",
                xs: "center",
              }}
              flexWrap={"wrap"}
              ml={1}
            >
              <ReusableDialogue
                h1={" Premature A/C."}
                icon={
                  <BackspaceIcon
                    fontSize="medium"
                    color={
                      disbool || disbool4 || disbool2 || disbool3
                        ? "disabled"
                        : "error"
                    }
                  />
                }
                textcolor={
                  disbool || disbool4 || disbool2 || disbool3
                    ? "grey"
                    : "#c62828"
                }
                title={"Confirm"}
                reason={"Mention the reason below"}
                b1={"submit"}
                b2={"cancel"}
                handleClickOpen={() => {
                  setOpenPrompt3(true);
                }}
                handleClose={() => {
                  setOpenPrompt3(false);
                }}
                open={openPrompt3}
                setopen={setOpenPrompt3}
                state={comment}
                setState={setComment}
                TextFieldName={"Comment"}
                disabledId={disbool || disbool4 || disbool2 || disbool3}
                TooltipMsg={"Premature Account"}
                OnSubmit={OnPreMaturedFunc}
              />
            </Grid>
          </>
        ) : null}
        <Grid
          item
          xxl={2}
          xl={2.2}
          lg={3}
          md={4}
          sm={6}
          xs={12}
          mt={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormGroup>
            <FormControlLabel
              label="Time to Mature"
              control={
                <Checkbox
                  onChange={() => {
                    setChekedMatures(!checkedMatured);
                  }}
                />
              }
              sx={{ color: "#000000", mt: 0.7 }}
            />
          </FormGroup>
        </Grid>
        <Grid
          item
          xxl={2}
          xl={2.2}
          lg={2.2}
          md={4}
          sm={6}
          xs={12}
          mt={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormGroup>
            <FormControlLabel
              label="Due Payments"
              control={
                <Checkbox
                  onChange={() => {
                    setChekedDues(!checkedDues);
                  }}
                />
              }
              sx={{ color: "#000000", mt: 0.7 }}
            />
          </FormGroup>
        </Grid>
        <Grid
          item
          xxl={2}
          xl={2.2}
          lg={2.2}
          md={4}
          sm={12}
          xs={12}
          mt={1.1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconOnOffButton
            h1={"Filter Out"}
            Tooltip1={"Filter Out"}
            icon1={<FilterAltOffIcon fontSize="small" />}
            funcTrigger1={() => {
              setCId([]);
              setFilters({
                MaturityStatus: "",
                BonusStatus: "",
              });
            }}
          />
        </Grid>
        <Grid
          item
          sm={5.5}
          xs={12}
          md={5}
          lg={2.5}
          pt={2.5}
          display={"flex"}
          justifyContent={"flex-end"}
          flexWrap={"wrap"}
          pl={3}
        >
          <ReusableDropDown4
            setState={setFilters}
            state={Filters}
            label={"Maturity Status"}
            data={[
              { value: "Inactive", MaturityStatus: 0 },
              { value: "Active", MaturityStatus: 1 },
              { value: "PreMatured", MaturityStatus: 2 },
              { value: "Matured", MaturityStatus: 3 },
            ]}
            id={"arial_status"}
            disabled={false}
            ObjectKey={["value"]}
            Field={Filters?.MaturityStatus}
            uniquekey={"MaturityStatus"}
            deselectvalue={true}
            onChange={FilterHandler}
          />
        </Grid>
        <Grid
          item
          sm={5.5}
          xs={12}
          md={5}
          lg={2.5}
          pt={2.5}
          display={"flex"}
          justifyContent={"flex-end"}
          flexWrap={"wrap"}
          pl={3}
        >
          <ReusableDropDown4
            setState={setFilters}
            state={Filters}
            label={"Bonus Status"}
            data={[
              { value: "Active", BonusStatus: 1 },
              { value: "InActive", BonusStatus: 0 },
            ]}
            id={"arial_bonus_status"}
            disabled={false}
            ObjectKey={["value"]}
            Field={Filters?.BonusStatus}
            uniquekey={"BonusStatus"}
            deselectvalue={true}
            onChange={FilterHandler}
          />
        </Grid>
        <Grid item sm={12} xs={12} md={12} mt={1}>
          <ReusableDataTable
            uniqueid={"SchemeRegId"}
            columns={columns}
            rows={CollectionDetails}
            state={CId}
            setState={setCId}
            RedMark={checkedMatured || checkedDues}
            isloading={isloading23}
            height={"90vh"}
          />
          {Pop === null ? null : (
            <>
              <Popover
                id="mouse-over-popover"
                sx={{
                  pointerEvents: "none",
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Typography sx={{ p: 1 }}>{Pop}</Typography>
              </Popover>
            </>
          )}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SubscriptionManagement;
