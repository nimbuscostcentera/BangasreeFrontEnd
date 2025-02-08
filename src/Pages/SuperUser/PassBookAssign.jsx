import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { Box } from "@mui/system";
import Grid from "@mui/system/Unstable_Grid/Grid";
import {
  Typography,
  Modal,
  Divider,
  Alert,
  AlertTitle,
  Stack,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";
import StatBox from "../../Components/Global/StatBox";
import Loader from "../../Components/Global/loader";

import InventoryIcon from "@mui/icons-material/Inventory";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

import { AgentPBList } from "../../Slice/PassBook/AgentPBSlice";
import {
  PBreturnFunc,
  ClearState56,
} from "../../Slice/PassBook/BackPBfromAgent";
import {
  AgentPBAssign,
  ClearState50,
} from "../../Slice/PassBook/AgentPBAssignSlice";
import {
  AvailPassBookList,
  ClearState55,
} from "../../Slice/PassBook/AvailPassBookSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";

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

function PassBookAssign() {
  const location = useLocation();
  const { agent } = location.state;
  const dispatch = useDispatch();
  const [passid, setpassid] = useState([]); //selected passbook number to transfer passbook
  const [passreturnid, setpassreturnid] = useState([]); //the passbooks that selected to return
  const [params, setParams] = useState({ alert: false, warning: "" });
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  //auth detail
  const { userInfo, global } = UseFetchLogger();
  //console.log("ass pss", agent);
  //Passbook not assigned to any customer or agent
  const { isloading55, isSuccess55, isError55, error55, Resp55 } = useSelector(
    (state) => state.PBList
  );
  //agent's Passbook list
  const { isloading49, isSuccess49, isError49, error49, Resp49 } = useSelector(
    (state) => state.agentPB
  );
  //Passbook assign to agent
  const { isloading50, isSuccess50, isError50, error50, Resp50 } = useSelector(
    (state) => state.AgentPBAssign
  );
  //passbook return from agent to branch stock
  const { isloading56, isSuccess56, isError56, error56, Resp56 } = useSelector(
    (state) => state.AgentPBreturn
  );
  //PassBook stock in branch
  useEffect(() => {
    var obj = {
      SuperUserID: userInfo?.details?.UserID,
      BranchId: agent?.BranchId,
    };
    dispatch(AvailPassBookList({ ...global, ...obj }));
  }, [isSuccess50, isSuccess56]);

  //PassBook stock in branch
  let pb = useMemo(() => {
    if (isSuccess55 && !isloading55) {
      return Resp55 || [];
    }
  }, [isSuccess55, isSuccess50, isSuccess56]);

  //Agent's Passbook list
  useEffect(() => {
    var obj = {
      SuperUserID: userInfo?.details?.UserID,
      BranchId: agent?.BranchId,
      AgentID: agent?.AgentID,
    };
    dispatch(AgentPBList({ ...global, ...obj }));
  }, [isSuccess50, isSuccess56]);

  //Agent's Passbook list
  let apb = useMemo(() => {
    if (isSuccess49 && !isloading49) {
      return Resp49;
    } else {
      return [];
    }
  }, [isSuccess49, isSuccess50, isSuccess56]);

  //Passbook assign to agent response
  useEffect(() => {
    if (isSuccess50 && !isloading50) {
      toast.success(Resp50, { position: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState50());
    }
    if (isError50 && !isloading50) {
      toast.error(error50, { position: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState50());
    }
    if (isSuccess56 && !isloading56) {
      toast.success(Resp56, { position: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState56());
    }
    if (isError56 && !isloading56) {
      toast.error(error56, { position: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState56());
    }
  }, [isSuccess50, isError50, isSuccess56, isError56]);

  var column = [
    { field: "PassBookId", headerName: "ID", width: 100 },
    {
      field: "PassBookNo",
      headerName: "PassBookNo",
      width: 200,
      editable: true,
      type: "textinput",
    },
  ];

  const OnAssignePB = () => {
    var arr = [];
    if (passid?.length !== 0) {
      passid &&
        passid.map((i) => {
          pb &&
            pb.map((j) => {
              if (j?.PassBookId == i) {
                arr.push({
                  PassBookId: j?.PassBookId,
                  PassBookNo: j?.PassBookNo,
                });
              }
            });
        });
      var obj = { data: arr };
      dispatch(AgentPBAssign({ ...global, ...obj, AgentID: agent?.AgentID }));
    } else {
      setParams({
        alert: true,
        warning: "First select PassBook then transfer Passbook.",
      });
    }
  };

  const OnPassBookReturn = (e) => {
    e.preventDefault();
    if (passreturnid?.length !== 0) {
      var arr = [];
      var a;
      passreturnid?.map((i) => {
        apb &&
          apb.map((j) => {
            if (j?.PassBookId == i) {
              arr.push({
                PassBookId: j?.PassBookId,
                PassBookNo: j?.PassBookNo,
              });
            }
          });
      });
      var obj = { data: arr };
      dispatch(PBreturnFunc({ ...obj, ...global, AgentID: agent?.AgentID }));
    } else {
      setParams({ alert: true, warning: "First Select Passbook to return." });
    }
  };
  useEffect(() => {
    if (isloading56 || isloading50 || isloading49 || isloading55) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isloading56, isloading50, isloading49, isloading55]);
  //console.log(isloading56, isloading50, isloading49, isloading55);
  return (
    <ThemeProvider theme={CustomTheme}>
      <Grid
        container
        maxWidth={"Big"}
        columnGap={2}
        rowGap={1}
        ml={2}
        mt={3}
        mb={2}
      >
        <ToastContainer autoClose={5000} />
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
        <Grid
          item
          sm={12}
          xs={12}
          md={12}
          lg={12}
          xl={12}
          xxl={12}
          display={"flex"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
          color={"black"}
        >
          <ReusableBreadcrumbs
            props={[
              {
                title: "Home",
                link: global.Utype == 1 ? "/executive" : "/agent",
                icon: "home",
              },
              {
                title: "Manage Agent",
                link: "/superuser/agentmanagement",
                icon: "manage_accounts",
              },
              {
                title: "Assign PassBook to Agent",
                link: "#",
                icon: "note_add",
              },
            ]}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
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
                    setParams({
                      alert: false,
                      warning: "",
                    });
                  }}
                >
                  <AlertTitle>Warning</AlertTitle>
                  {params?.warning}
                </Alert>
              </Stack>
            </Box>
          </Grid>
        ) : null}
        {/*cards*/}
        <Grid
          item
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"flex-start"}
          flexWrap={"wrap"}
        >
          <Box
            width={"11.5rem"}
            height={"8rem"}
            m={1.3}
            bgcolor={"#f0f0f0"}
            pt={1}
            px={0.5}
            borderRadius={2}
          >
            <StatBox
              title={`${agent?.Name}`}
              title2={`${agent?.AgentCode}`}
              subtitle={"Agent"}
              icon={
                <SupportAgentIcon sx={{ color: "#10b981", fontSize: "35px" }} />
              }
            />
          </Box>
          <Box
            width={"11.5rem"}
            height={"8rem"}
            m={1.3}
            bgcolor={"#f0f0f0"}
            pt={1}
            px={0.5}
            borderRadius={2}
          >
            <StatBox
              title={agent?.Phonenumber}
              title2={agent?.EmailId}
              subtitle={"Contact Detail"}
              icon={
                <ConnectWithoutContactIcon
                  sx={{ color: "#10b981", fontSize: "35px" }}
                />
              }
            />
          </Box>
          <Box
            width={"11.5rem"}
            height={"8rem"}
            m={1.3}
            bgcolor={"#f0f0f0"}
            pt={1}
            px={0.5}
            borderRadius={2}
          >
            <StatBox
              title={`Branch Name : ${agent?.branchname}`}
              title2={`Branch Code : ${agent?.branchcode}`}
              subtitle={"Branch Name"}
              icon={
                <AccountTreeIcon sx={{ color: "#10b981", fontSize: "35px" }} />
              }
            />
          </Box>
          <Box
            width={"11.5rem"}
            height={"8rem"}
            m={1.3}
            bgcolor={"#f0f0f0"}
            pt={1}
            px={0.5}
            borderRadius={2}
          >
            <StatBox
              title={`${apb && apb?.length}`}
              title2={"Total Number of"}
              subtitle={"Assigned PassBook"}
              icon={
                <InventoryIcon sx={{ color: "#10b981", fontSize: "35px" }} />
              }
            />
          </Box>
          <Box
            width={"11.5rem"}
            height={"8rem"}
            m={1.3}
            bgcolor={"#f0f0f0"}
            pt={1}
            px={0.5}
            borderRadius={2}
          >
            <StatBox
              title={`${pb && pb?.length}`}
              title2={"Total Number of"}
              subtitle={"Available PassBook"}
              icon={
                <InventoryIcon sx={{ color: "#10b981", fontSize: "35px" }} />
              }
            />
          </Box>
        </Grid>
        <Grid
          item
          md={12}
          lg={4.7}
          sm={12}
          xs={12}
          ml={2}
          textAlign={"center"}
          color={"#000000"}
          display={"flex"}
        >
          <Box sx={{ height: "18rem", width: "100%" }}>
            {" "}
            <Typography sx={{ textAlign: "center" }} variant="h6">
              PassBook Stock in Branch
            </Typography>
            <br />
            <DataGrid
              selectRow
              getRowId={(rows) => {
                if (!rows) {
                  return -1;
                } else {
                  return rows["PassBookId"];
                }
              }}
              loading={pb == undefined ? true : false}
              density="compact"
              hideFooterPagination
              hideFooter
              columns={column}
              rows={pb || []}
              checkboxSelection
              onRowSelectionModelChange={(id) => {
                const SelectedIDs = new Set(id);
                const IDarr = Array.from(SelectedIDs);
                setpassid(IDarr);
              }}
            />
          </Box>
        </Grid>
        <Grid
          item
          md={12}
          lg={1.4}
          sm={12}
          xs={12}
          mr={-2}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box mt={7}>
            <IconOnOffButton
              icon2={<ArrowForwardIcon fontSize={"large"} />}
              icon1={<ArrowBackIcon fontSize={"large"} />}
              funcTrigger2={OnAssignePB}
              funcTrigger1={OnPassBookReturn}
              Tooltip2={"Assign Passbook"}
              Tooltip1={"Unassign Passbook"}
            />
          </Box>
        </Grid>{" "}
        <Grid item md={12} lg={4.5} sm={12} color={"#000000"} display={"flex"}>
          {" "}
          <Box sx={{ height: "18rem", width: "100%" }}>
            {" "}
            <Typography sx={{ textAlign: "center" }} variant="h6">
              PassBook Assigned to Agent
            </Typography>
            <br />
            <DataGrid
              selectRow
              getRowId={(rows) => {
                if (!rows) {
                  return -1;
                } else {
                  return rows["PassBookId"];
                }
              }}
              loading={apb == undefined ? true : false}
              pageSizeOptions={[15, 20]}
              columns={column}
              rows={apb || []}
              density="compact"
              hideFooterPagination
              hideFooter
              checkboxSelection
              onRowSelectionModelChange={(id) => {
                const SelectedIDs = new Set(id);
                const IDarr = Array.from(SelectedIDs);
                setpassreturnid(IDarr);
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
export default PassBookAssign;
