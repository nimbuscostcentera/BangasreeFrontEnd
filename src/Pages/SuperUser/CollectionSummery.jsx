import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Typography,
  Divider,
  Alert,
  AlertTitle,
  Stack,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import Grid from "@mui/system/Unstable_Grid";

import DateRangFilter2 from "../../Components/Global/DateRangeFilter2";
import ReusableDataTable from "../../Components/Global/ReusableTable";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";

import CloseIcon from "@mui/icons-material/Close";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import VisibilityIcon from "@mui/icons-material/Visibility";
import PreviewIcon from "@mui/icons-material/Preview";

import { LotListfunc } from "../../Slice/Collection/LotListSlice";
import {
  PaymentStatusUpdate,
  ClearState30,
} from "../../Slice/PaymentDetails/PaymentStatusUpdateSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchAcode from "../../Apps/CustomHook/useFetchAcode";

export default function CollectionSummary() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentdate = moment();
  const [Lot, setLot] = useState();
  const [LotID, setLotID] = useState([]);
  const [params, setParams] = useState({
    alert: false,
    warning: "",
    openModal: false,
  });
  const [Filters, setFilters] = useState({
    Status: -1,
    EndDate: null,
    StartDate: null,
    AgentCode: null,
  });
  //auth
  const { global } = UseFetchLogger();
  const { AgentCode } = useFetchAcode({}, []);
  //Lot List for Table
  const { isLotLoading, LotList, isLotSuccess } = useSelector(
    (state) => state.alllots
  );
  const { isloading30, Resp30, error30, isError30, isSuccess30 } = useSelector(
    (state) => state.PayStatusUpdate
  );
  //Lot Lot Approval
  //   const { isloading21, Msg21, error21, isError21, isSuccess21 } = useSelector(
  //     (state) => state.LotStatusUpdate
  //   );

  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Collection Summary")[0];

  useEffect(() => {
    if (global?.Utype === 2) {
      dispatch(LotListfunc({ ...global, Status: 1 }));
    } else {
      dispatch(LotListfunc({ ...global, ...Filters }));
    }
  }, [Filters, isSuccess30]);

  //Lot List
  useEffect(() => {
    if (!isLotLoading && isLotSuccess) {
      setLot(LotList);
    }
  }, [Filters, isLotSuccess, isSuccess30]);

  //toaster on status
  useEffect(() => {
    if (!isloading30 && isSuccess30) {
      toast.success(Resp30, { autoClose: 5000, position: "top-right" });
      setLotID([]);
    }
    if (!isloading30 && isError30) {
      toast.error(error30, { autoClose: 5000, position: "top-right" });
    }
    dispatch(ClearState30());
  }, [isloading30, Resp30, error30, isError30, isSuccess30]);

  useEffect(() => {
    if (LotID && LotID.length == 0) {
      setParams({ ...params, alert: false, warning: "" });
    }
  }, [LotID]);

  //function of status update
  const ApprovedStatusHandler = () => {
    const UserData = { Status: 3, LotId: LotID, ...global };
    dispatch(PaymentStatusUpdate(UserData));
  };

  //function of status update
  const RejectStatusHandler = () => {
    const UserData = { Status: 4, LotId: LotID, ...global };
    dispatch(PaymentStatusUpdate(UserData));
  };

  const columns = [
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      hideable: false,
    },
    // { field: "GSSID", headerName: "GSS ID ", width: 100 },
    {
      field: "AgentCode",
      headerName: "Agent Code",
      width: 100,
      hideable: false,
    },
    {
      field: "AgentName",
      headerName: "Agent",
      width: 150,
      hideable: false,
    },
    {
      field: "CollectedAmt",
      headerName: "Submited Amt.",
      width: 110,
      renderCell: (item) => {
        return <Typography>{`₹${item?.row?.CollectedAmt}-/`}</Typography>;
      },
      hideable: false,
    },
    {
      field: "Date",
      headerName: "Submission Date",
      width: 130,
      renderCell: (item) => {
        return <>{`${moment(item?.row?.Date).format("DD/MM/YYYY")}`}</>;
      },
      hideable: false,
    },
    {
      field: "PaymentStatus",
      headerName: "Status",
      width: 100,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.PaymentStatus === 1 ? (
              <Typography>Collected</Typography>
            ) : item?.row?.PaymentStatus === 2 ? (
              <Typography>Submitted</Typography>
            ) : item?.row?.PaymentStatus === 3 ? (
              <Typography>Approved</Typography>
            ) : (
              <Typography>Rejected</Typography>
            )}
          </>
        );
      },
    },
    {
      field: "pic",
      headerName: "Picture",
      width: 70,
      renderCell: (item) => {
        return (
          <React.Fragment>
            <IconButton onClick={HandleOpenModal}>
              <InsertPhotoIcon />
            </IconButton>
            <Dialog
              fullScreen
              open={params?.openModal}
              onClose={HandleCloseModal}
            >
              <DialogTitle
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>Receipt of Submission</Typography>
                <IconButton onClick={HandleCloseModal}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <Divider />
              <DialogContent
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box>
                  <img src={item?.row?.pic} width={900} height={600} />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={HandleCloseModal}
                  type={"button"}
                  color="error"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>
        );
      },
    },
  ];

  let statusData = [
    { value: "Collected", Status: 1 },
    { value: "Submitted", Status: 2 },
    { value: "Approved", Status: 3 },
    { value: "Rejected", Status: 4 },
  ];

  const HandleOpenModal = () => {
    setParams({ ...params, openModal: true });
  };
  const HandleCloseModal = () => {
    setParams({ ...params, openModal: false });
  };
  //handle filter
  const FilterHandler = (e) => {
    var key = e.target.name;
    var value = e.target.value;
    console.log(key, value);
    setFilters({ ...Filters, [key]: value });
  };
  //navigation to detail view
  const DetailCollection = () => {
    if (LotID?.length == 1) {
      navigate("/executive/managecollections", {
        state: { LotId: LotID[0] },
      });
    } else {
      setParams({
        ...params,
        alert: true,
        warning: "Select 1 Agent's Collection To View Details.",
      });
    }
  };
  return (
    <Grid container ml={1} mt={2} columnGap={2} maxWidth={"xxl"}>
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
        ml={2}
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
                title: "Collection Summary",
                link: "#",
                icon: "savings",
              },
            ]}
          />
        </Box>
        <IconOnOffButton
          icon1={<VisibilityIcon fontSize="medium" />}
          Tooltip1={"ADD"}
          h1={"All Collection"}
          disable2={LotID && LotID.length !== 1 ? true : false}
          funcTrigger1={() => {
            navigate("/executive/managecollections");
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} my={0} py={0}>
        <Divider />
      </Grid>
      {params?.alert ? (
        <Grid item sm={12} xs={12} md={12} lg={12}>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert
                severity="error"
                onClose={() => {
                  setParams({ ...params, alert: false, warning: null });
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
        xl={3.3}
        lg={3.8}
        md={6}
        sm={12}
        xs={12}
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
        mb={1}
        ml={2}
      >
        <Box>
          <DateRangFilter2
            state1={Filters?.StartDate}
            state2={Filters?.EndDate}
            name1={"StartDate"}
            name2={"EndDate"}
            MaxDate1={
              Filters?.EndDate !== undefined &&
              Filters?.EndDate !== null &&
              Filters?.EndDate !== ""
                ? Filters?.EndDate
                : currentdate
            }
            MaxDate2={currentdate}
            InputHandler={FilterHandler}
          />
        </Box>
      </Grid>
      <Grid
        item
        xl={3.5}
        lg={3.8}
        md={5.5}
        sm={12}
        xs={12}
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
          <Box>
            <IconOnOffButton
              h1={"Accept"}
              h2={"Reject"}
              textcolor1={LotID && LotID.length == 0 ? "black" : "#1b5e20"}
              textcolor2={LotID && LotID.length == 0 ? "black" : "#c62828"}
              icon1={
                <CheckCircleOutlineOutlinedIcon
                  fontSize="medium"
                  color={LotID && LotID.length == 0 ? "disabled" : "success"}
                />
              }
              icon2={
                <CloseIcon
                  fontSize="medium"
                  color={LotID && LotID.length == 0 ? "disabled" : "error"}
                />
              }
              Tooltip1={"Active"}
              Tooltip2={"InActive"}
              disable1={LotID && LotID.length == 0 ? true : false}
              disable2={LotID && LotID.length == 0 ? true : false}
              funcTrigger1={ApprovedStatusHandler}
              funcTrigger2={RejectStatusHandler}
            />
          </Box>
        ) : null}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography>Details</Typography>
          <IconButton onClick={DetailCollection}>
            <PreviewIcon />
          </IconButton>
        </Box>
      </Grid>
      <Grid
        item
        xl={2}
        lg={1.6}
        md={5.5}
        sm={5}
        xs={12}
        display={"flex"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        flexWrap={"wrap"}
        color={"#000000"}
        mt={2}
        mb={1}
        ml={2}
      >
        <ReusableDropDown4
          setState={setFilters}
          state={Filters}
          label={"Agent"}
          data={AgentCode}
          id={"arial_agent"}
          disabled={false}
          ObjectKey={["AgentCode", "Name"]}
          Field={Filters?.AgentCode}
          uniquekey={"AgentCode"}
          deselectvalue={true}
          onChange={FilterHandler}
        />
      </Grid>
      <Grid
        item
        xl={2}
        lg={1.6}
        md={5.5}
        sm={5}
        xs={12}
        display={"flex"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        flexWrap={"wrap"}
        color={"#000000"}
        mt={2}
        mb={1}
        ml={2}
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
      <Grid item sm={12} xs={12} md={12} lg={12} mt={1} ml={2}>
        <ReusableDataTable
          uniqueid={"LotId"}
          columns={columns}
          rows={Lot || []}
          state={LotID}
          setState={setLotID}
          isloading={isLotLoading}
          height={"70vh"}
          width="98%"
        />
      </Grid>
    </Grid>
  );
}
