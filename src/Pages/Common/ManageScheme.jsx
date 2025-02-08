import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Typography, Divider, Alert, AlertTitle, Stack, IconButton } from "@mui/material";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import { Box } from "@mui/system";
import Grid from "@mui/system/Unstable_Grid/Grid";

import ReusableDataTable from "../../Components/Global/ReusableTable";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HistoryIcon  from "@mui/icons-material/History";
import EditIcon from "@mui/icons-material/Edit";

import { SchemeList } from "../../Slice/Scheme/SchemeListSlice";
import {
  DeleteSchemefunc,
  ClearState58,
} from "../../Slice/Scheme/DeleteSchemeSlice";
import {
  SchemeStatusUpdate,
  ClearState21,
} from "../../Slice/Scheme/SchemeStatusUpdateSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SchemeManagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [SchemeDetails, setSchemeDetails] = useState();
  const [SUUid, setSUUid] = useState([]);
  const [alert, setalert] = useState(false);
  const [warning, setWarning] = useState("");
  const [Filters, setFilters] = useState({ Status: "" });

  //auth
  const { global } = UseFetchLogger();

  //Scheme List for Table
  const { isloading18, Schemes,isSuccess18 } = useSelector(
    (state) => state.SchemeList
  );

  //Scheme Scheme Approval
  const { isloading21, Msg21, error21, isError21, isSuccess21 } = useSelector(
    (state) => state.SchemeStatusUpdate
  );

  //Scheme Delete
  const { isloading58, Resp58, error58, isError58, isSuccess58 } = useSelector(
    (state) => state.DelScheme
  );

  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Schemes")[0];

  useEffect(() => {
    if (global?.Utype === 2) {
      dispatch(SchemeList({ ...global, Status: 1 }));
    } else {
      dispatch(SchemeList({ ...global, ...Filters }));
    }
  }, [Filters, isSuccess21, isSuccess58]);

  //Scheme List
  useEffect(() => {
    if (!isloading18 && isSuccess18) {
      setSchemeDetails(Schemes);
    }
  }, [Filters, isSuccess18, isSuccess21, isSuccess58]);

  //Scheme Status Update
  useEffect(() => {
    if (!isloading21 && isSuccess21) {
      // alert(Msg21);
      toast.success(`${Msg21}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState21());
    }
    if (isError21 && !isloading21) {
      toast.error(`${error21}`, { positions: toast.POSITION.TOP_RIGHT });
      // alert(error21);
      dispatch(ClearState21());
    }
  }, [isError21, isSuccess21]);

  //Scheme delete
  useEffect(() => {
    if (!isloading58 && isSuccess58) {
      // alert(Msg21);
      toast.success(`${Resp58}`, { positions: toast.POSITION.TOP_RIGHT });
    }
    if (isError58 && !isloading58) {
      toast.error(`${error58}`, { positions: toast.POSITION.TOP_RIGHT });
      // alert(error21);
    }
    dispatch(ClearState58());
  }, [isError58, isSuccess58]);

  useEffect(() => {
    if (SUUid && SUUid.length == 0) {
      setWarning("");
      setalert(false);
    }
  }, [SUUid]);

  //function of status update
  const ApprovedStatusHandler = () => {
    const UserData = { Status: 1, SUUid: SUUid, ...global };
    dispatch(SchemeStatusUpdate(UserData));
  };

  //function of status update
  const RejectStatusHandler = () => {
    const UserData = { Status: 0, SUUid: SUUid, ...global };
    dispatch(SchemeStatusUpdate(UserData));
  };

  const columns =
    global?.Utype === 1
      ? [
          {
            ...GRID_CHECKBOX_SELECTION_COL_DEF,
            hideable: false,
          },
          // { field: "GSSID", headerName: "GSS ID ", width: 100 },
          {
            field: "SchemeTitle",
            headerName: "Scheme Name",
            width: 220,
            hideable: false,
          },
          {
            field: "BONUS",
            headerName: "Bonus",
            width: 120,
            renderCell: (item) => (
              <Typography>{`${item?.row?.BONUS}` + "%"}</Typography>
            ),
            hideable: false,
          },
          {
            field: "Regfees",
            headerName: "Registration Fees",
            width: 180,
            renderCell: (item) => (
              <Typography>{" ₹" + `${item?.row?.Regfees}` + "/-"}</Typography>
            ),
            hideable: false,
          },
          {
            field: "Duration",
            headerName: "Duration",
            width: 180,
            renderCell: (item) => {
              return (
                <>
                  <Typography>
                    {`${item?.row?.Duration}` + " Months"}
                  </Typography>
                </>
              );
            },
            hideable: false,
          },
          {
            field: "Status",
            headerName: "Status",
            width: 150,
            renderCell: (item) => {
              return (
                <>
                  {item?.row?.Status === true ? (
                    <Typography>Active</Typography>
                  ) : (
                    <Typography>Inactive</Typography>
                  )}
                </>
              );
            },
            hideable: false,
          },
        ]
      : [
          {
            ...GRID_CHECKBOX_SELECTION_COL_DEF,
            hideable: false,
          },
          // { field: "GSSID", headerName: "GSS ID ", width: 100 },
          {
            field: "SchemeTitle",
            headerName: "Scheme Name",
            width: 220,
            hideable: false,
          },
          {
            field: "Regfees",
            headerName: "Registration Fees",
            width: 180,
            renderCell: (item) => (
              <Typography>{" ₹" + `${item?.row?.Regfees}` + "/-"}</Typography>
            ),
            hideable: false,
          },
          {
            field: "Duration",
            headerName: "Duration",
            width: 180,
            renderCell: (item) => {
              return (
                <>
                  <Typography>
                    {`${item?.row?.Duration}` + " Months"}
                  </Typography>
                </>
              );
            },
            hideable: false,
          },
          {
            field: "Status",
            headerName: "Status",
            width: 150,
            renderCell: (item) => {
              return (
                <>
                  {item?.row?.Status === true ? (
                    <Typography>Active</Typography>
                  ) : (
                    <Typography>Inactive</Typography>
                  )}
                </>
              );
            },
            hideable: false,
          },
        ];


  //edit scheme
  function ViewEditDetailsButton() {
    if (SUUid.length > 1) {
      setWarning("Select 1 record for edit or delete.");
      setalert(true);
    } else {
      var a = SUUid[0];
      navigate("/superuser/editscheme", { state: { SUUid: a } });
    }
  }

  let statusData = [
    { value: "Active", Status: 1 },
    { value: "InActive", Status: 0 },
  ];

  //delete scheme
  function DeleteScheme() {
    if (SUUid.length > 1) {
      setWarning("Select 1 record for edit or delete.");
      setalert(true);
    } else {
      dispatch(DeleteSchemefunc({ SUUid: SUUid[0],...global }));
    }
  }

  //handle filter
  const FilterHandler = (e) => {
    var key = e.target.name;
    var value = e.target.value;
    console.log(key, value);
    setFilters({ ...Filters, [key]: value });
  };

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
        <Box mr={3} mt={1}>
          <ReusableBreadcrumbs
            props={[
              {
                title: "Home",
                link: global.Utype == 1 ? "/executive" : "/agent",
                icon: "home",
              },
              {
                title: "Manage Schemes",
                link: "#",
                icon: "event_repeat",
              },
            ]}
          />
        </Box>
        {myPermission?.Create == 1 ? (
          <IconOnOffButton
            icon1={<AddCircleOutlineIcon fontSize="medium" />}
            Tooltip1={"ADD"}
            h1={"Add Scheme"}
            disable2={SUUid && SUUid.length !== 1 ? true : false}
            funcTrigger1={() => {
              navigate("/superuser/createscheme");
            }}
          />
        ) : null}
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} my={0} py={0}>
        <Divider />
      </Grid>
      {alert ? (
        <Grid item md={12} sm={12} xs={12} lg={12}>
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
      <Grid
        item
        sm={11}
        xs={11}
        md={9.8}
        lg={8}
        display={"flex"}
        justifyContent={{
          xl: "flex-start",
          lg: "flex-start",
          md: "flex-start",
          sm: "center",
          xs: "center",
        }}
        alignItems={"center"}
        flexWrap={"wrap"}
        color={"#000000"}
      >
        {myPermission?.Edit == 1 ? (
          <>
            <Box>
              <IconOnOffButton
                h1={"Edit"}
                icon1={<EditIcon fontSize="medium" />}
                textcolor2={SUUid && SUUid.length == 0 ? "grey" : "#c62828"}
                Tooltip1={"Edit"}
                disable1={SUUid && SUUid.length == 0 ? true : false}
                funcTrigger1={ViewEditDetailsButton}
                h2={"Delete"}
                icon2={
                  <DeleteIcon
                    fontSize="medium"
                    color={SUUid && SUUid.length == 0 ? "disabled" : "error"}
                  />
                }
                Tooltip2={"Delete"}
                disable2={SUUid && SUUid.length == 0 ? true : false}
                funcTrigger2={DeleteScheme}
              />
            </Box>
            <Box>
              <IconOnOffButton
                h1={"Active"}
                h2={"InActive"}
                textcolor1={SUUid && SUUid.length == 0 ? "black" : "#1b5e20"}
                textcolor2={SUUid && SUUid.length == 0 ? "black" : "#c62828"}
                icon1={
                  <CheckCircleOutlineOutlinedIcon
                    fontSize="medium"
                    color={SUUid && SUUid.length == 0 ? "disabled" : "success"}
                  />
                }
                icon2={
                  <CancelOutlinedIcon
                    fontSize="medium"
                    color={SUUid && SUUid.length == 0 ? "disabled" : "error"}
                  />
                }
                Tooltip1={"Active"}
                Tooltip2={"InActive"}
                disable1={SUUid && SUUid.length == 0 ? true : false}
                disable2={SUUid && SUUid.length == 0 ? true : false}
                funcTrigger1={ApprovedStatusHandler}
                funcTrigger2={RejectStatusHandler}
              />
            </Box>
            {global?.Utype == 1 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Typography>Scheme History</Typography>
                <IconButton
                  onClick={() => {
                    navigate("/superuser/scheme-history");
                  }}
                >
                  <HistoryIcon />
                </IconButton>
              </Box>
            ) : null}
          </>
        ) : null}
      </Grid>{" "}
      {global?.Utype === 2 ? null : (
        <Grid
          item
          sm={11.8}
          xs={11.8}
          md={1.8}
          lg={3.5}
          xl={2.2}
          display={"flex"}
          justifyContent={{
            lg: "flex-end",
            md: "flex-end",
            sm: "center",
            xl: "flex-end",
          }}
          alignItems={"center"}
          flexWrap={"wrap"}
          color={"#000000"}
          mt={2}
          mb={1}
          mr={1}
        >
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
      )}
      <Grid item sm={12} xs={12} md={12} lg={12} mt={1}>
        <ReusableDataTable
          uniqueid={"SUUid"}
          columns={columns}
          rows={SchemeDetails || []}
          state={SUUid}
          setState={setSUUid}
          isloading={isloading18}
          height={400}
        />
      </Grid>
    </Grid>
  );
}
