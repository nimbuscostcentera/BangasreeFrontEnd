import { useState, useEffect } from "react";
import moment from "moment";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Divider, Alert, AlertTitle, Stack } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import { Box } from "@mui/system";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";

import ReusableDataTable from "../../Components/Global/ReusableTable";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import DateRangFilter2 from "../../Components/Global/DateRangeFilter2";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

import {
  SuperUserStatusfunc,
  ClearState40,
} from "../../Slice/BackofficeUser/SuperUserStatusSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchSuperUser from "../../Apps/CustomHook/useFetchSuperUser";

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
      l:1060,
      xl: 1125,
      xxl: 1210,
      xxxl: 1345,
      Big: 1500,
    },
  },
});

export default function SuperUserManagement() {
  //console.log("SuperUser");
  const location = useLocation();
  const {
    AgentCode = "",
    BranchId = "",
    AreaID = "",
    stat = "",
  } = location.state || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ids, setIds] = useState([]);
  const [params, setParams] = useState({
    alert: false,
    warMsg: "",
  });
  const [Filters, setFilters] = useState({
    Status: stat || "",
    startDate: null,
    endDate: null,
    AgentCode: AgentCode || "",
    BranchId: BranchId || "",
    AreaID: AreaID || "",
  });

  const columns = [
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      hideable: false,
    },
    { field: "Name", headerName: "Name", width: 190, hideable: false },
    {
      field: "PhoneNumber",
      headerName: "Phone Number",
      width: 120,
      hideable: false,
    },
    { field: "EmailId", headerName: "Email ID", width: 220 },
    {
      field: "Designation",
      headerName: "Designation",
      width: 150,
      hideable: false,
    },
    {
      field: "createdAt",
      headerName: "Date of Joining",
      width: 120,
      renderCell: (item) => {
        return (
          <>
            <>{moment(item.row.createdAt).format("DD/MM/YYYY")}</>
          </>
        );
      },
    },
    {
      field: "BranchName",
      headerName: "Branch Name",
      width: 120,
    },
    {
      field: "BranchCode",
      headerName: "Branch Code",
      width: 120,
    },
    {
      field: "SuperUserType",
      hideable: false,
      headerName: "Super User Type",
      width: 130,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.SuperUserType == 1
              ? "Admin"
              : item?.row?.SuperUserType == 2
              ? "BackOffice User"
              : null}
          </>
        );
      },
    },
    {
      field: "Status",
      hideable: false,
      headerName: "Status",
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
  ];

  const statusData = [
    { Status: 1, value: "Active" },
    { Status: 0, value: "InActive" },
    { Status: 3, value: "Pending" },
  ];

  //SuperUser Status Update
  const { isloading40, Resp40, error40, isError40, isSuccess40 } = useSelector(
    (state) => state.sss
  );
  //Logger detail
  const { global, userInfo } = UseFetchLogger();

  const { buList: SuperUserDetails, isloading36 } = useFetchSuperUser(
    {
      ...global,
      ...Filters,
    },
    [Filters?.endDate, Filters?.startDate, Filters?.Status, isSuccess40]
  );
  //console.log(SuperUserDetails);
  //SuperUserStatus Update
  useEffect(() => {
    if (!isloading40 && isSuccess40) {
      toast.success(`${Resp40}`, { positions: toast.POSITION.TOP_RIGHT });
    }
    if (isError40 && !isloading40) {
      toast.error(`${error40}`, { positions: toast.POSITION.TOP_RIGHT });
    }
    dispatch(ClearState40());
  }, [isSuccess40]);

  //permission List data Fetch
  let storedData = localStorage.getItem("loggerPermission");
  if (storedData && storedData.length !== 0) {
    let parray = JSON.parse(storedData);
    var myPermission =
      parray && parray.filter((i) => i?.PageName == "Manage Backoffice")[0];
  }

  useEffect(() => {
    if (ids == undefined || ids.length == 0) {
      //setalert(false);
      setParams({ ...params, alert: false });
    }
  }, [ids]);

  //handle filter
  const FilterHandler = (e) => {
    var key = e.target.name;
    var value = e.target.value;
    console.log(key, value);
    setFilters({ ...Filters, [key]: value });
  };

  //approve function
  const ApprovedStatusHandler = () => {
    var check = false;
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] == userInfo?.details?.SuperUserID) {
        check = true;
        break;
      }
    }
    if (check) {
      setParams({
        ...params,
        alert: true,
        warMsg: "You Can not Active or Inactive yourself",
      });
    } else {
      dispatch(ClearState40());
      const UserData = { Status: 1, SuperUserID: ids, ...global };
      dispatch(SuperUserStatusfunc(UserData));
      setIds([]);
    }
  };

  const RejectStatusHandler = () => {
    var check = false;
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] == userInfo?.details?.SuperUserID) {
        check = true;
        break;
      }
    }
    if (check) {
      setParams({
        ...params,
        alert: true,
        warMsg: "You Can not Active or Inactive yourself",
      });
    } else {
      dispatch(ClearState40());

      const UserData = { Status: 0, SuperUserID: ids, ...global };
      dispatch(SuperUserStatusfunc(UserData));
    }
  };

  const OnEditView = () => {
    if (ids.length > 1) {
      setParams({
        ...params,
        alert: true,
        warMsg: "Select 1 Backoffice User to View and Edit.",
      });
    } else {
      var a = ids[0];
      navigate("/superuser/vieweditsuperuser", { state: { SuperUserID: a } });
    }
  };
  let currentdate = moment().format("YYYY-MM-DD");
  return (
    <ThemeProvider theme={CustomTheme}>
         <Grid container ml={2} mt={2} maxWidth={"l"}>
        <ToastContainer autoClose={3000} />
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
                  title: "Manage Backoffice",
                  link: "#",
                  icon: "manage_accounts",
                },
              ]}
            />
          </Box>
          {myPermission?.Create == 1 ? (
            <Box>
              <IconOnOffButton
                h1={"Add SuperUser"}
                icon1={<AddCircleOutlineIcon fontSize="medium" />}
                Tooltip1={"ADD Collection"}
                funcTrigger1={() => {
                  navigate("/superuser/superuserregistration");
                }}
              />{" "}
            </Box>
          ) : null}
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Divider />
        </Grid>
        {params?.alert ? (
          <Grid item sm={12} xs={12} md={12} lg={12}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Stack sx={{ width: "100%" }} spacing={2}>
                <Alert
                  severity="error"
                  onClose={() => {
                    // setalert(false);
                    setParams({ ...params, alert: false });
                  }}
                >
                  <AlertTitle>Warning</AlertTitle>
                  {params?.warMsg}
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
          xl={4.3}
          mt={1}
          mb={{ md: 0, lg: 1 }}
          display={"flex"}
          justifyContent={{
            xl: "flex-start",
            md: "center",
            lg: "center",
            sm: "center",
            xs: "center",
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
          md={12}
          lg={6.3}
          xl={5.2}
          mt={1}
          mb={1}
          display={"flex"}
          justifyContent={{ sm: "center", mid: "center", md: "flex-start" }}
          flexWrap={"wrap"}
        >
          {myPermission?.ViewPage ? (
            <IconOnOffButton
              h1={"View"}
              icon1={<VisibilityIcon fontSize="medium" />}
              Tooltip1={"View and Edit Details"}
              disable1={ids && ids.length == 0 ? true : false}
              funcTrigger1={OnEditView}
              funcTrigger2={() => {
                setFilters({ startDate: "", endDate: "" });
                setIds([]);
                setFilters({
                  Status: "",
                  startDate: "",
                  endDate: "",
                });
              }}
              h2={"Filter out"}
              icon2={<FilterAltOffIcon fontSize="small" />}
              Tooltip2={"Clear Filter"}
            />
          ) : null}
          {myPermission?.Edit == 1 ? (
            <IconOnOffButton
              h1={"Active"}
              textcolor1={ids && ids.length == 0 ? "black" : "#1b5e20"}
              textcolor2={ids && ids.length == 0 ? "black" : "#c62828"}
              h2={"Inctive"}
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
              Tooltip1={"Active"}
              Tooltip2={"Inactive"}
              disable1={ids && ids.length == 0 ? true : false}
              disable2={ids && ids.length == 0 ? true : false}
              funcTrigger1={ApprovedStatusHandler}
              funcTrigger2={RejectStatusHandler}
            />
          ) : null}
        </Grid>

        <Grid
          item
          sm={12}
          xs={12}
          md={12}
          lg={5}
          xl={2.3}
          xxl={2}
          mt={{
            md: 1.5,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          mb={2}
        >
          {" "}
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
        </Grid>
        <Grid item sm={12} xs={12} md={12} lg={12}>
          <ReusableDataTable
            uniqueid={"SuperUserID"}
            columns={columns}
            rows={SuperUserDetails}
            state={ids}
            setState={setIds}
            isloading={isloading36}
            height={"68vh"}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
