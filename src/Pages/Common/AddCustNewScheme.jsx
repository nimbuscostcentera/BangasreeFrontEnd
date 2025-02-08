import React, { useState, useEffect, useMemo } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TextField,
  TableContainer,
  Typography,
  Divider,
  Button,
  InputAdornment,
  Input,
  FormHelperText,
  Alert,
  AlertTitle,
  Stack,
  Modal,
} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import {
  DataGrid,
  GridToolbar,
  GRID_CHECKBOX_SELECTION_COL_DEF,
} from "@mui/x-data-grid";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import EditIcon from "@mui/icons-material/Edit";
import FilterOutIcon from "@mui/icons-material/FilterAltOffOutlined";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import ReusableDropDown3 from "../../Components/Global/ReusableDropDown3";
import ColoredText from "../../Components/styledComponent/ColoredText";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";
import OnOffButton from "../../Components/Global/OnOffButton";
import Loader from "../../Components/Global/loader";

import {
  CustomerList,
  ClearState6,
} from "../../Slice/Customer/CustomerListSlice";
import {
  CustPBReturnFunc,
  ClearState60,
} from "../../Slice/PassBook/CustPBReturnSlice";
import {
  SchemeByCustId,
  ClearState27,
} from "../../Slice/Scheme/SchemebyCustIdSlice";
import {
  CustAccDeletefunc,
  ClearState61,
} from "../../Slice/Scheme/CustAccDeleteSlice";
import {
  ClearState31,
  MultiSchemeAdd,
} from "../../Slice/Scheme/MultiSchemeAddSlice";
import { AgentPBList } from "../../Slice/PassBook/AgentPBSlice";

import {
  CustPBAssignFunc,
  ClearState51,
} from "../../Slice/PassBook/CustPBAssignSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchScheme from "../../Apps/CustomHook/useFetchScheme";

import MaxMinDate from "../../Apps/GlobalFunctions/MaxMinDate";
import ValidateImage from "../../Apps/GlobalFunctions/ValidateImage";
import PhnoValidation from "../../Apps/GlobalFunctions/PhnoValidation";
import AlphabetOnly from "../../Apps/GlobalFunctions/AlphabetOnly";
import AdhaarValidation from "../../Apps/GlobalFunctions/AdhaarValidation";
import VoterCardValidation from "../../Apps/GlobalFunctions/VoterCardValidation";
import DrivingLicenceValidation from "../../Apps/GlobalFunctions/DrivingLicenceValidation";
import PassportValidation from "../../Apps/GlobalFunctions/PassportValidation";
import NumberOnly from "../../Apps/GlobalFunctions/NumberOnly";

