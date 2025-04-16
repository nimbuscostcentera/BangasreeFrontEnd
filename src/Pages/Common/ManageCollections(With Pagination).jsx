import { useState, useEffect, useRef } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Typography,
  Divider,
  Stack,
  AlertTitle,
  Alert,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Grid,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
  GRID_CHECKBOX_SELECTION_COL_DEF,
} from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import DateRangFilter2 from "../../Components/Global/DateRangeFilter2";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";

import { PaymentDetailList } from "../../Slice/PaymentDetails/PaymentDetailsSlice";
import {
  DeleteCollFunc,
  ClearState75,
} from "../../Slice/Collection/DeleteCollectionSlice";
import {
  LotEntryFunc,
  ClearStateLotEntry,
} from "../../Slice/Collection/LotEntrySlice";
import {
  FetchTotCollection,
  ClearStateTotColl,
} from "../../Slice/Collection/TotCollectionSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchAcode from "../../Apps/CustomHook/useFetchAcode";
import PropTypes from "prop-types";
const CustomFooter = ({ count }) => {
  const {
    totalColl: totCol,
    totalSub: totSub,
    comper: CommissionPer,
    com: TotComission,
    agentcode,
  } = count;
  return (
    <Box
      sx={{
        backgroundColor: "#0f45ba",
        color: "white",
        minHeight: "fit-content!important",
        overflow: "auto",
        "::-webkit-scrollbar": {
          height: "5px",
          bgcolor: "grey",
        },
      }}
    >
      <Table size="small">
        <TableBody>
          <TableRow>
            {/* <TableCell
              sx={{
                textAlign: "end",
                color: "white",
                borderRight: "1px solid #8c8c8c",
              }}
            >
              <Typography>count</Typography>
            </TableCell> */}
            {/* <TableCell
              sx={{
                textAlign: "end",
                color: "white",
                borderRight: "1px solid #8c8c8c",
              }}
            >
              {rowSelected || 0}
            </TableCell> */}
            <TableCell
              sx={{
                textAlign: "end",
                color: "white",
                borderRight: "1px solid #8c8c8c",
              }}
            >
              <Typography>Total Collection</Typography>
            </TableCell>

            <TableCell
              sx={{
                textAlign: "end",
                color: "white",
                borderRight: "1px solid #8c8c8c",
              }}
            >
              <Typography
                sx={{
                  textAlign: "end",
                  color: "white",
                }}
              >{`₹${totCol || 0}/-`}</Typography>
            </TableCell>

            <TableCell
              sx={{
                textAlign: "end",
                color: "white",
                borderRight: "1px solid #8c8c8c",
              }}
            >
              <Typography>Tot. Submitted Amt.</Typography>{" "}
            </TableCell>
            <TableCell
              sx={{
                textAlign: "end",
                color: "white",
                borderRight: "1px solid #8c8c8c",
              }}
            >
              <Typography>{`₹${totSub || 0}/-`}</Typography>
            </TableCell>
            <TableCell
              sx={{
                textAlign: "end",
                color: "white",
                borderRight: "1px solid #8c8c8c",
              }}
            >
              <Typography>Commission Percentage</Typography>
            </TableCell>
            <TableCell
              sx={{
                textAlign: "end",
                color: "white",
                borderRight: "1px solid #8c8c8c",
              }}
            >
              <Typography>{`${agentcode ? CommissionPer : 0}%`}</Typography>
            </TableCell>
            <TableCell
              sx={{
                textAlign: "end",
                color: "white",
                borderRight: "1px solid #8c8c8c",
              }}
            >
              <Typography>Commission</Typography>{" "}
            </TableCell>
            <TableCell
              sx={{
                textAlign: "end",
                color: "white",
                borderRight: "1px solid #8c8c8c",
              }}
            >
              <Typography>{`₹${
                agentcode ? Math.floor(TotComission) : 0
              }/-`}</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};
CustomFooter.propTypes = {
  count: PropTypes.shape({
    totalColl: PropTypes.number,
    totalSub: PropTypes.number,
    comper: PropTypes.number,
    com: PropTypes.number,
    rowSelected: PropTypes.number,
    agentcode: PropTypes.string,
  }).isRequired,
};
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

const CustomGridToolBar = () => {
  return (
    <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
      <div>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          csvOptions={{ allColumns: true }}
          printOptions={{
            hideFooter: true,
            hideToolbar: true,
            pageStyle: `@page {
              size: A4 landscape;
              margin: 10mm; /* Adjust margins as needed */
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                margin: 0; /* Remove default body margin */
              }
              .MuiDataGrid-root {
                page-break-inside: avoid; /* Prevent rows from splitting */
              }
            }
          `,
          }}
        />
      </div>
      <div>
        <GridToolbarQuickFilter />
      </div>
    </GridToolbarContainer>
  );
};

function ManageCollections() {
  const ImageRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    AgentCode: acode,
    BranchId = "",
    AreaID = "",
    StartDate = "",
    EndDate = "",
    PayType = null,
  } = location?.state || {};
  const LotId = location?.state?.LotId || null;
  const [subData, setSubData] = useState({
    CollectedAmt: null,
    receiptPic: "",
  });
  const [PaymentDetails, setPaymentDetails] = useState([]);
  const [PaymentID, setPaymentID] = useState([]);
  const [params, setParams] = useState({
    alert: false,
    warning: "",
    load: false,
    open: false,
  });
  const [count, setCount] = useState({
    totalColl: 0,
    totalSub: 0,
    com: 0,
    comper: 0,
    rowSelected: 0,
    agentcode: acode || null,
  });
  const [Filters, setFilters] = useState({
    startDate: StartDate || "",
    endDate: EndDate || "",
    PaymentStatus: null,
    AgentCode: acode || null,
    PaymentType: PayType || null,
    NotAgentPayment: null,
    BranchId: BranchId || null,
    AreaID: AreaID || null,
    page: 0,
    pageSize: 100,
    totalPages: 0,
    total: 0,
    SearchKey: "",
  });
  //Login List for Table
  const { global, userInfo } = UseFetchLogger();

  //AgentCode
  const { AgentCode } = useFetchAcode({ Status: 1 });

  // collection List
  const { isloading29 } = useSelector((state) => state.CustPayDetails);
  //total Collection
  const { isTotCollectionSuccess, TotCollectionList } = useSelector(
    (state) => state.totcol
  );
  //lot entry
  const {
    isLotEntryLoading,
    LotEntrySuccessMsg,
    LotEntryErrorMsg,
    isLotEntryError,
    isLotEntrySuccess,
  } = useSelector((state) => state.lotentry);
  //Delete collection response
  const { isloading75, Resp75, error75, isError75, isSuccess75 } = useSelector(
    (state) => state.DelColl
  );
  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Collections")[0];

  //Delete coll toaster response
  useEffect(() => {
    if (isSuccess75 && !isloading75) {
      toast.success(`${Resp75}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState75());
      setPaymentID([]);
    }
    if (isError75 && !isloading75) {
      toast.error(`${error75}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState75());
    }
  }, [isSuccess75, isError75]);
  //tot collection fetch
  useEffect(() => {
    if (
      Filters?.AgentCode !== null &&
      Filters?.AgentCode !== "" &&
      Filters?.AgentCode !== undefined
    ) {
      dispatch(FetchTotCollection({ ...global, ...Filters }));
    }
  }, [
    Filters?.AgentCode,
    Filters?.PaymentStatus,
    Filters?.startDate,
    Filters?.endDate,
  ]);
  //total collection view
  useEffect(() => {
    if (TotCollectionList && isTotCollectionSuccess && Filters?.AgentCode) {
      let obj = TotCollectionList || {}; 
      console.log(TotCollectionList);
       let obj2 = AgentCode?.filter(
         (item) => item?.AgentCode == Filters?.AgentCode
       )[0];
      setCount((prev) => ({
        ...prev,
        totalColl: obj?.TotCollection,
        totalSub: obj?.TotSubmission,
        comper: obj2?.Commision,
        com: (obj2?.Commision * obj?.TotCollection) / 100,
        agentcode: Filters?.AgentCode,
      }));
    }
    if(Filters?.AgentCode == null || Filters?.AgentCode == "" || Filters?.AgentCode == undefined){
      setCount({
        totalColl: 0,
        totalSub: 0,
        com: 0,
        comper: 0,
        rowSelected: 0,
        agentcode: null,
      });
    }
    dispatch(ClearStateTotColl());
  }, [isTotCollectionSuccess, TotCollectionList, Filters?.AgentCode]);
  //toaster
  useEffect(() => {
    if (!isLotEntryLoading && isLotEntrySuccess) {
      toast.success(LotEntrySuccessMsg, {
        autoClose: 5000,
        position: "top-right",
      });
      setSubData({ CollectedAmt: null, receiptPic: null });
      ImageRef.current.value = "";
    }
    if (!isLotEntryLoading && isLotEntryError) {
      toast.error(LotEntryErrorMsg, { autoClose: 5000, position: "top-right" });
    }
    dispatch(ClearStateLotEntry());
  }, [isLotEntryLoading, isLotEntryError, isLotEntrySuccess]);

  //fetch payment detail calculation by selecting
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      var obj22 = { ...global, ...Filters };
      if (LotId) {
        obj22.LotId = LotId;
      }
      if (userInfo?.details?.Utype === 2) {
        obj22.AgentCode = userInfo?.details?.AgentCode;
      } else if (userInfo?.details?.Utype === 1) {
        obj22.SuperUserID = userInfo?.details?.SuperUserID;
      }
      dispatch(PaymentDetailList({ ...obj22, ...global }))
        .unwrap()
        .then((res) => {
          setPaymentDetails(res?.response);
          let {
            page = 1,
            pageSize = 100,
            total = 0,
            totalPages = 0,
          } = res?.pagination || {};

          setFilters((prev) => ({
            ...prev,
            page: page,
            pageSize: pageSize,
            total: total,
            totalPages: totalPages,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchPaymentDetails();
  }, [
    Filters?.AgentCode,
    Filters?.AreaID,
    Filters?.BranchId,
    Filters?.NotAgentPayment,
    Filters?.PaymentStatus,
    Filters?.PaymentType,
    Filters?.startDate,
    Filters?.endDate,
    Filters?.page,
    Filters?.pageSize,
    Filters?.SearchKey,
    isSuccess75,
    isLotEntrySuccess,
  ]);

  useEffect(() => {
    if (
      global?.Utype == 1 &&
      Filters?.AgentCode !== undefined &&
      Filters?.AgentCode !== null &&
      Filters?.AgentCode !== ""
    ) {
      let element = AgentCode.find((i) => i?.AgentCode === Filters?.AgentCode);

      setCount((prev) => ({
        ...prev,
        agentcode: Filters?.AgentCode,
        comper: element?.Commision || 0,
      }));
    } else if (global?.Utype == 2) {
      setCount((prev) => ({
        ...prev,
        agentcode: userInfo?.details?.AgentCode,
        comper: userInfo?.details?.Commision,
      }));
    }
  }, [
    PayType,
    Filters?.AgentCode,
    Filters?.startDate,
    Filters?.endDate,
    PaymentDetails,
  ]);
  //handle filter
  const FilterHandler = (e) => {
    var key = e.target.name;
    var value = e.target.value;
    setFilters({ ...Filters, [key]: value });
  };
  //Edit collection navigation
  const GoToEditCollection = () => {
    if (PaymentID && PaymentID.length == 1) {
      var p = PaymentDetails.filter((i) => {
        return i.CollectionId == PaymentID[0];
      });

      if (
        p &&
        p.length == 1 &&
        p[0]?.PaymentStatus == 1 &&
        p[0]?.PaymentType != 1
      ) {
        navigate("/superuser/editcollections", {
          state: { CollectionId: PaymentID[0] },
        });
      } else {
        setParams({
          alert: true,
          warning:
            "Registration Fees can not be Edited only EMI Collection can be edit before submit , approved or reject the collection. ",
        });
      }
    } else {
      setParams({
        alert: true,
        warning: "Select 1 Collection to Edit",
      });
    }
  };
  //delete wrong collection
  const DeleteCollection = () => {
    if (PaymentID && PaymentID.length == 1) {
      PaymentDetails?.map((i) => {
        PaymentID.map((j) => {
          if (i?.CollectionId == j) {
            if (
              i?.PaymentStatus == 1 ||
              i?.PaymentStatus == 4 ||
              i?.PaymentStatus == 2
            ) {
              var obj = {
                ...global,
                CollectionId: PaymentID[0],
                ID: i?.ID,
                CustUUid: i?.CustomerUUid,
                CollDate: i?.CollDate,
              };
              console.log(obj);

              dispatch(DeleteCollFunc(obj));
            } else {
              setParams({
                alert: true,
                warning: "Selected Collection is already Approved ",
              });
            }
          }
        });
      });
    } else {
      setParams({
        alert: true,
        warning: "Select 1 Collection to Edit",
      });
    }
  };
  const HandleChangeInput = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    let regexNum = /^\d*(\.\d{1,2})?$/;
    if (key === "CollectedAmt" && regexNum.test(value)) {
      setSubData({ ...subData, [key]: value });
    }
  };
  const HandleChangePic = (e) => {
    let key = e.target.name;
    let file = e.target.files[0];
    console.log(file, key);

    setSubData({ ...subData, [key]: file });
  };
  const HandleSubmitCollection = (e) => {
    e.preventDefault();
    let array = PaymentDetails?.filter((item) =>
      PaymentID?.includes(item?.CollectionId)
    );
    console.log(array);

    let flag = true;
    array?.sort((a, b) => {
      if (a?.AgentCode !== b?.AgentCode) {
        flag = false;
      }
    });
    if (flag == false) {
      setParams({
        ...params,
        alert: true,
        warning: "Select Collection of a Specific Agent for Bulk Submission",
      });
    } else {
      if (count?.totalColl == subData?.CollectedAmt) {
        let paymentIDdata = {
          ids: PaymentID,
          AgentCode: userInfo?.details?.AgentCode || Filters?.AgentCode,
          CollDate: currentdate,
          status: 2,
        };
        let SubAmtFormData = new FormData();
        for (let key in subData) {
          if (Object.prototype.hasOwnProperty.call(subData, key)) {
            SubAmtFormData.append(key, subData[key]);
          }
        }
        for (let key in paymentIDdata) {
          if (Object.prototype.hasOwnProperty.call(paymentIDdata, key)) {
            SubAmtFormData.append(key, paymentIDdata[key]);
          }
        }
        for (let key in global) {
          if (Object.prototype.hasOwnProperty.call(global, key)) {
            SubAmtFormData.append(key, global[key]);
          }
        }
        for (let [key, value] of SubAmtFormData.entries()) {
          console.log(`${key}: ${value}`);
        }
        dispatch(LotEntryFunc(SubAmtFormData));
      } else {
        setParams({
          ...params,
          alert: true,
          warning: "Selected Collection and submitted Amount is not same",
        });
      }
    }
  };
  const NavigateToCustomer = () => {
    if (PaymentID && PaymentID.length == 1) {
      let data = PaymentDetails?.filter(
        (item) => item?.CollectionId == PaymentID[0]
      );
      console.log(data);
      if (Array.isArray(data)) {
        navigate("/superuser/vieweditcustomer", {
          state: { CustUUid: data[0]?.CustUUid },
        });
      } else {
        setParams({
          ...params,
          alert: true,
          warning: "No customer Found",
        });
      }
    } else {
      setParams({
        ...params,
        alert: true,
        warning: "Select One Customer Account to View Details",
      });
    }
  };
  let currentdate = moment().format("YYYY-MM-DD");
  //column
  const columns = [
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      hideable: false,
    },
    {
      field: "CustomerAccNo",
      headerName: "Account no.",
      width: 170,
      hideable: false,
    },
    {
      field: "CustomerName",
      headerName: "Customer Name",
      width: 160,
    },
    { field: "SchemeTitle", headerName: "SchemeTitle", width: 170 },
    {
      field: "CollDate",
      headerName: "Coll. Date",
      width: 100,
      hideable: false,
      renderCell: (item) => {
        return <span>{moment(item.row.CollDate).format("DD/MM/YYYY")}</span>;
      },
    },
    {
      field: "totcolection",
      headerName: "Collected Amt.",
      width: 110,
      hideable: false,
      renderCell: (item) => {
        return (
          <Typography sx={{ textAlign: "end", width: "100%" }}>
            ₹ {item.row.totcolection} /-
          </Typography>
        );
      },
    },
    {
      field: "ExpectedCollection",
      headerName: "Expected Amt.",
      width: 110,
      renderCell: (item) => {
        return (
          <Typography sx={{ textAlign: "center", width: "100%" }}>
            ₹{item.row.ExpectedCollection}/-
          </Typography>
        );
      },
    },
    {
      field: "AgentCode",
      headerName: "Agent code",
      width: 100,
    },
    {
      field: "PaymentStatus",
      headerName: "Pay.Status",
      width: 100,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.PaymentStatus === 1
              ? "Collected"
              : item?.row?.PaymentStatus === 2
              ? "Submitted"
              : item?.row?.PaymentStatus === 3
              ? "Approved"
              : item?.row?.PaymentStatus === 4
              ? "Rejected"
              : ""}
          </>
        );
      },
    },
    {
      field: "AreaName",
      headerName: "Area",
      width: 120,
    },
    {
      field: "BranchName",
      headerName: "Branch",
      width: 140,
    },
    {
      field: "PaymentType",
      headerName: "Pay.Type",
      width: 80,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.PaymentType == 1
              ? "Reg. fees"
              : item?.row?.PaymentType == 2
              ? "EMI"
              : null}
          </>
        );
      },
    },
    {
      field: "Commission",
      headerName: "Commission",
      width: 100,
      renderCell: (item) => {
        return (
          <Typography sx={{ textAlign: "center", width: "100%" }}>
            {" "}
            ₹ {item.row.Commission.toFixed(2)} /-
          </Typography>
        );
      },
    },
    {
      field: "NotAgentPayment",
      headerName: "Collected By",
      width: 120,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.NotAgentPayment == 1 ? (
              <Typography>Backoffice</Typography>
            ) : (
              <Typography>Agent</Typography>
            )}
          </>
        );
      },
    },
  ];
  return (
    <ThemeProvider theme={CustomTheme}>
      <Grid
        maxWidth={"l"}
        container
        ml={2}
        mt={2}
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={{
          xl: "flex-start",
          lg: "flex-start",
          md: "flex-start",
          sm: "center",
          xs: "center",
        }}
        flexWrap={"wrap"}
      >
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
          <Box mr={3} mt={1} ml={1}>
            {userInfo?.details?.Utype == 2 ? (
              <ReusableBreadcrumbs
                props={[
                  {
                    title: "Home",
                    link: "/agent",
                    icon: "home",
                  },
                  {
                    title: "Collection List",
                    link: "#",
                    icon: "payments",
                  },
                ]}
              />
            ) : (
              <ReusableBreadcrumbs
                props={[
                  {
                    title: "Home",
                    link: "/executive",
                    icon: "home",
                  },
                  {
                    title: "Collection Summary",
                    link: "/superuser/collection-summary",
                    icon: "savings",
                  },
                  {
                    title: "Collection Details",
                    link: "#",
                    icon: "payments",
                  },
                ]}
              />
            )}{" "}
          </Box>
          {myPermission?.Create ? (
            <div style={{ marginLeft: "10px" }}>
              <IconOnOffButton
                h1={"Add Collection"}
                icon1={<AddCircleOutlineIcon fontSize="medium" />}
                Tooltip1={"ADD Collection"}
                funcTrigger1={() => {
                  navigate("/executive/collectionentry");
                }}
              />{" "}
            </div>
          ) : null}
        </Grid>
        <Grid item md={12} lg={12} sm={12} xs={12}>
          <Divider />
        </Grid>
        {params?.alert ? (
          <Grid item md={12} sm={12} xs={12} lg={12}>
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
          lg={4}
          xl={4}
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={{
            xl: "flex-start",
            lg: "flex-start",
            md: "center",
            sm: "center",
            xs: "center",
          }}
          flexWrap={"wrap"}
          sx={{
            marginLeft: "5px",
          }}
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
          sm={5.5}
          xs={12}
          md={2.6}
          lg={1.7}
          mr={1}
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={{
            xl: "flex-start",
            lg: "flex-start",
            md: "center",
            sm: "center",
            xs: "center",
          }}
          flexWrap={"wrap"}
          mt={1.7}
          ml={1}
        >
          <ReusableDropDown4
            setState={setFilters}
            state={Filters}
            label={"Collected by"}
            data={[
              { NotAgentPayment: 1, value: "Backoffice" },
              { NotAgentPayment: 0, value: "Agent" },
            ]}
            id={"arial_collector"}
            disabled={false}
            ObjectKey={["value"]}
            Field={Filters?.NotAgentPayment}
            uniquekey={"NotAgentPayment"}
            deselectvalue={true}
            onChange={FilterHandler}
          />
        </Grid>
        <Grid
          item
          sm={5.5}
          xs={12}
          md={2.8}
          lg={1.7}
          mr={1}
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={{
            xl: "flex-start",
            lg: "flex-start",
            md: "center",
            sm: "center",
            xs: "center",
          }}
          flexWrap={"wrap"}
          mt={1.7}
          ml={1}
        >
          <ReusableDropDown4
            setState={setFilters}
            state={Filters}
            label={"Payment Status"}
            data={[
              { PaymentStatus: 1, value: "Collected" },
              { PaymentStatus: 2, value: "Submitted" },
              { PaymentStatus: 3, value: "Approved" },
              { PaymentStatus: 4, value: "Rejected" },
            ]}
            id={"arial_status"}
            disabled={false}
            ObjectKey={["value"]}
            Field={Filters?.PaymentStatus}
            uniquekey={"PaymentStatus"}
            deselectvalue={true}
            onChange={FilterHandler}
          />
        </Grid>
        <Grid
          item
          sm={5.5}
          xs={12}
          md={2.8}
          lg={1.7}
          mr={1}
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={{
            xl: "space-between",
            lg: "space-between",
            md: "center",
            sm: "center",
            xs: "center",
          }}
          flexWrap={"wrap"}
          mt={1.7}
          ml={1}
        >
          <ReusableDropDown4
            setState={setFilters}
            state={Filters}
            label={"Payment Type"}
            data={[
              { PaymentType: 1, value: "Registration Fees" },
              { PaymentType: 2, value: "EMI" },
            ]}
            id={"arial_status"}
            disabled={false}
            ObjectKey={["value"]}
            Field={Filters?.PaymentType}
            uniquekey={"PaymentType"}
            deselectvalue={true}
            onChange={FilterHandler}
          />
        </Grid>

        {global?.Utype == 1 ? (
          <Grid
            item
            sm={5.5}
            xs={12}
            md={2.8}
            lg={1.7}
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={{
              xl: "space-between",
              lg: "space-between",
              md: "center",
              sm: "center",
              xs: "center",
            }}
            flexWrap={"wrap"}
            mt={1.7}
            ml={1}
          >
            <ReusableDropDown4
              setState={setFilters}
              state={Filters}
              label={"Agent"}
              data={AgentCode}
              id={"arial_status"}
              disabled={false}
              ObjectKey={["Name", "AgentCode"]}
              Field={Filters?.AgentCode}
              uniquekey={"AgentCode"}
              deselectvalue={true}
              onChange={FilterHandler}
            />
          </Grid>
        ) : null}

        {/* Icon button */}

        <Grid item sm={12} xs={12} md={12} lg={12} xl={12} px={1}>
          <Box
            minWidth={"20rem"}
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={{
              xl: "flex-start",
              lg: "flex-start",
              md: "center",
              sm: "center",
              xs: "center",
            }}
            flexWrap={"wrap"}
          >
            {myPermission?.Edit == 1 ? (
              <IconOnOffButton
                h1={global?.Utype == 1 ? "Edit" : null}
                Tooltip1={global?.Utype == 1 ? "Edit" : null}
                icon1={
                  global?.Utype == 1 ? <EditIcon fontSize="small" /> : null
                }
                funcTrigger1={
                  global?.Utype == 1
                    ? GoToEditCollection
                    : () => {
                        return 0;
                      }
                }
                h2={global?.Utype == 1 ? "Delete" : null}
                Tooltip2={global?.Utype == 1 ? "Delete" : null}
                icon2={
                  global?.Utype == 1 ? (
                    <DeleteIcon
                      fontSize="small"
                      sx={{
                        color: PaymentID?.length == 1 ? "red" : "grey",
                      }}
                    />
                  ) : null
                }
                funcTrigger2={
                  global?.Utype == 1 && PaymentID?.length == 1
                    ? DeleteCollection
                    : () => {
                        return 0;
                      }
                }
              />
            ) : null}

            <IconOnOffButton
              h1={"Filter Out"}
              Tooltip1={"Filter Out"}
              icon1={<FilterAltOffIcon fontSize="small" />}
              funcTrigger1={() => {
                setPaymentID([]);
                setFilters({
                  startDate: "",
                  endDate: "",
                  PaymentStatus: null,
                  AgentCode: null,
                  PaymentType: null,
                  NotAgentPayment: null,
                });
                setCount({
                  totalColl: 0,
                  totalSub: 0,
                  com: 0,
                  comper: 0,
                  rowSelected: 0,
                  agentcode: null,
                });
              }}
              h2={"Customer Details"}
              Tooltip2={"Customer Details"}
              icon2={<PersonIcon fontSize="medium" />}
              funcTrigger2={NavigateToCustomer}
            />
          </Box>
        </Grid>
        {/*Form*/}
        <Grid
          item
          sm={12}
          xs={12}
          md={12}
          lg={2}
          xl={1.8}
          color={"#5b5b5b "}
          sx={{
            display: "flex",
            justifyContent: {
              xl: "flex-start",
              lg: "flex-start",
              md: "center",
              sm: "center",
              xs: "center",
            },
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "14px", mt: 2 }}>
            Submit Collection Here :
          </Typography>
        </Grid>
        <Grid item sm={12} xs={12} md={5.5} lg={2.3} xl={2.5} mt={2} ml={1}>
          <TextField
            label="Submission Amount "
            name="CollectedAmt"
            type="number"
            value={subData?.CollectedAmt || ""}
            placeholder="Submission Amt."
            size="small"
            fullWidth
            onChange={HandleChangeInput}
          />
        </Grid>
        <Grid
          item
          sm={12}
          xs={12}
          md={5.5}
          lg={3.8}
          xl={3.5}
          sx={{ color: "#5b5b5b", ml: 2 }}
        >
          <label style={{ width: "auto", fontSize: "12px" }}>
            Upload Cheque/Transaction Details/Others*
            <br />
            <input
              label="receiptPic"
              name="receiptPic"
              type="file"
              size="small"
              style={{
                padding: "5px",
                borderBottom: "1px solid grey",
              }}
              ref={ImageRef}
              placeholder="Submission Amt."
              onChange={HandleChangePic}
            />
          </label>
        </Grid>
        <Grid item sm={12} xs={12} md={12} lg={2.3} xl={2} my={2} mx={2}>
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
            flexWrap={"wrap"}
          >
            <Button
              variant="contained"
              color="success"
              onClick={HandleSubmitCollection}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setSubData({
                  receiptPic: null,
                  CollectedAmt: null,
                });
                ImageRef.current.key = null;
              }}
            >
              reset
            </Button>
          </Box>
        </Grid>
        <Grid item sm={12} xs={12} md={12} lg={12} xl={12} mt={2}>
          <CustomFooter count={count} />
        </Grid>
        {/**Table */}
        <Grid item sm={12} xs={12} md={12}>
          <div style={{ height: "85vh", width: "100%" }}>
            <DataGrid
              loading={isloading29 || false}
              selectRow
              getRowId={(row) => {
                if (!row) {
                  return -1;
                } else {
                  return row["CollectionId"];
                }
              }}
              sx={{
                ".css-wop1k0-MuiDataGrid-footerContainer": {
                  minHeight: "fit-content",
                },
                "& .MuiDataGrid-virtualScroller": {
                  "::-webkit-scrollbar": {
                    height: "5px",
                    bgcolor: "grey",
                  },
                },
              }}
              rows={PaymentDetails || []}
              columns={columns || []}
              rowHeight={44}
              rowCount={Filters?.total}
              paginationMode="server"
              paginationModel={{
                page: Filters?.page - 1,
                pageSize: Filters?.pageSize,
              }}
              onFilterModelChange={(model) => {
                console.log(model?.quickFilterValues[0]?.toUpperCase());
                if (isloading29 == false) {
                  setFilters((prev) => ({
                    ...prev,
                    SearchKey: model?.quickFilterValues[0]?.toUpperCase(),
                  }));
                }
              }}
              onPaginationModelChange={(model) => {
                console.log(model);
                if (isloading29 == false) {
                  setFilters((prev) => ({
                    ...prev,
                    page: model.page + 1,
                    pageSize: model.pageSize,
                  }));
                }
              }}
              pageSizeOptions={[25, 50, 100]}
              checkboxSelection
              rowSelectionModel={PaymentID}
              onRowSelectionModelChange={(id) => {
                const SelectedIDs = new Set(id);
                const IDarr = Array.from(SelectedIDs);
                setPaymentID(IDarr);
              }}
              slots={{
                toolbar: CustomGridToolBar,
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: {
                    debounceMs: 500,
                    onInputChange: (e) => {
                      console.log(e.target.value);
                      setFilters((prev) => ({
                        ...prev,
                        SearchKey: e.target.value,
                      }));
                    },
                  },
                },
              }}
            />
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default ManageCollections;
