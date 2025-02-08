import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

import {
  TextField,
  Typography,
  Divider,
  Box,
  Grid,
  FormHelperText,
  Modal,
} from "@mui/material";

import BiSepBox from "../../Components/styledComponent/BiSepBox";
import IconOnOffButton from "../../Components/Global/IconOnOffButton";
import OnOffButton from "../../Components/Global/OnOffButton";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import Loader from "../../Components/Global/loader";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  ClearState29,
  PaymentDetailList,
} from "../../Slice/PaymentDetails/PaymentDetailsSlice";
import {
  CollectionEditfunc,
  ClearState59,
} from "../../Slice/Collection/CollectionEditSlice";

import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import NumberOnly from "../../Apps/GlobalFunctions/NumberOnly";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";

function EditCollection() {
  const location = useLocation();
  let currentdate = moment().format("YYYY-MM-DD");

  let mindate = moment().startOf("month").format("YYYY-MM-DD");
  let maxdate = moment().endOf("month").format("YYYY-MM-DD");
  console.log(maxdate, mindate);

  const { CollectionId } = location.state;
  const navigate = useNavigate();
  const [PaymentDetails, setPaymentDetails] = useState({});
  const [Edit, setEdit] = useState(false);
  const [input, setInput] = useState({
    CollectedAmt: true,
  });
  const [formData, setformData] = useState({
    PaymentType: 2,
    CollectedAmt: 0,
    CollDate: null,
  });
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();

  // collection List
  const { isloading29, Resp29, error29, isError29, isSuccess29 } = useSelector(
    (state) => state.CustPayDetails
  );

  // collection Edit
  const { isloading59, Resp59, error59, isError59, isSuccess59 } = useSelector(
    (state) => state.CollEdit
  );
  //Login List for Table
  const { global } = UseFetchLogger();

  //Collection details fetch by uuid
  useEffect(() => {
    if (
      CollectionId != undefined &&
      CollectionId != null &&
      CollectionId != ""
    ) {
      var obj = { ...global, CollectionId: CollectionId };
      dispatch(PaymentDetailList(obj));
    }
  }, [CollectionId, isSuccess59, Edit]);

  //Collection details save by uuid
  useEffect(() => {
    if (!isloading29 && isSuccess29) {
      setPaymentDetails(Resp29[0]);
    }
  }, [isSuccess29, CollectionId, isSuccess59]);

  const OnsubmitHandler = (e) => {
    e.preventDefault();
    let finalObj = Object.keys(formData).reduce((acc, key) => {
      if (
        formData[key] !== "" &&
        formData[key] !== null &&
        formData !== undefined &&
        formData !== 0
      ) {
        if (key == "CollectedAmt") {
          acc[key] = Number(formData[key]);
        } else {
          acc[key] = formData[key];
        }
      } else {
        if (key == "CollectedAmt") {
          acc[key] = Number(PaymentDetails?.totcolection);
        } else {
          acc[key] = PaymentDetails[key];
        }
      }
      return acc;
    }, {});
    if (global?.Utype == 2) {
      finalObj.CollDate = PaymentDetails?.CollDate;
    }
    var obj = {
      ...finalObj,
      ...global,
      CollectionId: CollectionId,
      CustUUid: PaymentDetails?.CustUUid,
      PaymentType: PaymentDetails?.PaymentType,
      ID: PaymentDetails?.ID,
    };
    console.log(obj, "see1");

    dispatch(CollectionEditfunc(obj));
  };
  const InputHandler = (e) => {
    var value = e.target.value;
    var key = e.target.name;
    setformData({ ...formData, [key]: value });
  };

  useEffect(() => {
    if (isSuccess59 && !isloading59) {
      toast.success(`${Resp59}`, { positions: toast.POSITION.TOP_RIGHT });
      setEdit(false);
      setInput({ CollectedAmt: true });
    }
    if (isError59 && !isloading59) {
      toast.error(`${error59}`, { positions: toast.POSITION.TOP_RIGHT });
    }
    dispatch(ClearState59());
  }, [isError59, isSuccess59]);

  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Collections")[0];

  useEffect(() => {
    if (isloading29 || isloading59) {
      setOpen(true);
    } else {
      if (CollectionId == PaymentDetails?.CollectionId) {
        setOpen(false);
        setformData({
          PaymentType: 2,
          CollectedAmt: PaymentDetails?.totcolection,
          CollDate: PaymentDetails?.CollDate,
        });
      } else {
        setOpen(true);
      }
    }
  }, [isloading29, isloading59, PaymentDetails]);
  console.log(formData);
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
      <ToastContainer autoClose={8000} />
      <Grid item md={12} sm={12} xs={12}>
        <ReusableBreadcrumbs
          props={[
            { title: "Home",link: global.Utype == 1 ? "/executive" : "/agent", icon: "home" },
            {
              title: "Manage Collection Details",
              link:
                myPermission?.ViewPage == 1
                  ? "/executive/managecollections"
                  : "#",
              icon: "manage_accounts",
            },
            {
              title: "Edit collection",
              link: "#",
              icon: "payments",
            },
          ]}
        />
      </Grid>
      <Grid item md={12} sm={12} xs={12} lg={12}>
        <Divider />
      </Grid>
      <Grid item md={12} sm={12} xs={12} lg={12}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          color={"#000000"}
          flexWrap={"wrap"}
        >
          <Typography variant="h5">Edit Collection</Typography>
          <Box sx={{ mt: -2 }}>
            <IconOnOffButton
              icon1={Edit ? <VisibilityIcon /> : <EditIcon />}
              icon2={<ArrowBackIcon />}
              h1={
                Edit ? (
                  <Typography>Edit Mode |</Typography>
                ) : (
                  <Typography>View Mode |</Typography>
                )
              }
              h2={"Back"}
              Tooltip1={Edit ? "View" : "Edit"}
              Tooltip2={"Back"}
              state={Edit}
              setState={setEdit}
              funcTrigger1={() => {
                if (Edit) {
                  setEdit(!Edit);
                  setformData({
                    PaymentType: 2,
                    CollectedAmt: PaymentDetails?.totcolection,
                    CollDate: PaymentDetails?.CollDate,
                  });
                } else if (Edit === false) {
                  setEdit(!Edit);
                }
              }}
              funcTrigger2={() => {
                navigate("/executive/managecollections");
              }}
            />
          </Box>
        </Box>
      </Grid>
      <Grid item md={12} sm={12} xs={12} lg={12} mt={-1}>
        <Divider />
      </Grid>

      {/* <Grid item xs={12} sm={12} md={12} lg={12} color={"black"} mt={-2}>
        <Typography sx={{ color: "grey" }}>
          Customer Account No.{PaymentDetails?.CustomerAccNo}
        </Typography>
        <BiSepBox>
          <Box sx={{ color: "grey" }}>
            Customer Name : {PaymentDetails?.CustomerName}
            <br />
            Agent Code : {PaymentDetails?.AgentCode}
            <br />
            Collected By:{" "}
            {PaymentDetails?.NotAgentPayment == 1 ? "Backoffice" : "Agent"}
            <br />
            Scheme Title: {PaymentDetails?.SchemeTitle}
          </Box>
        </BiSepBox>
        <Divider />
      </Grid> */}
      <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
        <TextField
          fullWidth
          size="small"
          name="CustomerAccNo"
          value={PaymentDetails?.CustomerAccNo}
          disabled={true}
          inputProps={{ shrink: true }}
          label="Customer Account No."
        />
      </Grid>
      <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
        {" "}
        <TextField
          fullWidth
          name="CustomerName"
          size="small"
          disabled={true}
          inputProps={{ shrink: true }}
          label="Customer Name"
          value={PaymentDetails?.CustomerName}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
        {" "}
        <TextField
          fullWidth
          name="AgentCode"
          size="small"
          disabled={true}
          inputProps={{ shrink: true }}
          label="Agent Code"
          value={PaymentDetails?.AgentCode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
        {" "}
        <TextField
          fullWidth
          name="CollectedBy"
          value={PaymentDetails?.NotAgentPayment == 1 ? "Backoffice" : "Agent"}
          size="small"
          disabled={true}
          inputProps={{ shrink: true }}
          label="Collected By"
        />
      </Grid>
      <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
        {" "}
        <TextField
          fullWidth
          size="small"
          name="SchemeTitle"
          disabled={true}
          inputProps={{ shrink: true }}
          label="Scheme Title"
          value={PaymentDetails?.SchemeTitle}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Divider />
      </Grid>
      <Grid item md={12} sm={12} xs={12} lg={12}>
        <Box
          id="CollectionForm"
          component="form"
          onSubmit={OnsubmitHandler}
          sx={{
            mb: 2,
            mt: 2,
            color: "#000000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid container columnGap={2} rowGap={1}>
            <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
              <TextField
                size={"small"}
                value={formData?.CollectedAmt || ""}
                disabled={!Edit}
                fullWidth
                margin="normal"
                required
                name="CollectedAmt"
                label="Collected Amount"
                InputLabelProps={{ shrink: true }}
                type="text"
                id="CollectedAmt"
                inputProps={{ maxLength: 8 }}
                error={!input?.CollectedAmt}
                onChange={(e) => {
                  let res = NumberOnly(e.target.value);
                  if (e.target.value !== "") {
                    setInput({ CollectedAmt: res });
                  } else {
                    setInput({ CollectedAmt: true });
                  }
                  InputHandler(e);
                }}
              />
              <FormHelperText
                error
                sx={{ visibility: input?.CollectedAmt ? "hidden" : "initial" }}
              >
                CollectedAmt must contain Number only.
              </FormHelperText>
            </Grid>
            <Grid item xs={12} sm={12} md={5.5} lg={5.5}>
              <TextField
                size={"small"}
                fullWidth
                value={formData?.CollDate || currentdate}
                disabled={global?.Utype == 1 && Edit ? false : true}
                margin="normal"
                required
                name="CollDate"
                label="Collection Date"
                InputLabelProps={{ shrink: true }}
                type="date"
                id="CollectionDate"
                inputProps={{ max: maxdate, min: mindate }}
                onChange={InputHandler}
              />
            </Grid>
            <Grid
              item
              md={11}
              sm={11}
              xs={11}
              lg={11.2}
              mt={1}
              sx={{display:"flex",justifyContent:"center",alignItems:"center"}}
            >
              <OnOffButton
                yes={"Update"}
                type1={"submit"}
                disabled1={
                  Edit &&
                  ((formData?.CollectedAmt !== 0 &&
                    formData?.CollectedAmt !== "") ||
                    formData?.CollDate !== "") &&
                  input?.CollectedAmt == true
                    ? false
                    : true
                }
                functrigger1={OnsubmitHandler}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

export default EditCollection;
