import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { WorkspacePremium } from "@mui/icons-material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Popover from "@mui/material/Popover";
import {
  FormGroup,
  FormControl,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Divider } from "@mui/material";
import { Box, Container, display, typography } from "@mui/system";
import { Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
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
import DateRangFilter from "../../Components/Global/DateRangeFilter";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import ReusableDialogue from "../../Components/Global/ReusableDialogue";
import SingleIconButton from "../../Components/Global/SingleIconButton";

import {
  CollectionList,
  ClearState23,
} from "../../Slice/Collection/CollectionListSlice";
import {
  MaturityUpdate,
  ClearState32,
} from "../../Slice/Collection/MaturityUpdateSlice";
import {
  ClearState33,
  BonusUpdate,
} from "../../Slice/Collection/BonusUpdateSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";

function SubscriptionManagement() {
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
    MaturityStatus: "",
    BonusStatus: "",
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
  const { isloading23, Response, isError23, error23, isSuccess23 } =
    useSelector((state) => state.CollectionList);

  //Maturity Update
  const { isloading32, Resp32, isError32, error32, isSuccess32 } = useSelector(
    (state) => state.maturity
  );

  //Bonus Update
  const { isloading33, Resp33, error33, isError33, isSuccess33 } = useSelector(
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
      width: 130,
      hideable: false,
    },
    {
      field: `CustomerName`,
      headerName: "Customer Name",
      width: 170,
    },
    {
      field: `AgentCode`,
      headerName: "Agent Code",
      width: 100,
    },
    { field: `SchemeTitle`, headerName: "Scheme", width: 120 },
    {
      field: `amttobepaid`,
      headerName: "Payable Amt",
      width: 120,
      renderCell: (item) => {
        return <Typography> ₹ {item.row.amttobepaid} /-</Typography>;
      },
    },
    {
      field: `totcolection`,
      headerName: "Collected Amt",
      hideable: false,
      width: 120,
      renderCell: (item) => {
        return <Typography> ₹ {item.row.totcolection} /-</Typography>;
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
              <Typography> ₹ {item?.row?.RedeemAmt} /-</Typography>
            ) : null}
          </>
        );
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
    <Grid container ml={2} mt={4} maxWidth={"xl"}>
      {" "}
      <ToastContainer autoClose={8000} />
      <Grid
        item
        sm={12}
        xs={12}
        md={12}
        lg={12}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Box mr={3} mt={1}>
          <ReusableBreadcrumbs
            props={[
              { title: "Home", link: "/executive", icon: "home" },
              {
                title: "Manage Subscription",
                link: "/executive/managesubscriptions",
                icon: "manage_accounts",
              },
            ]}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
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
                <GenCertificateIcon color={disbool2 ? "success" : "disabled"} />
              }
              Tooltip1={"Generate Certificate"}
              h1={"Generate Certificate"}
              disable1={!disbool2 && !disbool4}
              funcTrigger1={() => {
                console.log(CId[0]);
                navigate("/superuser/generatecertificate", {
                  state: { SchemeRegId: CId[0] },
                });
              }}
              textcolor1={disbool2 ? "green" : "grey"}
              mb={-1}
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
            sm={6}
            lg={2.4}
            md={4}
            mt={1}
            display={"flex"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
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
            sm={6}
            lg={2.5}
            md={4}
            mt={2}
            display={"flex"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
          >
            <ReusableDialogue
              h1={"Deactivate Maturity"}
              textcolor={
                disbool || disbool4 || disbool2 || disbool3 ? "grey" : "#c62828"
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
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            lg={2.2}
            md={4}
            mt={1}
            display={"flex"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
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
              textcolor1={disbool4 || disbool2 || disbool3 ? "grey" : "#1b5e20"}
              disable1={disbool4 || disbool2 || disbool3}
              funcTrigger1={ApprovedBonusStatusHandler}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            lg={2.4}
            md={4}
            mt={2}
            display={"flex"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
          >
            <ReusableDialogue
              h1={"Deactivate Bonus"}
              textcolor={
                disbool || disbool4 || disbool2 || disbool3 ? "grey" : "#c62828"
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
            xs={12}
            sm={6}
            lg={2.4}
            md={4}
            mt={1}
            display={"flex"}
            justifyContent={"space-between"}
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
                disbool || disbool4 || disbool2 || disbool3 ? "grey" : "#1b5e20"
              }
              Tooltip1={"Matured Account"}
              h1={"Matured A/C."}
              disable1={disbool || disbool4 || disbool2 || disbool3}
              funcTrigger1={OnMaturedFunc}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            lg={2.4}
            md={4}
            mt={1}
            display={"flex"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
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
                disbool || disbool4 || disbool2 || disbool3 ? "grey" : "#c62828"
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
        lg={2.2}
        md={4}
        sm={4}
        xs={12}
        mt={2}
        justifyContent={"flex-start"}
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
      <Grid item lg={2.2} md={4} sm={4} xs={12} mt={1.9}>
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
        xs={12}
        sm={4}
        lg={1.6}
        md={4}
        justifyContent={"center"}
        mt={1}
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
        lg={1.6}
        mt={2.5}
        display={"flex"}
        justifyContent={"flex-end"}
        flexWrap={"wrap"}
        mr={3}
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
        lg={1.6}
        mt={2.5}
        display={"flex"}
        justifyContent={"flex-end"}
        flexWrap={"wrap"}
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
  );
}

export default SubscriptionManagement;
