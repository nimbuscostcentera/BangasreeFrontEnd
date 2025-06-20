import moment from "moment";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box } from "@mui/system";
import { Divider, Alert, AlertTitle, Stack } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";

import ReusableDataTable from "../../Components/Global/ReusableTable";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";
import DateRangFilter2 from "../../Components/Global/DateRangeFilter2";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
  AgentStatusUpdate,
  ClearState9,
} from "../../Slice/Agent/AgentStatusUpdateSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchAgent from "../../Apps/CustomHook/useFetchAgent";

const CustomTheme = createTheme({
  breakpoints: {
    keys: ["xxs", "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"],
    values: {
      xxs: 100,
      xs: 200,
      sm: 400,
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

export default function AgentManagement() {
  const location = useLocation();
  const {
    AgentCode = "",
    BranchId = "",
    AreaID = "",
    Status = null,
  } = location.state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [params, setParams] = useState({
    alert: false,
    warning: null,
  });
  const [ids, setIds] = useState([]);
  const [Filters, setFilters] = useState({
    Status: Status || null,
    startDate: "",
    endDate: "",
    AgentCode: AgentCode || "",
    BranchId: BranchId || "",
    AreaID: AreaID || "",
  });

  const columns = [
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      hideable: false,
    },
    { field: "Name", headerName: "Name", width: 180, hideable: false },
    {
      field: "AgentCode",
      headerName: "Agent Code",
      width: 130,
      hideable: false,
    },
    {
      field: "Phonenumber",
      headerName: "Phone Number",
      width: 140,
      hideable: false,
    },

    {
      field: "createdAt",
      headerName: "Date of Joining",
      width: 140,
      renderCell: (item) => {
        return <>{moment(item.row.createdAt).format("DD/MM/YYYY")}</>;
      },
    },
    {
      field: "branchname",
      headerName: "Branch Name",
      width: 120,
      hideable: false,
    },
    {
      field: "branchcode",
      headerName: "Branch Code",
      width: 120,
      hideable: false,
    },
    {
      field: "Status",
      headerName: "Status",
      hideable: false,
      width: 90,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.Status == 1
              ? "Active"
              : item?.row?.Status == 0
              ? "Inactive"
              : item?.row?.Status == 3
              ? "Pending"
              : null}
          </>
        );
      },
    },
    { field: "EmailId", headerName: "Email ID", width: 150 },
  ];
  const statusData = [
    { Status: 1, value: "Active" },
    { Status: 2, value: "InActive" },
    { Status: 3, value: "Pending" },
  ];
  //Login List for Table
  const { userInfo, global } = UseFetchLogger();

  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Agent")[0];

  //Agent Status Update
  const { isloading9, UpdateMsg, error9, isError9, isSuccess9 } = useSelector(
    (state) => state.AgentStatus
  );
  //Agent list
  const { agentList: AgentDetails, isloading2 } = useFetchAgent(
    {
      Status: Filters?.Status == 2 ? 0 : Filters?.Status,
      endDate: Filters?.endDate,
      startDate: Filters?.startDate,
      AgentCode: Filters?.AgentCode || "",
      BranchId: Filters?.BranchId || "",
      AreaID: Filters?.AreaID || "",
      ...global,
    },
    [Filters, isSuccess9]
  );

  //AgentStatus Update
  useEffect(() => {
    if (!isloading9 && isSuccess9) {
      toast.success(`${UpdateMsg}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState9());
      setIds([]);
    }
    if (isError9 && !isloading9) {
      toast.error(`${error9}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState9());
    }
  }, [isError9, isSuccess9, isloading9]);

  //id
  useEffect(() => {
    if (ids == undefined || ids.length == 0) {
      // setalert(false);
      setParams({ ...params, alert: false, warning: null });
    }
  }, [ids]);

  const ApprovedStatusHandler = () => {
    var obj;
    if (global?.Utype === 2) {
      obj = {
        AgentCode: userInfo?.details?.AgentCode,
        AgentID: userInfo?.details?.AgentID,
      };
    } else if (global?.Utype === 1) {
      obj = {
        SuperUserID: userInfo?.details?.SuperUserID,
      };
    }
    const UserData = { Status: 1, UUid: ids };
    dispatch(AgentStatusUpdate({ ...UserData, ...global, ...obj }));
  };

  const RejectStatusHandler = () => {
    const UserData = { Status: 0, UUid: ids };
    var obj;
    if (global?.Utype === 2) {
      obj = {
        AgentCode: userInfo?.details?.AgentCode,
        AgentID: userInfo?.details?.AgentID,
      };
    } else if (global?.Utype === 1) {
      obj = {
        SuperUserID: userInfo?.details?.SuperUserID,
      };
    }
    dispatch(AgentStatusUpdate({ ...UserData, ...global, ...obj }));
  };

  const OnEditView = () => {
    if (ids.length > 1) {
      setParams({
        alert: true,
        warning: "Select 1 Agent to View or edit details",
      });
      // setalert(true);
      // setWarning("Select 1 Agent to View or edit details");
    } else {
      var a = ids[0];
      navigate("/superuser/vieweditagent", { state: { AgentID: a } });
    }
  };

  const PassBookAssign = () => {
    var objArr = [];
    if (ids.length > 1) {
      setParams({
        alert: true,
        warning: "Select 1 Agent for Assign Passbook",
      });
    } else if (ids.length === 1) {
      objArr = AgentDetails.filter((i) => {
        return i.AgentID === ids[0];
      });
      if (objArr[0].Status == 1) {
        navigate("/superuser/passbookassign", { state: { agent: objArr[0] } });
      } else {
        setParams({
          alert: true,
          warning: "The Selected Agent is Not active",
        });
      }
    }
  };
  //hndle filter
  const FilterHandler = (e) => {
    var key = e.target.name;
    var value = e.target.value;
    console.log(key, value);
    setFilters({ ...Filters, [key]: value });
  };

  let currentdate = moment().format("YYYY-MM-DD");
  return (
    <ThemeProvider theme={CustomTheme}>
      <Grid container ml={3} mt={2} columnGap={2} maxWidth={"l"}>
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
                  title: "Manage Agent",
                  link: "#",
                  icon: "support_agent",
                },
              ]}
            />
          </Box>
          <IconOnOffButton
            h1={myPermission?.Edit == 1 ? "Assign PassBook To Agent" : null}
            icon1={
              myPermission?.Edit == 1 ? (
                <AddCircleOutlineIcon fontSize="medium" />
              ) : null
            }
            Tooltip1={
              myPermission?.Edit == 1 ? "Assign PassBook to Agent" : null
            }
            funcTrigger1={myPermission?.Edit == 1 ? PassBookAssign : null}
            disable1={
              myPermission?.Edit == 1 && ids.length === 1 ? false : true
            }
            h2={myPermission?.Create == 1 ? "Add Agent" : null}
            icon2={
              myPermission?.Create == 1 ? (
                <AddCircleOutlineIcon fontSize="medium" />
              ) : null
            }
            Tooltip2={myPermission?.Create == 1 ? "ADD Collection" : null}
            funcTrigger2={
              myPermission?.Create == 1
                ? () => {
                    navigate("/executive/agentregistration");
                  }
                : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} py={0} my={0}>
          <Divider />
        </Grid>
        {params?.alert ? (
          <Grid item md={12} sm={12} xs={12} lg={12}>
            {" "}
            <Box display={"flex"} justifyContent={"space-between"}>
              <Stack sx={{ width: "100%" }} spacing={2}>
                <Alert
                  severity="error"
                  onClose={() => {
                    setParams({ alert: false, warning: null });
                  }}
                >
                  <AlertTitle>Warning</AlertTitle>
                  {params?.warning}
                </Alert>
              </Stack>
            </Box>
          </Grid>
        ) : null}
        <Grid
          item
          sm={12}
          xs={12}
          md={12}
          lg={12}
          xl={4.2}
          xxl={4}
          mb={{ lg: 2, md: 0 }}
          display={"flex"}
          justifyContent={{ mid: "center", md: "flex-start" }}
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
          md={9}
          lg={7}
          xl={5.3}
          xxl={5.5}
          mb={2}
          display={"flex"}
          justifyContent={{ mid: "center", md: "flex-start" }}
          flexWrap={"wrap"}
        >
          <IconOnOffButton
            h1={myPermission?.ViewPage == 1 ? "View" : null}
            icon1={
              myPermission?.ViewPage == 1 ? (
                <VisibilityIcon fontSize="medium" />
              ) : null
            }
            Tooltip1={myPermission?.ViewPage == 1 ? "View Details" : null}
            funcTrigger1={myPermission?.ViewPage == 1 ? OnEditView : null}
            disable1={
              myPermission?.ViewPage == 1 && ids.length == 0 ? true : false
            }
            h2={"Filter out"}
            icon2={<FilterAltOffIcon fontSize="small" />}
            Tooltip2={"Filter Out"}
            funcTrigger2={() => {
              setIds([]);
              setFilters({
                Status: null,
                startDate: "",
                endDate: "",
              });
            }}
          />
          {myPermission?.Edit == 1 ? (
            <IconOnOffButton
              icon1={
                <CheckCircleOutlineOutlinedIcon
                  fontSize="medium"
                  color={ids && ids.length == 0 ? "disabled" : "success"}
                />
              }
              icon2={
                <CancelOutlinedIcon
                  fontSize="medium"
                  color={ids && ids.length == 0 ? "disabled" : "error"}
                />
              }
              textcolor1={ids && ids.length == 0 ? "black" : "#1b5e20"}
              textcolor2={ids && ids.length == 0 ? "black" : "#c62828"}
              h1={"Active"}
              h2={"Inactive"}
              Tooltip1={"Active"}
              Tooltip2={"Inactive"}
              disable1={ids.length == 0 ? true : false}
              disable2={ids.length == 0 ? true : false}
              funcTrigger1={ApprovedStatusHandler}
              funcTrigger2={RejectStatusHandler}
            />
          ) : null}
        </Grid>

        <Grid
          item
          sm={12}
          xs={12}
          md={2.5}
          lg={3}
          xl={2}
          xxl={2}
          mt={{ md: 2, lg: 2, xl: 2.5 }}
          mb={1}
        >
          <ReusableDropDown4
            label={"Status"}
            data={statusData || []}
            ObjectKey={["value"]}
            uniquekey={"Status"}
            Field={Filters["Status"]}
            deselectvalue={true}
            onChange={FilterHandler}
          />
        </Grid>
        <Grid item sm={12} xs={12} md={12} lg={12}>
          <ReusableDataTable
            uniqueid={"AgentID"}
            columns={columns}
            rows={AgentDetails || []}
            state={ids}
            selectState={(arr) => {
              setIds(arr);
            }}
            isloading={isloading2}
            height={"68vh"}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
