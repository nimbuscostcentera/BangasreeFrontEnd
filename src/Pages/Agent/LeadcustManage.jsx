import  { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import Grid from "@mui/system/Unstable_Grid/Grid";
import { Box,Alert,AlertTitle,Stack,Divider} from "@mui/material";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ReusableDataTable from "../../Components/Global/ReusableTable";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import DateRangFilter2 from "../../Components/Global/DateRangeFilter2";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";

import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

import {
  LeadCustList,
} from "../../Slice/PortableCustomer/PortableCustListSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";

function LeadcustManage() {
  //console.log("Lead");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [LeadId, setLeadId] = useState([]);
  const [loader, setLoader] = useState(true);
  const [Filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const [params, setParams] = useState({
    warning: "",
    alert: false,
  });
  //Login List for Table
  const { userInfo, global } = UseFetchLogger();

  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Leads")[0];

  //Lead Leadcust List
  const { isloading26, LeadCustData,  isSuccess26 } =
    useSelector((state) => state.leadCustList);

  //customer List
  useEffect(() => {
    let obj = {};
    if (global?.Utype == 1) {
      obj.SuperUserID = userInfo?.details?.SuperUserID;
      obj.SuperUserType = global?.SuperUserType;
      obj.LoggerBranchId = global?.LoggerBranchId;
    } else if (global?.Utype == 2) {
      obj.AgentCode = userInfo?.details?.AgentCode;
      obj.AgentID = userInfo?.details?.AgentID;
    }
    dispatch(LeadCustList({ ...global, ...Filters, ...obj }));
  }, [Filters?.endDate, Filters?.startDate]);

  useEffect(() => {
    let delay = null;
    if (isloading26 == false && Lead?.length !== 0) {
      delay = setTimeout(() => {
        setLoader(false);
      }, 1000);
    } else {
      delay = setTimeout(() => {
        setLoader(false);
      }, 2000);
    }

    return () => clearTimeout(delay);
  }, [isloading26]);

  let Lead = useMemo(() => {
    if (LeadCustData && LeadCustData?.length !== 0) {
      return LeadCustData;
    } else {
      return [];
    }
  }, [Filters?.endDate, Filters?.startDate, isSuccess26, LeadCustData]);

  const columns = [
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      hideable: false,
    },
    {
      field: "CustomerName",
      headerName: "Lead Customer",
      width: 160,
      hideable: false,
    },
    {
      field: "FollowUpDate",
      headerName: "Follow Up Date",
      width: 120,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.FollowUpDate
              ? moment(item?.row?.FollowUpDate).format("DD/MM/YYYY")
              : null}
          </>
        );
      },
    },
    {
      field: "PhoneNumber",
      headerName: "Phone No.",
      width: 120,
    },
    {
      field: "AgentCode",
      headerName: "AgentCode",
      width: 120,
    },
    {
      field: "BranchName",
      headerName: "Branch Name",
      width: 80,
    },
    {
      field: "BranchCode",
      headerName: "Branch Code",
      width: 80,
    },
    {
      field: "AreaName",
      headerName: "Area",
      width: 130,
    },
    { field: "Sex", headerName: "Gender", width: 90 },
    { field: "EmailId", headerName: "Email ID", width: 180 },
    { field: "Address", headerName: "Address", width: 750 },
  ];

  function ViewEditDetailsButton() {
    if (LeadId.length > 1) {
      setParams({
        warning:
          "Select 1 Lead to view and execute edit and convert to customer operations",
        alert: true,
      });
      // setWarning(
      //   "Select 1 Lead to view and execute edit and convert to customer operations"
      // );
      // setalert(true);
    } else {
      var a = LeadId[0];
      navigate("/executive/editleads", { state: { Leadid: a } });
    }
  }
  //handle filter
  const FilterHandler = (e) => {
    var key = e.target.name;
    var value = e.target.value;
    console.log(key, value);
    setFilters({ ...Filters, [key]: value });
  };

  let currentdate = moment().format("YYYY-MM-DD");

  return (
    <Grid container ml={2} mt={2}>
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
        <Box mt={1}>
          <ReusableBreadcrumbs
            props={[
              {
                title: "Home",
                link: global.Utype == 1 ? "/executive" : "/agent",
                icon: "home",
              },
              {
                title: "Manage Lead Customer",
                link: "#",
                icon: "manage_accounts",
              },
            ]}
          />{" "}
        </Box>
        {myPermission?.Create == 1 ? (
          <>
            {" "}
            <IconOnOffButton
              h1={"Add Lead Customers"}
              icon1={<AddCircleOutlineIcon fontSize="medium" />}
              Tooltip1={"Add Lead Customers"}
              funcTrigger1={() => {
                navigate("/executive/addleads");
              }}
            />
          </>
        ) : null}
      </Grid>
      <Grid item md={12} lg={12} sm={12} xs={12} my={0} py={0}>
        <Divider />
      </Grid>
      {params?.alert ? (
        <Grid item md={12} sm={12} xs={12} lg={12}>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert
                severity="error"
                onClose={() => {
                  setParams({ alert: false, warning: "" });
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
        md={5.5}
        lg={6}
        display={"flex"}
        justifyContent={{
          xl: "flex-start",
          lg: "flex-start",
          md: "flex-start",
          sm: "center",
          xs: "center",
        }}
        flexWrap={"wrap"}
        alignItems={"center"}
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
        md={6}
        lg={6}
        display={"flex"}
        justifyContent={{
          xl: "flex-end",
          lg: "flex-end",
          md: "flex-end",
          sm: "center",
          xs: "center",
        }}
        flexWrap={"wrap"}
        alignItems={"center"}
      >
        <IconOnOffButton
          h1={myPermission?.ViewPage == 1 ? "View" : null}
          icon1={
            myPermission?.ViewPage == 1 ? (
              <VisibilityIcon fontSize="medium" />
            ) : null
          }
          disable1={LeadId.length == 0 ? true : false}
          Tooltip1={
            myPermission?.ViewPage == 1 ? "View and Edit Details" : false
          }
          funcTrigger1={
            myPermission?.ViewPage == 1 ? ViewEditDetailsButton : false
          }
          h2={"Filter Out"}
          icon2={<FilterAltOffIcon fontSize="medium" />}
          Tooltip2={"Filter Out"}
          funcTrigger2={() => {
            setFilters({ startDate: "", endDate: "" });
            setLeadId([]);
          }}
        />
      </Grid>
      <Grid item sm={12} xs={12} md={12} lg={12}>
        <ReusableDataTable
          uniqueid={"CustomerID"}
          columns={columns}
          rows={Lead}
          state={LeadId}
          setState={setLeadId}
          isloading={loader}
          height={530}
        />
      </Grid>
    </Grid>
  );
}

export default LeadcustManage;
