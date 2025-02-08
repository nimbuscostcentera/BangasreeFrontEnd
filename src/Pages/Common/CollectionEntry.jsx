import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  TextField,
  Typography,
  Divider,
  Box,
  Grid,
  Autocomplete,
  FormHelperText,
  Modal,
} from "@mui/material";

import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import ReusableDropDown4 from "../../Components/Global/ReusableDropDown4";
import OnOffButton from "../../Components/Global/OnOffButton";
import Loader from "../../Components/Global/loader";

import NumberOnly from "../../Apps/GlobalFunctions/NumberOnly";

import {
  CollectionEntryfunc,
  ClearState24,
} from "../../Slice/Collection/CollectionEntrySlice";
import {
  SchemeByCustId
} from "../../Slice/Scheme/SchemebyCustIdSlice";

import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import useFetchCustomer from "../../Apps/CustomHook/useFetchCustomer";
import useFetchGoldRateList from "../../Apps/CustomHook/useFetchGoldRateList";
import { useLocation,useNavigate } from "react-router-dom";
function CollectionEntryForm() {
  let currentdate = moment().format("YYYY-MM-DD");
  //hooks
  const navigate=useNavigate()
  const location = useLocation();
  const { ID, dueAmt, CustUUid, CustomerName } = location?.state || {};
  const dispatch = useDispatch();
  const [input, setInput] = useState({ CollectedAmt: true });
  const [SchemeData, setSchemeData] = useState([]);
  const [autoCom, setAutoCom] = useState(null);
  const [open, setOpen] = useState(false);
  //User Details
  const { userInfo, global } = UseFetchLogger();
  //gold rate
  const { rateList, isSuccess79 } = useFetchGoldRateList({},[]);

  const [formData, setformData] = useState({
    CollectedAmt: dueAmt || 0.0,
    CustUUid: CustUUid || null,
    ID: ID || null,
    PaymentType: 2,
    CollectionDate: currentdate,
    gold_rate: 0.0,
    PaymentMode:1
  });
  // console.log(formData?.gold_rate, rateList[0]?.GOLD_RATE);

  const handleClose = () => {
    setOpen(false);
  };
  //selectors
  //Scheme List for Table
  const { isloading27, Resp27, isSuccess27 } = useSelector(
    (state) => state.SchemeListById
  );

  //Collection creation
  const { isloading24, Response, isError24, error24, isSuccess24 } =
    useSelector((state) => state.CollectionEntry);

  //Customer list
  const { custList } = useFetchCustomer(
    { Status: 1, AgentCode: userInfo?.details?.AgentCode },
    [],
    ""
  );

  //access token
  var at = localStorage.getItem("AccessToken");

  var date = new Date();
  var dateString = date.toISOString();
  date = dateString.split("T", 1);

  const PaymentTypeData = [
    { value: "Registration Fees", PaymentType: 1 },
    { value: "EMI", PaymentType: 2 },
  ];

  //Scheme List
  useEffect(() => {
    if (
      at !== undefined &&
      formData?.CustUUid !== "" &&
      formData?.CustUUid !== null &&
      formData?.CustUUid !== undefined
    ) {
      dispatch(SchemeByCustId({ CustUUid: formData?.CustUUid, ...global }));
      setOpen(true);
    }
  }, [formData?.CustUUid]);

  //schemeList response save to hook
  useEffect(() => {
    if (isSuccess27 && !isloading27) {
      let a = Resp27;
      setSchemeData(a);
      setOpen(false);
    }
  }, [isSuccess27]);

  //Collection entry Response
  useEffect(() => {
    if (isSuccess24 && !isloading24) {
      toast.success(`${Response}`, { positions: toast.POSITION.TOP_RIGHT });
      document.getElementById("CollectionForm").reset();
      if (CustUUid) {
        navigate(location.pathname, {
          replace: true,
          state: {
            CollectedAmt: 0,
            CustUUid: null,
            ID: null,
            PaymentType: 2,
            CollectionDate: currentdate,
          },
        });
      }
      setformData({
        CollectedAmt: 0,
        CustUUid: null,
        ID: null,
        PaymentType: 2,
        CollectionDate: currentdate,
        PaymentMode: 1,
        gold_rate: rateList[0]?.GOLD_RATE,
      });
      setAutoCom(null);
      setOpen(false);
    }
    if (isError24 && !isloading24) {
      toast.error(`${error24}`, { positions: toast.POSITION.TOP_RIGHT });
      setOpen(false);
    }
    dispatch(ClearState24());
  }, [isError24, isSuccess24]);

  //gold rate
  useEffect(() => {
    setformData({ ...formData, gold_rate: 0.0 });
    setformData((prev) => {
      return { ...prev, gold_rate: rateList[0]?.GOLD_RATE };
    });
  }, [rateList[0]?.GOLD_RATE, isSuccess79]);

  //Regfees handler
  useEffect(() => {
    if (
      formData?.PaymentType === 1 &&
      formData?.CustUUid &&
      formData?.ID &&
      !dueAmt
    ) {
      const selectedScheme = SchemeData.find(
        (scheme) => scheme.ID === formData.ID
      );
      //   console.log(selectedScheme);

      setformData({ ...formData, CollectedAmt: selectedScheme?.Regfees });
    } else {
      setformData({ ...formData, CollectedAmt: dueAmt || 0.0 });
    }
  }, [formData?.ID, formData?.PaymentType]);

  //submit func
  const OnsubmitHandler = (e) => {
    e.preventDefault();
    let obj = {};
    // console.log(formData);

    if (global?.Utype !== 2) {
      obj.AgentCode = userInfo?.details?.AgentCode;
      dispatch(CollectionEntryfunc({ ...global, ...formData, ...obj }));
      setOpen(true);
    } else if (global?.Utype !== 1) {
      dispatch(CollectionEntryfunc({ ...global, ...formData }));
      setOpen(true);
    }
  };

  //permission List data Fetch
  // var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  // var myPermission = parray && parray.filter((i) => i?.PageName == "Manage Collections")[0];
  console.log(location.state);
  let PaymentModeData = [
    { PaymentMode: 1, value: "Cash" },
    { PaymentMode: 2, value: "Online Bank Trasfer" },
    { PaymentMode: 3, value: "Cheque" },
    { PaymentMode: 4, value: "UPI" },
  ];
  
  return (
    <Grid container maxtype={"xl"} mt={1} ml={2} columnGap={2} rowGap={2}>
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
            width: 200,
            height: 150,
            bgcolor: "whitesmoke",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Loader SpinnerColor="#0978ed" />
        </Box>
      </Modal>
      <ToastContainer autoClose={8000} />
      <Grid item md={12} sm={12} xs={12} lg={12}>
        <ReusableBreadcrumbs
          props={[
            {
              title: "Home",
              link: global.Utype == 1 ? "/executive" : "/agent",
              icon: "home",
            },
            {
              title: "Manage Collection Details",
              link: "/executive/managecollections",
              icon: "manage_accounts",
            },
            {
              title: "Collection Entry",
              link: "#",
              icon: "payments",
            },
          ]}
        />
      </Grid>
      <Grid item md={12} sm={12} xs={12} lg={12}>
        <Divider />
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          color={"#000000"}
          my={1}
        >
          <Typography variant="h5">Collection Entry</Typography>
        </Box>
        <Divider />
        <Box
          id="CollectionForm"
          component="form"
          onSubmit={OnsubmitHandler}
          sx={{
            mb: 2,
            mt: 4,
            color: "#000000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid container columnGap={5} rowGap={3}>
            <Grid item md={5.7} sm={12} xs={12} lg={5.7} mt={1} mb={2}>
              {CustUUid ? (
                <TextField
                  value={CustomerName}
                  label={"Custome Name"}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
              ) : (
                <Autocomplete
                  options={custList}
                  componentName="CustUUid"
                  isOptionEqualToValue={(option, value) => {
                    return option?.UUid === value?.value;
                  }}
                  defaultValue={custList}
                  getOptionLabel={(option) => {
                    return `${option?.CustomerName}:${option?.PhoneNumber}`;
                  }}
                  onChange={(e, newvalue) => {
                    setAutoCom(newvalue);
                    setformData({ ...formData, CustUUid: newvalue?.UUid });
                  }}
                  value={autoCom}
                  fullWidth
                  size="small"
                  sx={{ border: "0px" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Customer"
                      name="CustUUid"
                    />
                  )}
                />
              )}
            </Grid>
            <Grid item md={5.7} sm={12} xs={12} lg={5.7}>
              <ReusableDropDown4
                label={"Scheme"}
                data={SchemeData || []}
                ObjectKey={["SCHEMETITLE", "CustomerAccNo"]}
                uniquekey={"ID"}
                ddwidth={400}
                disabled={formData?.CustUUid == undefined ? true : false}
                setState={setformData}
                Field={formData["ID"]}
                id="Scheme"
                onChange={(e) => {
                  setformData({ ...formData, ID: e.target.value });
                }}
              />
            </Grid>
            <Grid item md={5.7} sm={12} xs={12} lg={5.7} mt={1}>
              <ReusableDropDown4
                label={"Payment Type"}
                data={PaymentTypeData}
                ObjectKey={["value"]}
                uniquekey={"PaymentType"}
                ddwidth={400}
                Field={formData["PaymentType"]}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value) {
                    setformData({ ...formData, PaymentType: e.target.value });
                  }
                }}
                id="PaymentType"
              />
            </Grid>
            <Grid item md={5.7} sm={12} xs={12} lg={5.7}>
              <TextField
                size={"small"}
                fullWidth
                value={formData?.CollectedAmt || ""}
                disabled={formData?.PaymentType == 1 ? true : false}
                margin="normal"
                required
                name="CollectedAmt"
                label="Collected Amount"
                InputLabelProps={{ shrink: true }}
                type="text"
                onChange={(e) => {
                  if (e.target.value !== "") {
                    var res = NumberOnly(e.target.value);

                    setInput({ ...input, ["CollectedAmt"]: res });
                  } else if (e.target.value == "") {
                    setInput({ ...input, ["CollectedAmt"]: true });
                  }
                  if (
                    formData?.PaymentType == 2 &&
                    (e.target.value <= 100 || e.target.value > 0)
                  ) {
                    setformData({ ...formData, CollectedAmt: e.target.value });
                  } else {
                    setformData({ ...formData, CollectedAmt: 0 });
                  }
                }}
                id="CollectedAmt"
                inputProps={{ maxLength: 8 }}
              />

              <FormHelperText
                error
                sx={{
                  visibility: input?.CollectedAmt ? "hidden" : "initial",
                }}
              >
                BONUS must contain numbers Only.
              </FormHelperText>
            </Grid>
            {userInfo?.details?.Utype == 1 ? (
              <Grid item md={5.7} sm={12} xs={12} lg={5.7} mt={1}>
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  inputProps={{ max: currentdate }}
                  value={formData?.CollectionDate || ""}
                  onChange={(e) => {
                    setformData({
                      ...formData,
                      CollectionDate: e.target.value,
                    });
                  }}
                />
              </Grid>
            ) : null}

            <Grid item md={5.7} sm={12} xs={12} lg={5.7} p={0} m={0}>
              <ReusableDropDown4
                label={"Payment Mode"}
                data={PaymentModeData}
                ObjectKey={["value"]}
                uniquekey={"PaymentMode"}
                ddwidth={400}
                Field={formData["PaymentMode"]}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value) {
                    setformData({ ...formData, PaymentMode: e.target.value });
                  }
                }}
                id="PaymentMode"
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12} lg={12}>
              <Box>
                <OnOffButton
                  yes={"Submit"}
                  no={"Reset"}
                  type1={"submit"}
                  type2={"reset"}
                  disabled1={
                    (formData?.CollectedAmt !== "0" &&
                      formData?.CollectedAmt !== 0 &&
                      formData?.CollectedAmt !== "" &&
                      formData?.ID &&
                      formData?.CustUUid &&
                      formData?.PaymentType !== "" &&
                      input?.CollectedAmt) == true
                      ? false
                      : true
                  }
                  disabled2={false}
                  functrigger1={OnsubmitHandler}
                  functrigger2={() => {
                    setInput({ CollectedAmt: true });
                    setformData({
                      CollectedAmt: 0,
                      CustUUid: null,
                      ID: null,
                      PaymentType: 2,
                      CollectionDate: currentdate,
                      PaymentMode:1,
                      gold_rate:rateList[0]?.GOLD_RATE,
                    });
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

export default CollectionEntryForm;
