import { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Box, Typography } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

import Grid from "@mui/system/Unstable_Grid/Grid";
import PersonIcon from "@mui/icons-material/Person";
import PaymentsIcon from "@mui/icons-material/Payments";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import Loader from "../../Components/Global/loader";
import Header from "../../Components/Global/Header";
import StatBox from "../../Components/Global/StatBox";
import BarChart from "../../Components/Global/BarChart";
import LineChart from "../../Components/Global/LineChart";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";

import black from "../../assets/black.jpg";
import { ClearToaster } from "../../Slice/Auth/AuthSlice";
import useFetchCards from "../../Apps/CustomHook/UseFetchCards";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchSession from "../../Apps/CustomHook/useFetchSession";
import useFetchSubscription from "../../Apps/CustomHook/UseFetchSubscription";
import useFetchAgentAreaColl from "../../Apps/CustomHook/useFetchAgentAreaCol";
import useFetchAgentYearlyReport from "../../Apps/CustomHook/useFetchAgentYearlyReport";
import useFetchDueLeads from "../../Apps/CustomHook/useFetchDueLeads";

function PerformanceReport() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sid, setSid] = useState(3);
  const { userInfo, toasterBool } = UseFetchLogger();
  const [loading, setLoading] = useState(true);
  const [SessionData, setSessionData] = useState({
    StartDate: "2024-04-01",
    EndDate: "2025-03-31",
  });

  let obj = {};

  useEffect(() => {
    let sarray = session?.filter((item) => item?.SessionID == sid);
    console.log(sarray);
    setSessionData({
      StartDate: sarray[0]?.StartDate,
      EndDate: sarray[0]?.EndDate,
    });
  }, [sid]);

  if (userInfo?.details?.Utype == 2) {
    obj.AgentID = userInfo?.details?.AgentID;
    obj.AgentCode = userInfo?.details?.AgentCode;
  }
  const { CardData } = useFetchCards(obj, []);

  const { duepaycust } = useFetchSubscription(obj, [], "");

  const { session } = useFetchSession();

  const { DueleadList } = useFetchDueLeads({AgentCode:userInfo?.details?.AgentCode},[]);

  let TotalCust = CardData?.TotalCust;
  let TotalLeads = CardData?.TotalLeads;
  let TotalCollection = CardData?.TotalCollection;
  let Commission = CardData?.Commission;
  let totalcom = (((TotalCollection && TotalCollection) * Commission) / 100).toFixed(2);

  useEffect(() => {
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
  var LeadsPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Leads")[0];

  useEffect(() => {
    if (toasterBool) {
      toast.success(`${userInfo?.response}`, {
        positions: toast.POSITION.TOP_RIGHT,
      });
    }
    dispatch(ClearToaster());
  }, [toasterBool]);

  const { data } = useFetchAgentYearlyReport(
    {
      StartDate: SessionData?.StartDate,
      EndDate: SessionData?.EndDate,
      BranchName: userInfo?.details?.BranchName,
    },
    [sid]
  );

  const { AreaAgentData = [], nameArray = [], isloading73 = false } = useFetchAgentAreaColl({},[]);
 

  return (
    <Grid container maxWidth={"xl"} columnGap={2} rowGap={2} ml={3} mt={3}>
      <ToastContainer autoClose={8000} />
      {/* HEADER */}
      <Grid
        item
        md={12}
        lg={12}
        xs={12}
        sm={12}
        display={"flex"}
        flexDirection={"row"}
        flexWrap={"wrap"}
        justifyContent={"flex-start"}
      >
        <Header
          title="Performance Report"
          subtitle={`Welcome ${userInfo?.details?.Name}`}
          editable={false}
        />
      </Grid>
      {/**cards */}
      {/**Leads */}
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
          if (LeadsPermission?.ViewPage == 1) {
            navigate("/executive/manageleads");
          }
        }}
      >
        {!loading ? (
          <StatBox
            title={TotalLeads}
            subtitle="Total Leads"
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
      {/**Customer */}
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
            navigate("/superuser/customermanagement", {
              state: {
                AgentCode: userInfo?.details?.AgentCode,
                Status: 1,
                BranchId: userInfo?.details?.BranchId,
              },
            });
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
      {/**Collection */}
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
            navigate("/executive/managecollections", {
              state: {
                AgentCode: userInfo?.details?.AgentCode,
                BranchId: userInfo?.details?.BranchId,
                StartDate: moment().format("YYYY-MM-DD"),
                EndDate: moment().format("YYYY-MM-DD"),
                PayType:2,
              },
            });
          }
        }}
      >
        {!loading ? (
          <StatBox
            title={" ₹ " + `${TotalCollection ? Math.floor(TotalCollection) : 0}` + "/-"}
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
      {/**Commission Percentage*/}
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
          if (
            userInfo?.details?.Utype == 2 &&
            Collectionpermission?.ViewPage == 1
          ) {
            navigate("/executive/profile");
          }
        }}
      >
        {!loading ? (
          <StatBox
            title={`${Commission} % `}
            subtitle="Commission(%)"
            stcolor={"#fafafa"}
            icon={<PaymentsIcon sx={{ color: "#fafafa", fontSize: "30px" }} />}
          />
        ) : (
          <Box my={3}>
            <Loader />
          </Box>
        )}
      </Grid>
      {/** today Commission */}
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
          if (
            userInfo?.details?.Utype == 2 &&
            Collectionpermission?.ViewPage == 1
          ) {
            navigate("/executive/managecollections", {
              state: {
                AgentCode: userInfo?.details?.AgentCode,
                BranchId: userInfo?.details?.BranchId,
                StartDate: moment().format("YYYY-MM-DD"),
                EndDate: moment().format("YYYY-MM-DD"),
              },
            });
          }
        }}
      >
        {!loading ? (
          <StatBox
            title={`₹ ${Math.floor(totalcom)} /-`}
            subtitle="Commission(₹)"
            stcolor={"#fafafa"}
            icon={
              <CurrencyRupeeIcon sx={{ color: "#fafafa", fontSize: "30px" }} />
            }
          />
        ) : (
          <Box my={3}>
            <Loader />
          </Box>
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
              Yearly Collection Report
            </Typography>
            <Typography fontWeight="bold" color={"#059669"}>
              ₹{TotalCollection}/-
            </Typography>
          </Box>
          <Box width={"250px"}>
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
            Yaxislegend={"Collection(k)(₹)"}
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
                        navigate("/executive/collectionentry", {
                          state: {
                            CustUUid: i?.CustomerUUid,
                            dueAmt: i?.dueAmt,
                            ID: i?.SchemeRegId,
                            CustomerName: i?.CustomerName,
                          },
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
      {/**due Leads*/}
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
            Leads to be Follow
          </Typography>
        </Box>

        {loading ? (
          <Box mt={10} height="100%" width="100%">
            <Loader SpinnerColor="#00956c" />
          </Box>
        ) : (
          <Box height="320px" width="100%" sx={{ overflowY: "scroll" }}>
            {DueleadList?.map((i, index) => (
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
                  <Typography color={"#374151"}>{i?.PhoneNumber}</Typography>
                </Box>
                <Box color={"#374151"} textAlign={"right"} display={"flex"}>
                  <Box color={"#374151"} textAlign={"right"} mr={1}>
                    {" "}
                    Follow-Up Date <br />
                    {moment(i?.FollowUpDate).format("DD-MM-YYYY")}
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    backgroundColor={"#059669"}
                    color={"#ffffff"}
                    px={2}
                    py={0.5}
                    height={"32px"}
                    borderRadius="4px"
                    onClick={() => {
                      if (CustPermission?.Edit == 1) {
                        navigate("/executive/editleads", {
                          state: { Leadid: i?.CustomerID },
                        });
                      }
                    }}
                  >
                    <PersonAddIcon />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
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
          Area Wise Collection
        </Typography>
        <BarChart
          data={AreaAgentData}
          nameArray={nameArray}
          isload={isloading73}
          XaxisName={"Agent's Collection(₹) in k"}
          YaxisName={"Area"}
          index={"AreaName"}
        />
      </Grid>
    </Grid>
  );
}

export default PerformanceReport;
