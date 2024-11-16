import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import useFetchSubScription from "../../Apps/CustomHook/UseFetchSubscription";
import {
  MCgenFunc,
  ClearState64,
} from "../../Slice/Collection/MaturityCertificateCreateSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Grid,
  Button,
  Container,
  Box,
  TextField,
  FormHelperText,
} from "@mui/material";
import { styled } from "@mui/material";

import NumberOnly from "../../Apps/GlobalFunctions/NumberOnly";
import IntegerValidation from "../../Apps/GlobalFunctions/IntegerValidation";

import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import logo from "../../assets/BangaLogo3.png";
import ThankYou from "../../assets/thank_you.png";

const MyButton = styled(Button)(() => ({
  "@media print": {
    display: "none",
  },
}));
export const Header = () => {
  return (
    <Box>
      <Grid container direction="row">
        <Grid item flexGrow={1} ml={5}>
          <Box
            sx={{
              backgroundColor: "#612F12",
              width: 220,
              height: 160,
              padding: 2,
              color: "white",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "0px 0px 180px 180px",
            }}
          >
            <img src={logo} alt="logo" width={"100%"} height={"60%"} />
          </Box>
        </Grid>
        <Grid item>
          <Box
            sx={{
              fontSize: 50,
              fontFamily: "-moz-initial",
              textDecorationLine: "underline",
              textAlign: "end",
              pt: 3,
              pr: 5,
              color: "#000000",
            }}
          >
            Certificate
          </Box>
          <Box pl={5} mx={8} color={"#000000"}>
            invoice No:1025
            <br />
            Date:04/05/2023
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export const OrderForm = ({ SchemeRegId }) => {
  const dispatch = useDispatch();
  const { isloading64, Resp64, error64, isError64, isSuccess64 } = useSelector(
    (state) => state?.McGen
  );
  const { global } = UseFetchLogger();
  const [orderData, setOrderData] = useState({
    BillNumber: null,
    Totalbillamount: null,
    Billingdate: null,
    Ordernumber: null,
    Orderdate: null,
    Description: null,
    Totalweight: null,
  });
  const [input, setInput] = useState({
    BillNumber: true,
    Totalbillamount: true,
    Ordernumber: true,
    Totalweight: true,
  });
  const { sub } = useFetchSubScription({ SchemeRegId: SchemeRegId }, [
    SchemeRegId,
  ]);
console.log(SchemeRegId, sub);

  const InputHandler = (e) => {
    let key = e.target.name;
    let value = "";
    if (
      key == "BillNumber" ||
      key == "Totalbillamount" ||
      key == "Ordernumber" ||
      key == "Totalweight"
    ) {
      if (Number(e.target.value) <= 0) {
        value = "";
      } else {
        value = e.target.value;
      }
    } else {
      value = e.target.value;
    }
    setOrderData({ ...orderData, [key]: value });
  };

  const GrnerateCertificateFunc = (e) => {
    e.preventDefault();
    dispatch(MCgenFunc({ ...global, ...orderData, SchemeRegId: SchemeRegId }));
  };

  useEffect(() => {
    if (isSuccess64 && !isloading64) {
      toast.success(Resp64, toast.POSITION.TOP_RIGHT);
      setOrderData({
        BillNumber: null,
        Totalbillamount: null,
        Billingdate: null,
        Ordernumber: null,
        Orderdate: null,
        Description: null,
        Totalweight: null,
      });
    }
    if (isError64 && !isloading64) {
      toast.error(error64, toast.POSITION.TOP_RIGHT);
    }
  }, [isError64, isSuccess64]);

  return (
    <Box
      component={"form"}
      id={"maturity_certificate_form"}
      method="POST"
      onSubmit={GrnerateCertificateFunc}
      onChange={InputHandler}
      pl={1.5}
    >
      <Grid container columnGap={5}>
        <Grid item lg={5.6} md={5.5} sm={12} xs={12}>
          <TextField
            size="small"
            sx={{ bgcolor: " #FAFAFA" }}
            fullWidth
            value={orderData?.BillNumber}
            margin="normal"
            name="BillNumber"
            label="Bill Number"
            type="text"
            id="BillNumber_arial"
            error={!input?.BillNumber}
            inputProps={{ maxLength: 10 }}
            onChange={(e) => {
              if (e?.target?.value == "") {
                setInput({ ...input, BillNumber: true });
              } else {
                let res = IntegerValidation(e?.target?.value);
                setInput({ ...input, BillNumber: res });
              }
            }}
          />
          <FormHelperText
            error
            sx={{ visibility: input?.BillNumber ? "hidden" : "visible" }}
          >
            Bill Number must contain Integer Numbers only.
          </FormHelperText>
        </Grid>
        <Grid item lg={5.6} md={5.5} sm={12} xs={12}>
          {" "}
          <TextField
            size="small"
            sx={{ bgcolor: " #FAFAFA" }}
            fullWidth
            value={orderData?.Totalbillamount}
            margin="normal"
            name="Totalbillamount"
            label="Total Bill Amount"
            type="text"
            id="Totalbillamount_arial"
            error={!input?.Totalbillamount}
            onChange={(e) => {
              if (e?.target?.value == "") {
                setInput({ ...input, Totalbillamount: true });
              } else {
                let res = NumberOnly(e?.target?.value);
                setInput({ ...input, Totalbillamount: res });
              }
            }}
          />
          <FormHelperText
            error
            sx={{ visibility: input?.Totalbillamount ? "hidden" : "visible" }}
          >
            Bill Amount must contain Integer or Decimal Numbers only.
          </FormHelperText>
        </Grid>
        <Grid item lg={5.6} md={5.5} sm={12} xs={12}>
          {" "}
          <TextField
            size="small"
            sx={{ bgcolor: " #FAFAFA" }}
            fullWidth
            value={orderData?.Billingdate}
            margin="normal"
            name="Billingdate"
            label="Bill Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            id="Billingdate"
          />
          <FormHelperText error></FormHelperText>
        </Grid>
        <Grid item lg={5.6} md={5.5} sm={12} xs={12}>
          {" "}
          <TextField
            size="small"
            sx={{ bgcolor: " #FAFAFA" }}
            fullWidth
            margin="normal"
            value={orderData?.Ordernumber}
            name="Ordernumber"
            label="Order Number"
            type="text"
            id="Ordernumber_arial"
            inputProps={{ maxLength: 10 }}
            error={!input?.Ordernumber}
            onChange={(e) => {
              if (e?.target?.value == "") {
                setInput({ ...input, Ordernumber: true });
              } else {
                let res = IntegerValidation(e?.target?.value);
                setInput({ ...input, Ordernumber: res });
              }
            }}
          />
          <FormHelperText
            error
            sx={{ visibility: input?.Ordernumber ? "hidden" : "visible" }}
          >
            Order Number must contain Integer Numbers only.
          </FormHelperText>
        </Grid>
        <Grid item lg={5.6} md={5.5} sm={12} xs={12}>
          {" "}
          <TextField
            size="small"
            sx={{ bgcolor: " #FAFAFA" }}
            fullWidth
            margin="normal"
            name="Totalweight"
            value={orderData?.Totalweight}
            label="Total Weight"
            type="text"
            id="Totalweight"
            inputProps={{ maxLength: 10 }}
            error={!input?.Totalweight}
            onChange={(e) => {
              if (e?.target?.value == "") {
                setInput({ ...input, Totalweight: true });
              } else {
                let res = NumberOnly(e?.target?.value);
                setInput({ ...input, Totalweight: res });
              }
            }}
          />
          <FormHelperText
            error
            sx={{ visibility: input?.Totalweight ? "hidden" : "visible" }}
          ></FormHelperText>
        </Grid>
        <Grid item lg={5.6} md={5.5} sm={12} xs={12}>
          {" "}
          <TextField
            size="small"
            sx={{ bgcolor: " #FAFAFA" }}
            fullWidth
            margin="normal"
            name="Orderdate"
            value={orderData?.Orderdate}
            label="Order Date"
            type="date"
            id="Orderdate"
            InputLabelProps={{ shrink: true }}
          />
          <FormHelperText error></FormHelperText>
        </Grid>
        <Grid item lg={11.6} md={11.6} sm={12} xs={12}>
          <TextField
            size="small"
            sx={{ bgcolor: " #FAFAFA" }}
            fullWidth
            margin="normal"
            name="Description"
            value={orderData?.Description}
            label="Description"
            type="text"
            id="Description"
            multiline={true}
            rows={2}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <CustSchemeDetails sub={sub && sub[0]} />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              onClick={GrnerateCertificateFunc}
              disabled={
                input?.BillNumber &&
                input?.Ordernumber &&
                input?.Totalbillamount &&
                input?.Totalweight &&
                orderData?.BillNumber &&
                orderData?.Billingdate &&
                orderData?.Description &&
                orderData?.Orderdate &&
                orderData?.Ordernumber &&
                orderData?.Totalbillamount &&
                orderData?.Totalweight
                  ? false
                  : true
              }
            >
              Generate
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export const Footer = () => {
  return (
    <Grid container>
      <Grid item flexGrow={1} ml={10} mt={3}>
        <img src={ThankYou} alt="Thank You" height={150} width={150} />
      </Grid>
      <Grid
        item
        ml={10}
        mr={10}
        p={2}
        mt={3}
        color="#612F12"
        justifyItems="center"
        justifySelf="center"
      >
        BangashreJwellers.co.in
        <br />
        +918756455858
        <br />
        www.bangashreejewellers.com
        <br />
        branch:Bahala,SonarPore,
        <br />
        Barackpore,Kachrapara
      </Grid>
    </Grid>
  );
};
export const CustSchemeDetails = ({ sub }) => {
  return (
    <Box mx={5} mt={5} border={"1px solid #000000"}>
      <Grid
        container
        maxWidth={"lg"}
        columnGap={10}
        rowGap={2}
        color={"#000000"}
        py={3}
        pl={6}
      >
        <Grid item lg={4} md={4} sm={3} xs={12}>
          Customer Name :
        </Grid>
        <Grid item lg={6.5} md={6.5} sm={5.5} xs={12} textAlign={"right"}>
          {sub?.CustomerName}
        </Grid>
        <Grid item lg={4} md={4} sm={3} xs={12}>
          Customer Account Number :
        </Grid>
        <Grid item lg={6.5} md={6.5} sm={5.5} xs={12} textAlign={"right"}>
          {sub?.CustomerAccNo}
        </Grid>
        <Grid item lg={4} md={4} sm={3} xs={12}>
          Agent Code :
        </Grid>
        <Grid item lg={6.5} md={6.5} sm={5.5} xs={12} textAlign={"right"}>
          {sub?.AgentCode}
        </Grid>
        <Grid item lg={4} md={4} sm={3} xs={12}>
          Scheme Title :
        </Grid>
        <Grid item lg={6.5} md={6.5} sm={5.5} xs={12} textAlign={"right"}>
          {sub?.SchemeTitle}
        </Grid>
        <Grid item lg={4} md={4} sm={3} xs={12}>
          Bonus status:
        </Grid>
        <Grid item lg={6.5} md={6.5} sm={5.5} xs={12} textAlign={"right"}>
          {sub?.BonusStatus == 1 ? "Active" : "InActive"}
        </Grid>
        <Grid item lg={4} md={4} sm={3} xs={12}>
          Inactive Bonus For:
        </Grid>
        <Grid item lg={6.5} md={6.5} sm={5.5} xs={12} textAlign={"right"}>
          {sub?.BonusComment ? BonusComment : "N/A"}
        </Grid>
        <Grid item lg={4} md={4} sm={3} xs={12}>
          Maturity Status:
        </Grid>
        <Grid item lg={6.5} md={6.5} sm={5.5} xs={12} textAlign={"right"}>
          {sub?.MaturityStatus == 3
            ? "Matured"
            : sub?.MaturityStatus == 2
            ? "PreMatured"
            : null}
        </Grid>
        <Grid item lg={4} md={4} sm={3} xs={12}>
          PreMaturity For:
        </Grid>
        <Grid item lg={6.5} md={6.5} sm={5.5} xs={12} textAlign={"right"}>
          {sub?.MaturityComment ? MaturityComment : "N/A"}
        </Grid>
        <Grid item lg={4} md={4} sm={3} xs={12}>
          EMI Amount
        </Grid>
        <Grid item lg={6.5} md={6.5} sm={5.5} xs={12} textAlign={"right"}>
          ₹{sub?.EMI}/-
        </Grid>
        <Grid item lg={4} md={4} sm={3} xs={12}>
          Redeem Amount
        </Grid>
        <Grid item lg={6.5} md={6.5} sm={5.5} xs={12} textAlign={"right"}>
          ₹{sub?.RedeemAmt}/-
        </Grid>
      </Grid>
    </Box>
  );
};

const GenarateCertificate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { SchemeRegId } = location.state;
console.log(SchemeRegId);

  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Subscriptions")[0];
  return (
    <Grid container mt={5} ml={2}>
      <ToastContainer autoClose={5000} />
      <Grid item md={12} sm={12} xs={12}>
        <ReusableBreadcrumbs
          props={[
            { title: "Home", link: "/executive", icon: "home" },
            {
              title: "Manage Subscription",
              link:
                myPermission?.ViewPage == 1
                  ? "/executive/managesubscriptions"
                  : "#",
              icon: "manage_accounts",
            },
            {
              title: "Generate Certificate",
              link: "/superuser/generatecertificate",
              icon: "workspace_premium",
            },
          ]}
        />
      </Grid>
      <Grid item backgroundColor={"#ffe2ad"}>
        <Header />
        <OrderForm SchemeRegId={SchemeRegId} />
        <Footer />
      </Grid>
    </Grid>
  );
};
export default GenarateCertificate;
