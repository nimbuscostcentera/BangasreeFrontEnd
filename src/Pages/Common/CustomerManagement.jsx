import { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import Grid from "@mui/system/Unstable_Grid/Grid";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import {
  Popover,
  Divider,
  Typography,
  Alert,
  AlertTitle,
  Stack,
  Button
} from "@mui/material";
import { Box } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ReusableDataTable from "../../Components/Global/ReusableTable";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import DateRangFilter2 from "../../Components/Global/DateRangeFilter2";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import {
  CutomerStatusUpdate,
  ClearState10,
} from "../../Slice/Customer/CutomerStatusUpdateSlice";
import {
  CustomerTransferFunc,
  ClearStateCustomerTransfer,
} from "../../Slice/Customer/CustomerTransferSlice";
import {
  ClearState7,
  ClearToasterCust,
} from "../../Slice/Auth/CustomerRegSlice";

import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchCustomer from "../../Apps/CustomHook/useFetchCustomer";
import useFetchAcode from "../../Apps/CustomHook/useFetchAcode";
const CustomTheme = createTheme({
  breakpoints: {
    keys: ["xxs", "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"],
    values: {
      xxs: 100,
      xs: 200,
      sm: 400,
      mid: 695,
      md: 825,
      lg: 960,
      l: 1060,
      xl: 1128,
      xxl: 1210,
      xxxl: 1345,
      Big: 1500,
    },
  },
});

export default function CustomerManagement() {
  //--------------hooks------------
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    AgentCode = "",
    BranchId = "",
    AreaID = "",
    Status = "",
  } = location.state || {};
  //--------------hooks------------

  //--------------states-----------

  const [params, setParams] = useState({
    alert: false,
    warning: null,
    Pop: null,
    anchorEl: null,
  });
  const [CustID, setCustID] = useState([]);
  const [custTransData, setCustTransData] = useState({
    OldAgentCode: null,
    NewAgentCode: null,
    CustIDs: [],
  });
  const [Filters, setFilters] = useState({
    Status: Status || null,
    startDate: "",
    endDate: "",
    AgentCode: AgentCode || "",
    BranchId: BranchId || "",
    AreaID: AreaID || "",
  });
  //--------------states----------------

  const open = Boolean(params?.anchorEl);

  //-------------------------Api Calling hooks-------------------------

  //Login List for Table
  const { userInfo, global } = UseFetchLogger();
  //agent List
  const { AgentCode: AgentListDD } = useFetchAcode({},[]);
  //Customer CustomerApproval
  const { isloading10, Msg10, error10, isError10, isSuccess10 } = useSelector(
    (state) => state.CustStatus
  );
  //After Reg
  const { msg7, isSuccess7, ToasterCust } = useSelector(
    (state) => state?.CustomerReg
  );
  //Customer List
  let addobj = {};
  if (userInfo?.details?.Utype == 2) {
    addobj.AgentCode = userInfo?.details?.AgentCode;
  }
  const { custList: CustomerDetails, isloading6 } = useFetchCustomer(
    { ...global, ...Filters, ...addobj },
    [Filters, isSuccess10, isSuccess7, navigate]);
  const {
    isCustomerTransferSucc,
    isCustomerTransferErr,
    isCustomerTransferLoading,
  } = useSelector((state) => state.custTrans);
  //-------------------------Api Calling hooks-------------------------

  //-----------------------permission List data Fetch----------------------
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Customer")[0];
  //-----------------------permission List data Fetch----------------------

  //----------------------------functions-------------------------------------

  //bulk transfer
  const HandleCustTransDataInput = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    setCustTransData((prev) => ({ ...prev, [key]: value }));
  };
  // transfer cust submit button
  const TransferHandler = (e) => {
    e.preventDefault();
    let obj = { ...global, ...custTransData, CustIDs: CustID };
    dispatch(CustomerTransferFunc(obj));
    console.log(obj)
  };
  //Blocking cause checker open
  const handlePopoverOpen = (event, par) => {
    setParams({
      ...params,
      Pop: par.row.StatusComment,
      anchorEl: event.currentTarget,
    });
  };
  //Blocking cause checker close
  const handlePopoverClose = () => {
    setParams({
      ...params,
      Pop: null,
      anchorEl: false,
    });
  };
  //Status Approve
  const ApprovedStatusHandler = () => {
    let final;
    if (userInfo?.details?.Utype === 2) {
      final = {
        AgentCode: userInfo?.details?.AgentCode,
        AgentID: userInfo?.details?.AgentID,
      };
    } else if (userInfo?.details?.Utype === 1) {
      final = {
        SuperUserID: userInfo?.details?.SuperUserID,
        BranchId: userInfo?.details?.BranchId,
      };
    }
    const UserData = { Status: true, UUid: CustID, ...global, ...final };
    dispatch(CutomerStatusUpdate(UserData));
  };
  //Status reject
  const RejectStatusHandler = () => {
    let final;
    if (userInfo?.details?.Utype === 2) {
      final = {
        AgentCode: userInfo?.details?.AgentCode,
        AgentID: userInfo?.details?.AgentID,
      };
    } else if (userInfo?.details?.Utype === 1) {
      final = {
        SuperUserID: userInfo?.details?.SuperUserID,
        BranchId: userInfo?.details?.BranchId,
      };
    }
    const UserData = { Status: 0, UUid: CustID, ...global, ...final };
    dispatch(CutomerStatusUpdate(UserData));
  };
  //Navigate to edit page
  function ViewEditDetailsButton() {
    if (CustID.length > 1) {
      setParams({
        ...params,
        alert: true,
        warning: "Select 1 Customer to View and edit details",
      });
    } else {
      var a = CustID[0];
      navigate("/superuser/vieweditcustomer", { state: { CustUUid: a } });
    }
  }
  //new scheme Assign to Customer
  function CustNewSchemeAssign() {
    var objArr = [];
    if (CustID.length > 1) {
      setParams({
        ...params,
        alert: true,
        warning: "Select 1 Customer to Assign Gold Schemes",
      });
    } else if (CustID.length === 1) {
      objArr = CustomerDetails.filter((i) => {
        return i.UUid === CustID[0];
      });
      if (objArr[0].Status == 1) {
        navigate("/executive/addcustscheme", {
          state: { CustUUid: objArr[0] },
        });
      } else {
        setParams({
          ...params,
          alert: true,
          warning: "The Selected Customer is Not active",
        });
      }
    }
  }
  //handle filter
  const FilterHandler = (e) => {
    var key = e.target.name;
    var value = e.target.value;
    console.log(key, value);
    setFilters({ ...Filters, [key]: value });
  };
  //----------------------------functions-------------------------------------

  //-------------------------------others---------------------------------------
  //Columns of table
  const columns = [
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      hideable: false,
    },
    {
      field: "CustomerName",
      headerName: "Customer Name",
      width: 180,
      hideable: false,
    },
    {
      field: "PhoneNumber",
      headerName: "Contact Number",
      width: 130,
      hideable: false,
    },
    {
      field: "createdAt",
      headerName: "Reg. Date",
      width: 120,
      renderCell: (item) => {
        return <>{moment(item.row.createdAt).format("DD/MM/YYYY")}</>;
      },
    },
    {
      field: "AgentCode",
      headerName: "Agent Code",
      width: 130,
      hideable: false,
    },
    { field: "branchname", headerName: "Branch Name", width: 130 },
    { field: "BranchCode", headerName: "Branch Code", width: 130 },
    {
      field: "AreaName",
      headerName: "Area",
      width: 130,
      hideable: false,
    },

    { field: "EmailId", headerName: "Email ID", width: 200 },

    {
      field: "Status",
      headerName: "Status",
      width: 90,
      hideable: false,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.Status == 1 ? (
              <Typography>Active</Typography>
            ) : item?.row?.Status == 0 ? (
              <Typography>Inactive</Typography>
            ) : item?.row?.Status == 2 ? (
              <>
                <Typography
                  aria-owns={open ? "mouse-over-popover" : undefined}
                  aria-haspopup="true"
                  onMouseEnter={(e) => {
                    handlePopoverOpen(e, item);
                  }}
                  onMouseLeave={handlePopoverClose}
                >
                  Blocked
                </Typography>
              </>
            ) : item?.row?.Status == 3 ? (
              <Typography>Pending</Typography>
            ) : null}
          </>
        );
      },
    },
  ];
  //Current date
  let currentdate = moment().format("YYYY-MM-DD");
  //Status array with value
  let statusData = [
    { Status: 1, value: "Active" },
    { Status: 0, value: "InActive" },
    { Status: 3, value: "Pending" },
    { Status: 2, value: "Block" },
  ];
  //-------------------------------others---------------------------------------

  //---------------------------------useEffects-----------------------------------

  //alert show function
  useEffect(() => {
    if (CustID == undefined || CustID.length == 0) {
      setParams({ ...params, alert: false, warning: null });
    }
  }, [CustID]);

  //cust transfer
  useEffect(() => {
    if (isCustomerTransferSucc) {
      toast.success("Customer Transfer Successfully", { positions:"top-right",autoClose:5000 });
      setCustTransData({
        CustIDs:[],
        NewAgentCode: "",
        OldAgentCode: "",
      });
    }
    if (isCustomerTransferErr) {
      toast.error("Customer Transfer Failed!", {
        positions: toast.POSITION.TOP_RIGHT,
      });
    }
    ClearStateCustomerTransfer();
  }, [
    isCustomerTransferSucc,
    isCustomerTransferErr,
    isCustomerTransferLoading,
  ]);
  //toaster
  useEffect(() => {
    if (!isloading10 && isSuccess10) {
      toast.success(`${Msg10}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState10());
      setCustID([]);
    }
    if (isError10 && !isloading10) {
      toast.error(`${error10}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState10());
    }
    if (ToasterCust) {
      toast.success(`${msg7}`, toast.POSITION.TOP_RIGHT);
      dispatch(ClearToasterCust());
      dispatch(ClearState7());
    }
  }, [isSuccess10, isError10, ToasterCust]);

  //agentcode
  useEffect(() => {
    setFilters((prev) => ({ ...prev, AgentCode: custTransData?.OldAgentCode }));
  }, [custTransData?.OldAgentCode]);

  //---------------------------------useEffects-----------------------------------

  return (
    <ThemeProvider theme={CustomTheme}>
      <Grid container ml={3} mt={2} columnGap={1} maxWidth={"l"}>
        <ToastContainer autoClose={5000} />
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
                  title: "Manage Customer Details",
                  link: "#",
                  icon: "people",
                },
              ]}
            />
          </Box>
          {myPermission?.Create == 1 ? (
            <>
              <IconOnOffButton
                h1={myPermission?.Create == 1 ? "Add New Customer" : null}
                icon1={
                  myPermission?.Create == 1 ? (
                    <AddCircleOutlineIcon fontSize="medium" />
                  ) : null
                }
                Tooltip1={myPermission?.Create == 1 ? "Add New Customer" : null}
                funcTrigger1={
                  myPermission?.Create == 1
                    ? () => {
                        navigate("/executive/customerregistration");
                      }
                    : null
                }
                h2={
                  myPermission?.Create == 1 ? "Assign Scheme to Customer" : null
                }
                icon2={
                  myPermission?.Create == 1 ? (
                    <AddCircleOutlineIcon fontSize="medium" />
                  ) : null
                }
                disable2={CustID && CustID.length == 0 ? true : false}
                Tooltip2={
                  myPermission?.Create == 1
                    ? "Assigne Scheme to Customer"
                    : null
                }
                funcTrigger2={
                  myPermission?.Create == 1 ? CustNewSchemeAssign : null
                }
              />
            </>
          ) : null}
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Divider />
        </Grid>
        {params?.alert ? (
          <Grid item md={12} xs={12} sm={12} lg={12}>
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert
                severity="error"
                onClose={() => {
                  setParams({ ...params, alert: false });
                }}
              >
                <AlertTitle>Warning</AlertTitle>
                {params?.warning}
              </Alert>
            </Stack>
          </Grid>
        ) : null}
        <Grid
          item
          sm={12}
          xs={12}
          md={12}
          lg={12}
          xl={4.4}
          xxl={4}
          mt={1}
          mb={{ xl: 1 }}
          display={"flex"}
          justifyContent={{
            xl: "flex-start",
            lg: "flex-start",
            sm: "center",
            xs: "center",
            md: "center",
            mid: "center",
          }}
          flexWrap={"wrap"}
        >
          <DateRangFilter2
            state1={Filters?.startDate}
            state2={Filters?.endDate}
            name1={"startDate"}
            name2={"endDate"}
            MaxDate1={
              Filters?.endDate !== undefined &&
              Filters?.endDate !== null &&
              Filters?.endDate !== ""
                ? Filters?.endDate
                : currentdate
            }
            MaxDate2={currentdate}
            InputHandler={FilterHandler}
          />
        </Grid>

        <Grid
          item
          sm={12}
          xs={12}
          md={8.7}
          lg={7.5}
          xl={5.6}
          xxl={5.5}
          my={2}
          display={"flex"}
          justifyContent={{
            xl: "flex-start",
            lg: "flex-start",
            l: "flex-start",
            mid: "center",
            md: "center",
            sm: "center",
            xs: "center",
          }}
          flexWrap={"wrap"}
        >
          <IconOnOffButton
            h1={myPermission?.ViewPage == 1 ? "View" : null}
            icon1={
              myPermission?.ViewPage == 1 ? (
                <VisibilityIcon fontSize="medium" />
              ) : null
            }
            disable1={CustID.length == 0 ? true : false}
            Tooltip1={
              myPermission?.ViewPage == 1 ? "View and Edit Details" : null
            }
            funcTrigger1={
              myPermission?.ViewPage == 1 ? ViewEditDetailsButton : null
            }
            h2={"Filter out"}
            icon2={<FilterAltOffIcon fontSize="small" />}
            funcTrigger2={() => {
              setFilters({ startDate: "", endDate: "" });
              setCustID([]);
              setFilters({
                Status: "",
                startDate: "",
                endDate: "",
              });
              setCustTransData({
                OldAgentCode: null,
                NewAgentCode: null,
                CustIDs: [],
              });
            }}
          />

          {myPermission?.Edit == 1 && global?.Utype !== 2 ? (
            <>
              <IconOnOffButton
                h1={"Accept"}
                h2={"Reject"}
                textcolor1={CustID && CustID.length == 0 ? "black" : "#1b5e20"}
                textcolor2={CustID && CustID.length == 0 ? "black" : "#c62828"}
                icon1={
                  <CheckCircleOutlineOutlinedIcon
                    fontSize="medium"
                    color={
                      CustID && CustID.length == 0 ? "disabled" : "success"
                    }
                  />
                }
                icon2={
                  <CancelOutlinedIcon
                    fontSize="medium"
                    color={CustID && CustID.length == 0 ? "disabled" : "error"}
                  />
                }
                Tooltip1={"Accept"}
                Tooltip2={"Reject"}
                disable1={CustID.length == 0 ? true : false}
                disable2={CustID.length == 0 ? true : false}
                funcTrigger1={ApprovedStatusHandler}
                funcTrigger2={RejectStatusHandler}
              />
            </>
          ) : null}
        </Grid>

        <Grid
          item
          sm={12}
          xs={12}
          md={2.5}
          lg={3}
          xl={1.5}
          xxl={2}
          mt={{ xl: 2, lg: 1.5, md: 1.5 }}
          mb={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "300px" }}>
            <ReusableDropDown4
              setState={setFilters}
              state={Filters}
              label={"Status"}
              data={statusData}
              id={"arial_status"}
              disabled={false}
              ObjectKey={["value"]}
              Field={Filters?.Status}
              uniquekey={"Status"}
              deselectvalue={true}
              onChange={FilterHandler}
            />
          </div>
        </Grid>
        {/**Agent Transfer start */}
        {global?.Utype == 2 ? null : (
          <>
            <Grid
              item
              xs={12}
              sm={12}
              md={2.6}
              lg={2.4}
              xl={2}
              xxl={1.5}
              my={2}
              sx={{
                color: "grey",
                fontSize: "16px",
                mt: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              Agent Transfer :
            </Grid>

            <Grid
              item
              sm={5.5}
              xs={12}
              md={2.7}
              lg={4}
              xl={3}
              my={1}
              sx={{
                color: "grey",
                fontSize: "16px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div style={{ width: "100%", maxWidth: "250px" }}>
                <ReusableDropDown4
                  Field={custTransData?.OldAgentCode}
                  name={"OldAgentCode"}
                  uniquekey={"AgentCode"}
                  ObjectKey={["AgentCode", "Name"]}
                  data={AgentListDD || []}
                  deselectvalue={true}
                  disabled={false}
                  id={"AgentCode"}
                  label={"from Old Agent"}
                  setState={setCustTransData}
                  state={custTransData}
                  onChange={HandleCustTransDataInput}
                />
              </div>
            </Grid>

            <Grid
              item
              sm={5}
              xs={12}
              md={2.7}
              lg={4}
              xl={3}
              my={1}
              mx={3}
              sx={{
                color: "grey",
                fontSize: "16px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div style={{ width: "100%", maxWidth: "250px" }}>
                <ReusableDropDown4
                  Field={custTransData?.NewAgentCode}
                  uniquekey={"AgentCode"}
                  name={"NewAgentCode"}
                  ObjectKey={["AgentCode", "Name"]}
                  data={AgentListDD || []}
                  deselectvalue={true}
                  disabled={false}
                  id={"AgentCode"}
                  label={"Assign To New Agent"}
                  setState={setCustTransData}
                  state={custTransData}
                  onChange={HandleCustTransDataInput}
                />
              </div>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={2.5}
              lg={3}
              xl={2}
              mt={2}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: {
                  xs: 1,
                },
              }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={TransferHandler}
              >
                Transfer
              </Button>
            </Grid>
          </>
        )}

        {/**Agent Transfer end */}

        <Grid item sm={12} xs={12} md={12} lg={12}>
          <ReusableDataTable
            uniqueid={"UUid"}
            columns={columns}
            rows={CustomerDetails}
            state={CustID}
            setState={setCustID}
            isloading={isloading6}
            height={"90vh"}
          />
          {params?.Pop == null ? null : (
            <>
              <Popover
                id="mouse-over-popover"
                sx={{
                  pointerEvents: "none",
                }}
                open={open}
                anchorEl={params?.anchorEl}
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
                <Typography sx={{ p: 1 }}>{params?.Pop}</Typography>
              </Popover>
            </>
          )}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