function AddCustNewScheme() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  var { CustUUid } = location.state;
  const nomAge = MaxMinDate(12);
  const [open, setOpen] = useState(false);
  //global variable
  const { global, userInfo } = UseFetchLogger();
  //Scheme list
  const { Scheme } = useFetchScheme({ Status: 1 });

  const [AgentPassbook, setAgentPassBook] = useState([]);
  const [colmod, setColMod] = useState({
    BONUS: userInfo?.details?.Utype == 1 ? true : false,
  });
  const [buttonAble, setButtonAble] = useState(false);
  const [tablerowOn, setTableRowOn] = useState(false);
  const [AccNo, setAccNo] = useState([]);
  const [pic, setPic] = useState({
    NomineeIdProofPhoto: null,
    NomineePhoto: null,
    Nomineesignature: null,
  });
  const [params, setParams] = useState({
    warning: "",
    alert: false,
    warning1: "",
    alert1: false,
  });
  const [freq, setfreq] = useState([]);
  const [mytabledata, setTable] = useState([]);
  const [args, setargs] = useState([]);
  const [bool, setbool] = useState(false);
  const [check, setcheck] = useState({
    NomineeName: true,
    Relation: true,
    NomineeIdProofNumber: true,
    NomineePhone: true,
    EMI: true,
  });
  const [obj, setobj] = useState({
    SUUid: null,
    frequency: null,
    EMI: 0,
    NomineeName: null,
    Relation: null,
    NomineeIdProofNumber: null,
    NomineePhone: null,
    NomineeIdProofType: null,
  });
  const [cal, setCal] = useState({
    ReedemAmt: 0,
    BonusAmt: 0,
    InvestedAmt: 0,
    TotalEmi: 0,
  });
  //Assign Scheme to Customer
  const { isloading31, Resp31, error31, isError31, isSuccess31 } = useSelector(
    (state) => state.MultiSchemeCust
  );
  //Selected customer Detail
  const { isloading6, CustomerDetail, error6, isError6, isSuccess6 } =
    useSelector((state) => state.CustomerList);

  //scheme List by Cust Id
  const { isloading27, Resp27, isError27, error27, isSuccess27 } = useSelector(
    (state) => state.SchemeListById
  );
  //agent Passbook list
  const { isloadin49, isSuccess49, isError49, error49, Resp49 } = useSelector(
    (state) => state.agentPB
  );
  //assign Passbook to customer
  const { isloading51, Resp51, error51, isError51, isSuccess51 } = useSelector(
    (state) => state.CustPBAssign
  );
  //Passbook return from customer
  const { isloading60, Resp60, error60, isError60, isSuccess60 } = useSelector(
    (state) => state.PBCustReturn
  );
  //Customer Account Delete
  const { isloading61, Resp61, error61, isError61, isSuccess61 } = useSelector(
    (state) => state.CustAccDel
  );

  //Agent Passbook
  useEffect(() => {
    dispatch(AgentPBList({ ...global, AgentID: CustUUid?.AgentID }));
  }, [isSuccess60, isSuccess51, isSuccess61]);
  //AgentPassbook set to hook;
  useEffect(() => {
    if (isSuccess49 && !isloadin49) {
      let passbook = [...Resp49];
      let len1 = passbook?.length;
      let arrayPB = [];
      passbook.map((item) => {
        arrayPB.push(item?.PassBookNo);
      });
      setAgentPassBook(arrayPB);
    }
  }, [isSuccess60, isSuccess51, isSuccess61, isSuccess49]);

  const columns = [
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      hideable: false,
    },
    {
      field: "SCHEMETITLE",
      headerName: "Scheme Name",
      width: 130,
      hideable: false,
    },
    {
      field: "CustomerAccNo",
      headerName: "Customer Acc/No.",
      width: 150,
      hideable: false,
    },
    {
      field: "PassBookNo",
      headerName: "PassBook No",
      width: 180,
      editable: true,
      type: "singleSelect",
      valueOptions: AgentPassbook,
      hideable: false,
      ValueGetter: (i) => {
        //console.log(i);
      },
    },
    {
      field: "EMI",
      headerName: "EMI Amt(₹)",
      width: 120,
      hideable: false,
      renderCell: (item) => {
        return <Typography>{`₹ ${item.row.EMI} /-`}</Typography>;
      },
    },
    {
      field: "frequency",
      headerName: "EMI Frequency",
      width: 120,
      hideable: false,
    },
    {
      field: "BONUS",
      headerName: "Bonus(%)",
      width: 90,
      renderCell: (item) => {
        return <Typography>{`${item.row.BONUS} %`}</Typography>;
      },
    },
    {
      field: "Regfees",
      headerName: "Reg.Fees(₹)",
      width: 100,
      renderCell: (item) => {
        return <Typography>{`₹ ${item.row.Regfees} /-`}</Typography>;
      },
    },
    {
      field: "Duration",
      headerName: "Duration",
      width: 100,
      renderCell: (item) => {
        return <Typography>{`${item.row.Duration} months`}</Typography>;
      },
    },
  ];

  //schemeList by cust Id
  useEffect(() => {
    dispatch(
      SchemeByCustId({
        ...global,
        CustUUid: CustUUid?.UUid,
      })
    );
  }, [isSuccess31, isSuccess60, isSuccess61]);

  //Scheme List by Id save to hook
  let custScheme = useMemo(() => {
    //console.log("hello");
    if (Resp27) {
      return Resp27;
    } else {
      return [];
    }
  }, [isSuccess27, isSuccess60, isSuccess61, isSuccess51, Resp27]);

  //Customer Detail
  useEffect(() => {
    dispatch(CustomerList({ ...global, CustUUid: CustUUid?.UUid }));
  }, []);

  //Customer detail push in hook
  let cust = useMemo(() => {
    if (CustomerDetail) {
      return CustomerDetail[0];
    } else {
      return null;
    }
  }, [CustomerDetail]);

  //freq array
  useEffect(() => {
    var arr = [];
    if (obj?.SUUid) {
      var p = Scheme.filter((i) => i?.SUUid == obj?.SUUid);
      setTable(p);
      if (p[0].Monthly == 1) {
        arr.push({ frequency: "Monthly" });
      }
      if (p[0].Daily == 1) {
        arr.push({ frequency: "Daily" });
      }
      if (p[0].Weekly == 1) {
        arr.push({ frequency: "Weekly" });
      }
    }
    setfreq(arr);
  }, [obj?.SUUid]);

  //toaster
  useEffect(() => {
    //OnSubmit scheme toaster
    if (isSuccess31 && !isloading31) {
      toast.success(`${Resp31}`, { positions: toast.POSITION.TOP_RIGHT });
      setbool(false);
      document.getElementById("newSchemeAdd").reset();
      setobj({
        SUUid: null,
        frequency: null,
        EMI: 0,
        NomineeName: null,
        NomineeDOB: null,
        Relation: null,
        NomineeIdProofType: null,
        NomineeIdProofNumber: null,
        NomineePhone: null,
      });
      setPic({
        NomineeIdProofPhoto: null,
        NomineePhoto: null,
        Nomineesignature: null,
      });
      setButtonAble(true);
      dispatch(ClearState31());
    }
    if (isError31 === true && !isloading31) {
      toast.error(`${error31}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState31());
    }

    //Passbook return from customer
    if (isSuccess60 && !isloading60) {
      toast.success(`${Resp60}`, { positions: toast.POSITION.TOP_RIGHT });

      setAccNo([]);
      dispatch(ClearState60());
    }
    if (isError60 && !isloading60) {
      toast.error(`${error60}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState60());
    }

    //Customer acc delete
    if (isSuccess61 && !isloading61) {
      toast.success(`${Resp61}`, { positions: toast.POSITION.TOP_RIGHT });
      setAccNo([]);
      dispatch(ClearState61());
    }
    if (isError61 && !isloading61) {
      toast.error(`${error61}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState61());
    }

    //OnSubmit Passbook to customer
    if (isSuccess51 && !isloading51) {
      toast.success(`${Resp51}`, { positions: toast.POSITION.TOP_RIGHT });
      setButtonAble(false);

      setAccNo([]);
      dispatch(ClearState51());
    }
    if (isError51 && !isloading51) {
      toast.error(`${error51}`, { positions: toast.POSITION.TOP_RIGHT });
      dispatch(ClearState51());
    }
  }, [
    isError60,
    isSuccess60,
    isError61,
    isSuccess61,
    isError51,
    isSuccess51,
    isError31,
    isSuccess31,
  ]);

  //modal loader
  useEffect(() => {
    if (
      isloadin49 ||
      isloading27 ||
      isloading31 ||
      isloading51 ||
      isloading6 ||
      isloading60 ||
      isloading61
    ) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [
    isloadin49,
    isloading27,
    isloading31,
    isloading51,
    isloading6,
    isloading60,
    isloading61,
  ]);
  const handleClose = () => {
    setOpen(false);
  };

  function OnSubmitHandler(e) {
    e.preventDefault();
    let objData = { ...global, ...pic, ...obj, AgentID: CustUUid?.AgentID };
    let finalObj = Object.keys(objData).reduce((acc, key) => {
      if (objData[key] !== undefined && objData[key] !== null) {
        acc[key] = objData[key];
      }
      return acc;
    }, {});
    if (global?.Utype == 1) {
      dispatch(
        MultiSchemeAdd({
          ...finalObj,
          AgentID: CustUUid?.AgentID,
          CustUUid: CustUUid?.UUid,
        })
      );
    } else if (global?.Utype == 2) {
      dispatch(
        MultiSchemeAdd({
          ...finalObj,
          AgentID: global?.Logger,
          CustUUid: CustUUid?.UUid,
          AgentUUid: CustUUid?.AgentUUid,
        })
      );
    }
  }
  const HandleChangePic = (e) => {
    var key = e.target.name;
    let files = e.target.files;
    setPic({ ...pic, [key]: files });
  };
  const HandleInput = (e) => {
    var key = e.target.name;
    var value = e.target.value;
    let now = new moment().add(-12, "years");
    let inputdate = new moment(e?.target?.value);
    let diffdays = now.diff(inputdate, "days");
    if (key == "EMI" && value > 0) {
      value = e.target.value;
    }
    if (
      key == "NomineeIdProofPhoto" &&
      key == "NomineePhoto" &&
      key == "Nomineesignature"
    ) {
      value = null;
    }
    if (key === "NomineeDOB" && diffdays < 0) {
      value = null;
    }
    if (key == "EMI" && e.target.value < 0) {
      value = 0;
    }

    setobj({ ...obj, [key]: value });
  };
  const Calculate = () => {
    var duration, emi, regfees, bonus;
    if (obj && obj?.SUUid !== null && obj?.EMI != 0 && obj?.frequency != 0) {
      duration = mytabledata[0].Duration; //month
      emi = obj?.EMI;
      regfees = mytabledata[0]?.Regfees;
      bonus = mytabledata[0]?.BONUS;
      var date = new moment();
      var finaldate = moment().add(duration, "months");
      var datediff = finaldate.diff(date, "days");

      var freq = 0;
      if (obj?.frequency === "Weekly") {
        freq = Math.floor(datediff / 7);
      } else if (obj?.frequency === "Monthly") {
        freq = duration;
      } else if (obj?.frequency === "Daily") {
        freq = datediff;
      }
      var TotalEmi = emi * freq;
      var BonusAmt = TotalEmi * (bonus / 100);
      var ReedemAmt = TotalEmi + BonusAmt;
      setCal({
        ReedemAmt: (ReedemAmt||0).toFixed(2),
        BonusAmt: (BonusAmt||0).toFixed(2),
        TotalEmi:( TotalEmi||0).toFixed(2),
      });
      setbool(true);
    } else {
      setParams({
        ...params,
        alert: true,
        warning:
          "Input missing !!! Select Scheme, EMI Frequency and Amount Properly.",
      });
    }
  };
  const UpdateTableData = (newdata) => {
    //console.log(newdata);
    //  var index = apb.indexOf(newdata?.PassBookNo);
    var indexno = AgentPassbook.indexOf(newdata?.PassBookNo);
    let array = [...AgentPassbook];
    array.splice(indexno, 1);
    setAgentPassBook(array);
    //    apb.splice(index, 1);
    const updatedData = { ...newdata, isNew: false };
    var arr2 = [];
    custScheme.map((item) => {
      if (item.SchemeRegId === updatedData.SchemeRegId) {
        arr2.push({
          CustomerAccNo: updatedData?.CustomerAccNo,
          SchemeRegId: updatedData?.ID,
          PassBookNo: updatedData?.PassBookNo,
        });
      }
    });
    setargs([...args, ...arr2]);
    return updatedData;
  };
  const AgentPBAsstoCust = (e) => {
    e.preventDefault();
    var obj = { data: args };
    if (obj?.data && obj?.data.length !== 0) {
      dispatch(
        CustPBAssignFunc({
          ...obj,
          ...global,
          AgentID: CustUUid?.AgentID,
          CustUUid: CustUUid?.UUid,
        })
      );
    } else {
      setParams({
        ...params,
        alert: true,
        warning: "First Assign a Scheme to Customer...",
      });
    }
  };
  const IdProofValidation2 = (args) => {
    var b = false;
    if (obj?.NomineeIdProofType == "Aadhaar Card") {
      b = AdhaarValidation(args);
    } else if (obj?.NomineeIdProofType == "Voter Card") {
      b = VoterCardValidation(args);
    } else if (obj?.NomineeIdProofType == "Passport") {
      b = PassportValidation(args);
    } else if (obj?.NomineeIdProofType == "Driving Licence") {
      b = DrivingLicenceValidation(args);
    }
    return b;
  };
  const filterIDAndNav = () => {
    if (AccNo && (AccNo.length > 1 || AccNo.length == 0)) {
      setParams({
        ...params,
        alert1: true,
        warning1: "No Record Selected !!! Select 1 Customer Account to Edit.",
      });
    } else {
      setParams({ ...params, alert1: false, warning1: "" });
      if (AccNo && AccNo.length == 1) {
        navigate("/superuser/editcustscheme", {
          state: {
            SchemeRegId: AccNo[0],
            CustomerName: cust?.CustomerName,
            CustUUid: CustUUid,
          },
        });
      }
    }
  };
  const ReturnCustomerPB = () => {
    if (AccNo && AccNo.length == 1) {
      var p = custScheme.filter((i) => i?.ID == AccNo[0]);
      if (p[0]?.PassBookNo !== null && p[0]?.PassBookNo !== undefined) {
        var obj = {
          ID: p[0]?.ID,
          CustomerAccNo: p[0]?.CustomerAccNo,
          PassBookNo: p[0]?.PassBookNo,
        };
        dispatch(CustPBReturnFunc({ ...global, ...obj }));
      } else {
        setParams({
          ...params,
          alert1: true,
          warning1:
            "There is No Allocated Passbook for the Scheme to this Customer",
        });
      }
    } else {
      setParams({
        ...params,
        alert1: true,
        warning1:
          "No Record Selected !!! Select 1 Record to take PassBook from Customer.",
      });
    }
  };
  const DeleteCustScheme = () => {
    if (AccNo && AccNo.length == 1) {
      var p = custScheme.filter((i) => i?.ID == AccNo[0]);
      //console.log(p[0]?.PassBookNo);
      if (
        p[0]?.PassBookNo !== null &&
        p[0]?.PassBookNo !== undefined &&
        p[0]?.PassBookNo !== ""
      ) {
        //console.log("heloo");
        setParams({
          ...params,
          alert1: true,
          warning1: "First return PassBook then delete Scheme...",
        });
      } else {
        //console.log("hui", p[0]);
        var obj = {
          SchemeRegId: p[0]?.ID,
        };
        dispatch(CustAccDeletefunc({ ...global, ...obj }));
      }
    } else {
      setParams({
        ...params,
        alert1: true,
        warning1:
          "No Record Selected !!! Select 1 Record to Delete Customer Account....",
      });
    }
  };
  const getMaxLengthForIDProof = (IdProofType) => {
    switch (IdProofType) {
      case "Aadhaar Card":
        return 12;
      case "Driving Licence":
        return 16;
      case "Passport":
        return 8;
      case "Voter Card":
        return 10;
      default:
        return 45; // Default maxLength
    }
  };
  const ManageIdProofNumberDD = (e) => {
    let value = e.target.value;
    if (obj?.NomineeIdProofType !== value) {
      setobj({ ...obj, NomineeIdProofNumber: null, NomineeIdProofType: value });
      setcheck({ ...check, NomineeIdProofNumber: true });
    } else {
      setobj({ ...obj, NomineeIdProofType: value });
    }
  };
  const ManageFrequency = (e) => {
    let value = e.target.value;
    if (obj?.SUUid && obj?.SUUid !== value) {
      setobj({ ...obj, frequency: null, SUUid: value });
    } else {
      setobj({ ...obj, SUUid: value });
    }
  };

  var e4 = document.getElementById("NomIdPic");
  const [photovalmsg4, imgbool4] = ValidateImage(e4);
  var e5 = document.getElementById("NomPic");
  const [photovalmsg5, imgbool5] = ValidateImage(e5);
  var e6 = document.getElementById("NomSign");
  const [photovalmsg6, imgbool6] = ValidateImage(e6);

  //permission List data Fetch
  let storedData = localStorage.getItem("loggerPermission");
  if (storedData && storedData.length !== 0) {
    let parray = JSON.parse(storedData);
    var myPermission =
      parray && parray.filter((i) => i?.PageName == "Manage Customer")[0];
  }

  return (
    <Grid container maxWidth={"xl"} rowGap={2} mt={5} ml={2}>
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
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <ReusableBreadcrumbs
          props={[
            { title: "Home", link: global.Utype == 1 ? "/executive" : "/agent", icon: "home" },
            {
              title: "Manage Customer",
              link:
                myPermission?.ViewPage == 1
                  ? "/superuser/customermanagement"
                  : "#",
              icon: "manage_accounts",
            },
            {
              title: "Assign New Scheme to Customer",
              link: "#",
              icon: "note_add",
            },
          ]}
        />

        <Typography variant="h6" color={"grey"} pb={0} mt={0.8} mb={-1}>
          Customer Name:{cust?.CustomerName}
        </Typography>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12} mt={-2}>
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
                    ...params,
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
      <Grid item xs={11.5} sm={11.5} md={12} lg={12}>
        <Box
          id="newSchemeAdd"
          component="form"
          encType="multipart/form-data"
          method="POST"
          onSubmit={OnSubmitHandler}
          onChange={HandleInput}
        >
          <Grid container columnGap={2} rowGap={4}>
            <Grid item xs={12} sm={12} md={2.3} lg={2.5}>
              <ReusableDropDown3
                label={"Gold Saving Scheme"}
                data={Scheme}
                id={"SUUid"}
                ObjectKey={["SchemeTitle"]}
                uniquekey={"SUUid"}
                state={obj}
                handleChange={ManageFrequency}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={2.3} lg={2.5}>
              <ReusableDropDown3
                label={"EMI frequency"}
                data={freq}
                id={"frequency"}
                ObjectKey={["frequency"]}
                uniquekey={"frequency"}
                state={obj}
                handleChange={HandleInput}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={2.3} lg={2.5} mt={1}>
              <TextField
                fullWidth
                value={obj?.EMI}
                label="EMI Amount"
                size="small"
                name="EMI"
                type="text"
                error={!check?.EMI}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = NumberOnly(e.target.value);

                    setcheck({ ...check, ["EMI"]: res });
                  } else if (e.target.value == "") {
                    setcheck({ ...check, ["EMI"]: true });
                  }
                }}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  endAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
              <FormHelperText
                error
                sx={{ visibility: check?.EMI ? "hidden" : "initial" }}
              >
                EMI must contain numbers Only.
              </FormHelperText>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={1.5}
              lg={1.5}
              justifyContent={"center"}
            >
              <OnOffButton
                yes={"Calculate"}
                type1={"button"}
                functrigger1={Calculate}
                theme1={"primary"}
                no={"Hide"}
                disabled1={check?.EMI == true ? false : true}
                type2={"button"}
                functrigger2={() => {
                  setbool(false);
                }}
                theme2={"info"}
              />
            </Grid>

            {bool ? (
              <>
                <Grid item md={12} sm={12} xs={12}>
                  <TableContainer>
                    <Table
                      aria-label="a dense table"
                      size="small"
                      sx={{ overflowX: "auto" }}
                    >
                      <TableHead sx={{ backgroundColor: "#1775ce" }}>
                        <TableRow>
                          <TableCell sx={{ color: "#ffffff" }}>
                            Scheme Title
                          </TableCell>
                          <TableCell sx={{ color: "#ffffff" }}>
                            registration Fees
                          </TableCell>
                          {userInfo?.details?.Utype == 1 ? (
                            <TableCell sx={{ color: "#ffffff" }}>
                              Bonus (%)
                            </TableCell>
                          ) : null}

                          <TableCell sx={{ color: "#ffffff" }}>
                            EMI Amount
                          </TableCell>
                          <TableCell sx={{ color: "#ffffff" }}>
                            frequency of EMI
                          </TableCell>
                          <TableCell sx={{ color: "#ffffff" }}>
                            Duration in months
                          </TableCell>
                          <TableCell sx={{ color: "#ffffff" }}>
                            Total EMI Amt
                          </TableCell>
                          <TableCell sx={{ color: "#ffffff" }}>
                            bonus Amount
                          </TableCell>
                          <TableCell sx={{ color: "#ffffff" }}>
                            Reedemed Amount
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell sx={{ color: "#000000" }}>
                            {mytabledata[0]?.SchemeTitle}
                          </TableCell>
                          <TableCell sx={{ color: "#000000" }}>
                            {mytabledata[0]?.Regfees}
                          </TableCell>
                          {userInfo?.details?.Utype == 1 ? (
                            <TableCell sx={{ color: "#000000" }}>
                              {mytabledata[0]?.BONUS}%
                            </TableCell>
                          ) : null}

                          <TableCell sx={{ color: "#000000" }}>
                            {obj?.EMI}
                          </TableCell>
                          <TableCell sx={{ color: "#000000" }}>
                            {obj?.frequency}
                          </TableCell>
                          <TableCell sx={{ color: "#000000" }}>
                            {mytabledata[0]?.Duration}
                          </TableCell>
                          <TableCell sx={{ color: "#000000" }}>
                            {cal?.TotalEmi}
                          </TableCell>
                          <TableCell sx={{ color: "#000000" }}>
                            {cal?.BonusAmt}
                          </TableCell>
                          <TableCell sx={{ color: "#000000" }}>
                            {cal?.ReedemAmt}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item sm={12} md={12} lg={12} xs={12}>
                  <Divider>
                    <ColoredText>Nominee Details</ColoredText>
                  </Divider>
                </Grid>
                <Grid item lg={5.7} md={5.7} sm={12} xs={12}>
                  <TextField
                    size="small"
                    id="Nomineename"
                    name="NomineeName"
                    label="Nominee Name"
                    fullWidth
                    type="text"
                    variant="outlined"
                    inputProps={{ maxLength: 50 }}
                    InputLabelProps={{ shrink: true }}
                    error={!check?.NomineeName}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        var res = AlphabetOnly(e.target.value);

                        setcheck({ ...check, ["NomineeName"]: res });
                      } else {
                        setcheck({ ...check, ["NomineeName"]: true });
                      }
                    }}
                  />
                  {!check?.NomineeName ? (
                    <FormHelperText error>
                      Name must not contain space at first place, number or
                      special character
                    </FormHelperText>
                  ) : null}
                </Grid>
                <Grid item lg={5.7} md={5.7} sm={12} xs={12}>
                  <TextField
                    size="small"
                    id="NomineePhone"
                    name="NomineePhone"
                    label="NomineePhone"
                    fullWidth
                    type="text"
                    variant="outlined"
                    inputProps={{ maxLength: 10 }}
                    InputLabelProps={{ shrink: true }}
                    error={!check?.NomineePhone}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        var res = PhnoValidation(e.target.value);

                        setcheck({ ...check, ["NomineePhone"]: res });
                      } else {
                        setcheck({ ...check, ["NomineePhone"]: true });
                      }
                    }}
                  />
                  {!check?.NomineePhone ? (
                    <FormHelperText error>
                      Phone Number should start from 6 to 9
                    </FormHelperText>
                  ) : null}
                </Grid>
                <Grid item lg={5.7} md={5.7} sm={12} xs={12} mt={1}>
                  <TextField
                    size="small"
                    id="Relation"
                    name="Relation"
                    label="Relation"
                    fullWidth
                    variant="outlined"
                    inputProps={{ maxLength: 25 }}
                    error={!check?.Relation}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        var res = AlphabetOnly(e.target.value);

                        setcheck({ ...check, ["Relation"]: res });
                      } else {
                        setcheck({ ...check, ["Relation"]: true });
                      }
                    }}
                  />
                  {!check?.Relation ? (
                    <FormHelperText error>
                      Relation must contain alphabet only.
                    </FormHelperText>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={5.7} lg={5.7}>
                  <ReusableDropDown3
                    label={"Nominee's Id Proof Type"}
                    data={[
                      { NomineeIdProofType: "Aadhaar Card" },
                      { NomineeIdProofType: "Voter Card" },
                      { NomineeIdProofType: "Passport" },
                      { NomineeIdProofType: "Driving Licence" },
                      //{ NomineeIdProofType: "Pan Card" },
                    ]}
                    id={"NomineeIdProofType"}
                    ObjectKey={["NomineeIdProofType"]}
                    uniquekey={"NomineeIdProofType"}
                    setState={setobj}
                    state={obj}
                    handleChange={ManageIdProofNumberDD}
                  />
                </Grid>
                <Grid item lg={5.7} md={5.7} sm={12} xs={12} mt={1}>
                  <TextField
                    size="small"
                    value={obj?.NomineeIdProofNumber || ""}
                    id="NomineeIdProofNumber"
                    name="NomineeIdProofNumber"
                    label="Nominee's IdProof Number"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      maxLength: getMaxLengthForIDProof(
                        obj?.NomineeIdProofType
                      ),
                    }}
                    error={!check?.NomineeIdProofNumber}
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        var res = IdProofValidation2(e.target.value);
                        setcheck({ ...check, ["NomineeIdProofNumber"]: res });
                      } else {
                        setcheck({ ...check, ["NomineeIdProofNumber"]: true });
                      }
                    }}
                  />{" "}
                  {!check?.NomineeIdProofNumber ? (
                    <FormHelperText error>
                      Enter Correct IdProof Number
                    </FormHelperText>
                  ) : null}
                </Grid>
                <Grid
                  item
                  lg={5.7}
                  md={5.7}
                  sm={12}
                  xs={12}
                  color={"black"}
                  mt={1}
                >
                  <label>
                    <TextField
                      label=" Date of Birth"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      id="NomineeDOB"
                      name="NomineeDOB"
                      fullWidth
                      variant="outlined"
                      type="Date"
                      inputProps={{ max: nomAge }}
                    />
                  </label>
                </Grid>
                <Grid item xs={12} sm={12} md={11.6} lg={11.6} color={"black"}>
                  Upload Id Proof of Nominee (Passport/Aadhar card / voter ID
                  card /Driving license) :{"\n"}
                  {/* <CameraComponent cameraKey="second" />
            <ImageDisplay cameraKey="second" /> */}
                  <Input
                    fullWidth
                    id={"NomIdPic"}
                    type="file"
                    onChange={HandleChangePic}
                    name="NomineeIdProofPhoto"
                    aria-label="Pic of Nominee's Photo Id Proof *"
                  />{" "}
                  {imgbool4 == true ? (
                    <Typography color={"error"}>{photovalmsg4}</Typography>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={5.7} lg={5.7} color={"black"}>
                  Upload Passport Size Photo of Nominee
                  {/* <CameraComponent cameraKey="second" />
            <ImageDisplay cameraKey="second" /> */}
                  <Input
                    fullWidth
                    id={"NomPic"}
                    type="file"
                    name="NomineePhoto"
                    onChange={HandleChangePic}
                    aria-label="Pic of Nominee's Photo Id Proof *"
                  />
                  {imgbool5 == true ? (
                    <Typography color={"error"}>{photovalmsg5}</Typography>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={12} md={5.7} lg={5.7} color={"black"}>
                  Photo of Nominee's signature
                  {/* <CameraComponent cameraKey="second" />
            <ImageDisplay cameraKey="second" /> */}
                  <Input
                    fullWidth
                    id={"NomSign"}
                    type="file"
                    name="Nomineesignature"
                    onChange={HandleChangePic}
                    aria-label="Pic of Nominee's Photo Id Proof *"
                  />
                  {imgbool6 == true ? (
                    <Typography color={"error"}>{photovalmsg6}</Typography>
                  ) : null}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  justifyContent={"center"}
                  mt={-1}
                >
                  <OnOffButton
                    no={"Assign"}
                    type2={"submit"}
                    functrigger2={OnSubmitHandler}
                    theme2={"success"}
                    disabled2={
                      obj?.EMI !== 0 &&
                      obj?.EMI !== null &&
                      obj?.SUUid !== null &&
                      obj?.frequency !== null
                        ? false
                        : true
                    }
                  />
                </Grid>
              </>
            ) : null}
          </Grid>
        </Box>
      </Grid>
      {params?.alert1 ? (
        <Grid item md={12} sm={12} xs={12} lg={12} mt={-1}>
          {" "}
          <Box display={"flex"} justifyContent={"space-between"}>
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert
                severity="error"
                onClose={() => {
                  setParams({
                    ...params,
                    alert1: false,
                    warning1: "",
                  });
                }}
              >
                <AlertTitle>Warning</AlertTitle>
                {params?.warning1}
              </Alert>
            </Stack>
          </Box>
        </Grid>
      ) : null}

      <Grid
        item
        xs={11.5}
        sm={11.5}
        md={12}
        ml={1}
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          mt: -2,
        }}
      >
        <IconOnOffButton
          icon1={<EditIcon size={"medium"} />}
          icon2={<FilterOutIcon size={"medium"} />}
          Tooltip1={"Edit"}
          Tooltip2={"Filter Out"}
          h1={"Edit"}
          h2={"Filter Out"}
          funcTrigger1={filterIDAndNav}
          funcTrigger2={() => {
            setAccNo([]);
          }}
        />
        <IconOnOffButton
          icon1={<KeyboardReturnIcon size={"medium"} />}
          icon2={<DeleteOutlineIcon size={"medium"} />}
          Tooltip1={"Return Passbook"}
          Tooltip2={"Delete Assigned Scheme"}
          h1={"Return Passbook"}
          h2={"Delete Assigned Scheme"}
          funcTrigger1={ReturnCustomerPB}
          funcTrigger2={DeleteCustScheme}
        />
      </Grid>
      <Grid item xs={11.5} sm={11.5} md={12}>
        <DataGrid
          getRowId={(id) => {
            if (!id) {
              return -1;
            } else {
              return id["ID"];
            }
          }}
          loading={custScheme == undefined && custScheme == null ? true : false}
          density="compact"
          hideFooterPagination
          hideFooter
          rows={custScheme || []}
          columns={columns}
          editMode="row"
          sx={{
            height: 300,
          }}
          isCellEditable={(params) => !params.row.PassBookNo}
          checkboxSelection
          onRowEditStart={() => {
            setTableRowOn(true);
            setButtonAble(false);
            //console.log(buttonAble);
          }}
          rowSelectionModel={AccNo}
          columnVisibilityModel={colmod}
          onColumnVisibilityModelChange={(newModel) => setColMod(newModel)}
          processRowUpdate={UpdateTableData}
          onRowSelectionModelChange={(rowid) => {
            // var a = custScheme.filter((i) => i.SchemeRegId === rowid[0]);
            //console.log(rowid);
            const SelectedIDs = new Set(rowid);
            const IDarr = Array.from(SelectedIDs);
            setAccNo(IDarr);
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        display={"flex"}
        justifyContent={"space-around"}
      >
        <Button
          variant="contained"
          color="primary"
          disabled={tablerowOn == true ? false : true}
          onClick={() => {
            setButtonAble(true);
            setTableRowOn(false);
          }}
        >
          save
        </Button>
        <Button
          disabled={buttonAble == true ? false : true}
          variant="contained"
          color="secondary"
          onClick={AgentPBAsstoCust}
        >
          Assign PassBook
        </Button>
      </Grid>
    </Grid>
  );
}

export default AddCustNewScheme;
