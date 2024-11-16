import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  Box,
  Button,
  Container,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import PersonIcon from "@mui/icons-material/Person";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PaymentsIcon from "@mui/icons-material/Payments";

import Header from "../../Components/Global/Header";
import LineChart from "../../Components/Global/LineChart";
import BarChart from "../../Components/Global/BarChart";
import StatBox from "../../Components/Global/StatBox";
import black from "../../assets/black.jpg";
import PieChart from "../../Components/Global/PieChart";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";

import Loader from "../../Components/Global/loader";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ClearToaster } from "../../Slice/Auth/AuthSlice";
import useFetchCards from "../../Apps/CustomHook/UseFetchCards";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchSession from "../../Apps/CustomHook/useFetchSession";
import useFetchSubscription from "../../Apps/CustomHook/UseFetchSubscription";
import useFetchBarChartData from "../../Apps/CustomHook/useFetchBarChartData";
import useFetchLineChartData from "../../Apps/CustomHook/useFetchLineChartData";
import useFetchBranch from "../../Apps/CustomHook/useFetchBranch";

const Dashboard = () => {
  //console.log("Dashboard");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, toasterBool } = UseFetchLogger();
  const [loading, setLoading] = useState(true);
  const [Filter, setFilter] = useState({
    AgentCode: null,
    year: null,
    monthe: null,
    Branch: null,
    Area: null,
  });
  const [SessionData, setSessionData] = useState({
    StartDate: "2023-03-31",
    EndDate: "2024-04-01",
  });
  const [sid, setSid] = useState(3);
  let obj = {};

  if (userInfo?.details?.Utype == 1) {
    obj.SuperUserID = userInfo?.details?.SuperUserID;
  } else if (userInfo?.details?.Utype == 2) {
    obj.AgentID = userInfo?.details?.AgentID;
    obj.AgentCode = userInfo?.details?.AgentCode;
  }

  const { CardData } = useFetchCards(obj, [], "");

  const { duepaycust } = useFetchSubscription(obj, [], "");

  const { branch } = useFetchBranch(obj, []);

  const { session } = useFetchSession();

  let TotalCust = CardData?.TotalCust;
  let TotalAgent = CardData?.TotalAgent;
  let TotalMaturedAcc = CardData?.TotalMaturedAcc;
  let TotalSuperUser = CardData?.TotalSuperUser;
  let TotalCollection = CardData?.TotalCollection;
  let Commission = CardData?.Commission;
  let totalcom = Math.floor(
    ((TotalCollection && TotalCollection) * Commission) / 100
  );

  useEffect(() => {
    let sarray = session?.filter((item) => item?.SessionID == sid);
    console.log(sarray);
    setSessionData({
      StartDate: sarray[0]?.StartDate,
      EndDate: sarray[0]?.EndDate,
    });
  }, [sid]);

  useEffect(() => {
    //all non 0 for superuser
    if (
      userInfo?.details?.Utype == 1 &&
      TotalCust > 0 &&
      TotalAgent > 0 &&
      TotalMaturedAcc > 0 &&
      TotalSuperUser > 0 &&
      duepaycust &&
      duepaycust?.length > 0
    ) {
      setLoading(false);
    }
    //some are 0 for superuser
    else if (
      userInfo?.details?.Utype == 1 &&
      (TotalCust == 0 ||
        TotalAgent == 0 ||
        TotalMaturedAcc == 0 ||
        TotalSuperUser == 0 ||
        (duepaycust && duepaycust?.length == 0))
    ) {
      const delay = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(delay);
    }
    //For Agent
    if (
      userInfo?.details?.Utype == 2 &&
      TotalCust > 0 &&
      TotalCollection > 0 &&
      Commission > 0 &&
      totalcom > 0 &&
      duepaycust &&
      duepaycust?.length > 0
    ) {
      setLoading(false);
    }
    //some are 0 forsuperuser
    else if (
      userInfo?.details?.Utype == 2 &&
      (TotalCust == 0 ||
        TotalCollection == 0 ||
        Commission == 0 ||
        totalcom == 0 ||
        (duepaycust && duepaycust?.length == 0))
    ) {
      const delay = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(delay);
    }
  }, [CardData, duepaycust?.length]);

  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var Collectionpermission =
    parray && parray.filter((i) => i?.PageName == "Manage Collections")[0];
  var CustPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Customer")[0];
  var AgentPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Agent")[0];
  var SuperPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Backoffice")[0];
  var SubscriptionPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Subscriptions")[0];

  useEffect(() => {
    if (toasterBool) {
      toast.success(`${userInfo?.response}`, {
        positions: toast.POSITION.TOP_RIGHT,
      });
    }
    dispatch(ClearToaster());
  }, [toasterBool]);

  const { data } = useFetchLineChartData(
    {
      StartDate: SessionData?.StartDate || "2024-04-01",
      EndDate: SessionData?.EndDate || "2025-03-31",
    },
    [SessionData]
  );

  const {
    bardata = [],
    nameArray = [],
    isloading69,
  } = useFetchBarChartData({}, []);

  const onChangeHandler = (e) => {
    let key = e.target.value;
    let value = e.target.value;
    setFilter({ ...Filter, [key]: value });
  };
  console.log(data, "dashboard");
  return (
    <Grid container maxWidth={"xl"} columnGap={2} rowGap={2} ml={3} mt={3}>
      <ToastContainer autoClose={8000} />
      {/* HEADER */}
      <Grid item md={2} lg={3} xs={12} sm={12}>
        <Header
          title="DASHBOARD"
          subtitle={`Welcome ${
            userInfo?.details?.Name || userInfo?.details?.CustomerName
          }`}
          editable={false}
        />
      </Grid>
      <Grid item md={3} lg={2.5} sm={4} xs={12}>
        <ReusableDropDown4
          Field={Filter?.Branch}
          ObjectKey={["BranchCode"]}
          data={branch}
          deselectvalue={true}
          disabled={false}
          id={"branch_id"}
          label={"Branch"}
          onChange={onChangeHandler}
          uniquekey={"BranchId"}
          key={1}
        />
      </Grid>
      {/**cards */}
      <Grid
        item
        lg={2.2}
        md={2.6}
        sm={5.5}
        xs={12}
        p={2}
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${black})`,
          alignItems: "center",
          justifyContent: "center",
          backgroundSize: "cover",
          borderRadius: 3,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        }}
        onClick={() => {
          if (CustPermission?.ViewPage == 1) {
            navigate("/superuser/customermanagement");
          }
        }}
      >
        {!loading ? (
          <StatBox
            title={TotalCust}
            subtitle="Total Customer"
            // progress="0.75"
            // increase="+14%"
            stcolor={"#ffffff"}
            icon={
              <PersonIcon
                sx={{
                  color: "whitesmoke",
                  fontSize: "35px",
                }}
              />
            }
          />
        ) : (
          <Box my={3}>
            <Loader />
          </Box>
        )}
      </Grid>
      <Grid
        item
        lg={2.2}
        md={2.6}
        sm={5.5}
        xs={12}
        p={2}
        sx={{
          backgroundImage: `linear-gradient(135deg,#ff461c,#f58505)`,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        }}
        onClick={() => {
          if (SubscriptionPermission?.ViewPage == 1) {
            navigate("/executive/managesubscriptions");
          }
        }}
      >
        {!loading ? (
          <StatBox
            title={TotalMaturedAcc}
            subtitle="Total Maturity"
            // progress="0.75"
            // increase="+14%"
            stcolor={"#fafafa"}
            icon={<BeenhereIcon sx={{ color: "#fafafa", fontSize: "35px" }} />}
          />
        ) : (
          <Box my={3}>
            <Loader />
          </Box>
        )}
      </Grid>
      <Grid
        item
        lg={2.2}
        md={2.6}
        sm={5.5}
        xs={12}
        p={2}
        sx={{
          backgroundImage: `linear-gradient(135deg,#d10088,#4300b0)`,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        }}
        onClick={() => {
          if (Collectionpermission?.ViewPage == 1) {
            navigate("/executive/managecollections");
          }
        }}
      >
        {!loading ? (
          <StatBox
            title={" ₹ " + `${TotalCollection ? TotalCollection : 0}` + "/-"}
            subtitle="Total Collections"
            // progress="0.50"
            // increase="+21%"
            stcolor={"#fafafa"}
            icon={
              <PointOfSaleIcon sx={{ color: "#fafafa", fontSize: "30px" }} />
            }
          />
        ) : (
          <Box my={3}>
            <Loader />
          </Box>
        )}
      </Grid>
      <Grid
        item
        lg={2.2}
        md={2.6}
        sm={5.5}
        xs={12}
        p={2}
        sx={{
          backgroundImage: `linear-gradient(135deg,#0062ff,#4300b0)`,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        }}
        onClick={() => {
          if (userInfo?.details?.Utype == 1 && AgentPermission?.ViewPage == 1) {
            navigate("/superuser/agentmanagement");
          } else if (
            userInfo?.details?.Utype == 2 &&
            Collectionpermission?.ViewPage == 1
          ) {
            navigate("/executive/managecollections");
          }
        }}
      >
        {userInfo?.details?.Utype == 1 ? (
          <>
            {loading ? (
              <Box my={3}>
                <Loader />
              </Box>
            ) : (
              <StatBox
                title={TotalAgent}
                subtitle="Total Agents"
                // progress="0.30"
                // increase="+5%"
                stcolor={"#fafafa"}
                icon={
                  <SupportAgentIcon
                    sx={{ color: "#fafafa", fontSize: "30px" }}
                  />
                }
              />
            )}
          </>
        ) : (
          <>
            {!loading ? (
              <StatBox
                title={`${Commission} % `}
                subtitle="Commission Percentage"
                stcolor={"#fafafa"}
                icon={
                  <PaymentsIcon sx={{ color: "#fafafa", fontSize: "30px" }} />
                }
              />
            ) : (
              <Box my={3}>
                <Loader />
              </Box>
            )}
          </>
        )}
      </Grid>
      <Grid
        item
        lg={2.2}
        md={2.6}
        sm={5.5}
        xs={12}
        p={2}
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${black})`,
          alignItems: "center",
          justifyContent: "center",
          backgroundSize: "cover",
          borderRadius: 3,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        }}
        onClick={() => {
          if (userInfo?.details?.Utype == 1 && SuperPermission?.ViewPage == 1) {
            navigate("/superuser/superusermanagement");
          } else if (
            userInfo?.details?.Utype == 2 &&
            Collectionpermission?.ViewPage == 1
          ) {
            navigate("/executive/managecollections");
          }
        }}
      >
        {userInfo?.details?.Utype == 1 ? (
          <>
            {loading ? (
              <Box my={3}>
                <Loader />
              </Box>
            ) : (
              <StatBox
                title={TotalSuperUser}
                subtitle="Total SuperUser"
                stcolor={"#fafafa"}
                // progress="0.30"
                // increase="+5%"
                icon={
                  <ManageAccountsIcon
                    sx={{ color: "#fafafa", fontSize: "30px" }}
                  />
                }
              />
            )}
          </>
        ) : (
          <>
            {!loading ? (
              <StatBox
                title={`₹ ${totalcom} /-`}
                subtitle="Agent Commission in Rupees"
                stcolor={"#fafafa"}
                // progress="0.30"
                // increase="+5%"
                icon={
                  <CurrencyRupeeIcon
                    sx={{ color: "#fafafa", fontSize: "30px" }}
                  />
                }
              />
            ) : (
              <Box my={3}>
                <Loader />
              </Box>
            )}
          </>
        )}
      </Grid>

      {/**Line graph */}
      <Grid
        item
        xl={12}
        lg={12}
        md={12}
        sm={12}
        xs={12}
        sx={{
          backgroundColor: "#fafafa",
          borderRadius: 1.5,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          mt="25px"
          p="0 30px"
          display="flex "
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h6" fontWeight="600" color={"#374151"}>
              Branch wise Yearly Collection
            </Typography>
            <Typography fontWeight="bold" color={"#059669"}>
              ₹{TotalCollection}/-
            </Typography>
          </Box>
          <Box width={"250px"}>
            {/* <IconButton>
              <DownloadOutlinedIcon
                sx={{ fontSize: "26px", color: "#059669" }}
              />
            </IconButton> */}
            <ReusableDropDown4
              Field={sid}
              data={session}
              disabled={false}
              ObjectKey={["Session"]}
              deselectvalue={false}
              id={"arial"}
              label={"Session"}
              onChange={(e) => {
                setSid(e.target.value);
              }}
              uniquekey={"SessionID"}
            />
          </Box>
        </Box>
        <Box height="250px" m="-20px 0 0 0">
          <LineChart
            sdata={data}
            Xaxislegend={"Month"}
            Yaxislegend={"Collection(Lakhs)(₹)"}
          />
        </Box>
      </Grid>
      {/**Multi card */}
      <Grid
        item
        xl={5.9}
        lg={5.8}
        md={5.7}
        sm={12}
        xs={12}
        sx={{
          backgroundColor: "#fafafa",
          borderRadius: 1.5,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        {/**Title of Multi card */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={"2px solid #696969"}
          colors={"#374151"}
          p="15px"
        >
          <Typography color={"#374151"} variant="h6" fontWeight="600">
            Customers of Due Payment
          </Typography>
        </Box>

        {loading ? (
          <Box mt={10} height="100%" width="100%">
            <Loader SpinnerColor="#00956c" />
          </Box>
        ) : (
          <Box height="320px" width="100%" sx={{ overflowY: "scroll" }}>
            {duepaycust?.map((i, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={"1px solid #BEBEBE"}
                p="15px"
              >
                <Box>
                  <Typography color={"#059669"} fontWeight="500">
                    {i?.CustomerName}
                  </Typography>
                  <Typography color={"#374151"}>{i?.AgentCode}</Typography>
                </Box>
                <Box color={"#374151"} textAlign={"right"} display={"flex"}>
                  <Box color={"#374151"} textAlign={"right"} mr={1}>
                    {" "}
                    Due Date
                    <br />
                    {moment(i?.lastDate).format("DD-MM-YYYY")}
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    backgroundColor={"#059669"}
                    color={"#ffffff"}
                    p="5px"
                    height={"32px"}
                    borderRadius="4px"
                    onClick={() => {
                      if (CustPermission?.Edit == 1) {
                        navigate("/superuser/vieweditcustomer", {
                          state: { CustUUid: i?.CustomerUUid },
                        });
                      }
                    }}
                  >
                    ₹{i?.amttobepaid}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Grid>
      {/**pie chart */}
      <Grid
        item
        sx={{
          pt: "20px",
          textAlign: "center",
          backgroundColor: "#fafafa",
          borderRadius: 1.5,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        }}
        xl={5.9}
        lg={5.8}
        md={5.7}
        sm={12}
        xs={12}
      >
        <Typography
          variant="h6"
          fontWeight="600"
          color={"#374151"}
          sx={{ borderBottom: "2px solid grey", pb: 1.3 }}
        >
          Registration vs Maturity
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt="20px"
          color={"#000000"}
        >
          <PieChart />
        </Box>
      </Grid>
      {/**Bar graph */}
      <Grid
        item
        sx={{
          backgroundColor: "#fafafa",
          borderRadius: 1.5,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
          px: {
            lg: 5,
            md: 3,
            sm: 1,
            xs: 0.5,
          },
        }}
        xl={12}
        lg={12}
        md={12}
        sm={12}
        xs={12}
      >
        <Typography
          variant="h6"
          fontWeight="600"
          color={"#374151"}
          ml={2}
          mt={2}
        >
          Top 5 Agent's Area Wise Collection
        </Typography>
        <BarChart
          data={bardata}
          nameArray={nameArray}
          isload={isloading69}
          XaxisName={"Collection(₹) in Lakhs"}
          YaxisName={"Agent"}
          index={"AgentName"}
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
