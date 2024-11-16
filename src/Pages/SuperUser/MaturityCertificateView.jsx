import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import moment from "moment"; 

import { Button, Box, Typography, Grid, Divider,Paper } from "@mui/material";
import { styled } from "@mui/material";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {TableContainer} from "@mui/material";

import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import letterhead from "../../assets/bangasreeHeader.png";
import letterfoot from "../../assets/Bangasreefooter.png";

import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import UseFetchSubscription from "../../Apps/CustomHook/UseFetchSubscription";
import { MCshowFunc, ClearState65 } from "../../Slice/Collection/MCShowSlice";
import { border, display, typography } from "@mui/system";

const AllTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("xs")]: {
    fontSize: "14px", // Define font size for xs breakpoint
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "15px", // Define font size for sm to md breakpoint
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "16px", // Define font size for sm to md breakpoint
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "18px", // Define font size for lg and up breakpoint
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "19px", // Define font size for lg and up breakpoint
  },
}));

const FooterTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("xs")]: {
    fontSize: "14px", // Define font size for xs breakpoint
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "14px", // Define font size for sm to md breakpoint
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "16px", // Define font size for sm to md breakpoint
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "18px", // Define font size for lg and up breakpoint
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "19px", // Define font size for lg and up breakpoint
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  border: `1px solid black`,
  color:"black"// Use theme's divider color
}));
const HeaderCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  border: `1px solid black`,
  color: "white", 
}));
const StyledTableContainer = styled(TableContainer)({
  display: "flex",
  justifyContent: "center",
  width: "94.5%",
  backgroundColor: "whitesmoke",
});
const StyledTable = styled(Table)({
  overflow:"scroll",
});

export const Header = () => {
  return (
    <Box>
      <img alt="error" src={letterhead} width={"100%"} />
    </Box>
  );
};

export const Footer = () => {
  return (
    <Grid container mt={2}>
    
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <img alt="error" src={letterfoot} width={"100%"} />
      </Grid>
    </Grid>
  );
};

export const CustSchemeDetails = ({ SchemeRegId }) => {
  const dispatch = useDispatch();
  const { global } = UseFetchLogger();
  const { resp65 } = useSelector((state) => state.McShow);
  useEffect(() => {
    dispatch(MCshowFunc({ ...global, SchemeRegId: SchemeRegId }));
  }, []);
  const { sub } = UseFetchSubscription({ SchemeRegId: SchemeRegId }, [
    SchemeRegId,
  ]);
  let subscribe = useMemo(() =>(sub && sub[0]), [sub]);
  let MC = useMemo(() => resp65[0], [resp65]);

  return (
    <Grid
      container
      sx={{ color: "black", mt: 3, fontSize: "20px", justifyContent: "center" }}
    >
      <Grid item lg={12} md={12} sm={10} xs={10}>
        <Typography
          variant="h5"
          sx={{ textAlign: "center", fontWeight: 550, mb: 2 }}
        >
          Maturity/PreMaturity Certificate
        </Typography>
      </Grid>

      <Grid
        item
        lg={5.7}
        md={5.7}
        sm={5.8}
        xs={10}
        sx={{ border: "1px solid black" }}
      >
        <Grid container>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              py: 1,
              px: 2,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              textAlign: "left",
            }}
          >
            <AllTypography>Customer Name</AllTypography>
          </Grid>{" "}
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              py: 1,
              px: 2,
              textAlign: "right",
            }}
          >
            {" "}
            <AllTypography>{(subscribe)?.CustomerName}</AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              py: 1,
              px: 2,
              textAlign: "left",
            }}
          >
            <AllTypography>Customer A/c No.</AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              py: 1,
              px: 2,
              textAlign: "right",
            }}
          >
            <AllTypography>{subscribe?.CustomerAccNo}</AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              py: 1,
              px: 2,
              textAlign: "left",
            }}
          >
            <AllTypography>Scheme Title </AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              py: 1,
              px: 2,
              textAlign: "right",
            }}
          >
            <AllTypography> {subscribe?.SchemeTitle} </AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              py: 1,
              px: 2,
              textAlign: "left",
            }}
          >
            <AllTypography>EMI Amount </AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              py: 1,
              px: 2,
              textAlign: "right",
            }}
          >
            <AllTypography> ₹{subscribe?.EMI}/- </AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              py: 1,
              px: 2,
              textAlign: "left",
            }}
          >
            <AllTypography> EMI Frequency </AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              textAlign: "right",
              py: 1,
              px: 2,
            }}
          >
            <AllTypography>{subscribe?.frequency}</AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              textAlign: "left",
              py: 1,
              px: 2,
            }}
          >
            <AllTypography>No. of EMI</AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              textAlign: "right",
              py: 1,
              px: 2,
            }}
          >
            <AllTypography>{MC?.NoOfInstallments}</AllTypography>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        item
        lg={5.6}
        md={5.6}
        sm={5.8}
        xs={10}
        sx={{ border: "1px solid black" }}
      >
        <Grid container>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              textAlign: "left",
              py: 1,
              px: 2,
            }}
          >
            <AllTypography>Bill No.</AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              textAlign: "right",
              py: 1,
              px: 2,
            }}
          >
            {" "}
            <AllTypography>{MC?.BillNumber}</AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              textAlign: "left",
              py: 1,
              px: 2,
            }}
          >
            <AllTypography>Billing Date</AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              textAlign: "Right",
              py: 1,
              px: 2,
            }}
          >
            {" "}
            <AllTypography>
              {moment(MC?.Billingdate).format("DD/MM/YYYY")}
            </AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              textAlign: "left",
              py: 1,
              px: 2,
            }}
          >
            <AllTypography>Order No.</AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              textAlign: "Right",
              py: 1,
              px: 2,
            }}
          >
            <AllTypography>{MC?.Ordernumber}</AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              textAlign: "left",
              py: 1,
              px: 2,
            }}
          >
            <AllTypography>Order Date :</AllTypography>
          </Grid>

          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              textAlign: "Right",
              py: 1,
              px: 2,
            }}
          >
            {" "}
            <AllTypography>
              {moment(MC?.Orderdate).format("DD/MM/YYYY")}
            </AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              textAlign: "left",
              py: 1,
              px: 2,
            }}
          >
            <AllTypography>Maturity status</AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              textAlign: "Right",
              py: 1,
              px: 2,
            }}
          >
            <AllTypography>
              {subscribe?.MaturityStatus == 2
                ? "PreMature"
                : subscribe?.MaturityStatus == 3
                ? "Matured"
                : null}
            </AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              textAlign: "left",
              py: 1,
              px: 2,
            }}
          >
            <AllTypography>PreMature For:</AllTypography>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}
            sx={{
              textAlign: "Right",
              py: 1,
              px: 2,
            }}
          >
            <AllTypography>
              {" "}
              {(subscribe?.MaturityComment && subscribe?.MaturityComment) || "N/A"}
            </AllTypography>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        item
        lg={12}
        md={12}
        sm={12}
        xs={12}
        mt={5}
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <StyledTableContainer component={Paper}>
          <StyledTable size="small">
            <TableHead sx={{ backgroundColor: "#90372c" }}>
              <TableRow>
                <HeaderCell>
                  <AllTypography>Description of the Jewellery</AllTypography>
                </HeaderCell>
                <HeaderCell>
                  <AllTypography>Deposited Amount (₹)</AllTypography>
                </HeaderCell>
                <HeaderCell>
                  <AllTypography>Redeemed Amount (₹)</AllTypography>
                </HeaderCell>
                <HeaderCell>
                  <AllTypography>Total Weight (gm)</AllTypography>
                </HeaderCell>
                <HeaderCell>
                  <AllTypography>Bill Amount (₹)</AllTypography>
                </HeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <StyledTableCell>
                  <AllTypography>{MC?.Description}</AllTypography>
                </StyledTableCell>
                <StyledTableCell>
                  <AllTypography>₹{MC?.TotalDepositedAmount}/-</AllTypography>
                </StyledTableCell>
                <StyledTableCell>
                  <AllTypography>₹{MC?.RedeemAmt}/-</AllTypography>
                </StyledTableCell>
                <StyledTableCell>
                  <AllTypography>{MC?.Totalweight}gm</AllTypography>
                </StyledTableCell>
                <StyledTableCell>
                  <AllTypography>₹{MC?.Totalbillamount}/-</AllTypography>
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      </Grid>

      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: {
            lg: "space-between",
            md: "space-between",
            sm: "space-between",
            xs: "center",
          },
          flexWrap: "wrap",
          color: "black",
          alignItems: "flex-start",
          mt: 10,
          mb: 3,
          mx: 3,
        }}
      >
        <FooterTypography
          sx={{
            borderTop: "1px solid black",
            width: "20%",
            textAlign: "center",
          }}
        >
          Customer Signature
        </FooterTypography>
        <FooterTypography
          sx={{
            borderTop: "1px solid black",
            width: "20%",
            textAlign: "center",
          }}
        >
          Checked By
        </FooterTypography>
        <FooterTypography
          sx={{
            borderTop: "1px solid black",
            width: "25%",
            textAlign: "center",
          }}
        >
          Signature for Bangasree Jewellers Pvt. Ltd.
        </FooterTypography>
      </Grid>
    </Grid>
  );
};


const MaturityCertificateView = () => {
  const location = useLocation();
  const { SchemeRegId } = location.state;
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
      onBeforePrint: () =>console.log("before printing..."),
      onAfterPrint: () =>console.log("after printing..."),
      removeAfterPrint: true,
      pageStyle: ` @page {
      size: A4;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        margin-top: 120px;
        margin-bottom:20px
      }
      .printable-content {
        color: black;
      }
    }`,
    });
  //permission List data Fetch
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Subscriptions")[0];
  return (
    <Grid
      container
      mt={3}
    >
      <Grid item md={12} lg={12} xs={12} sm={12} ml={2}>
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
              title: "View Certificate",
              link: "#",
              icon: "workspace_premium",
            },
          ]}
        />
        <Divider sx={{ my: 2 }} />
      </Grid>
      <Grid
        item
        md={12}
        lg={12}
        xs={12}
        sm={12}
        backgroundColor={"whitesmoke"}
        sx={{ border: "1px solid black",justifyContent:"center",mx:5}}
      >
        <Header />
        <div ref={contentToPrint}>
          <CustSchemeDetails SchemeRegId={SchemeRegId} />
        </div>
        <Footer />
      </Grid>
      <Grid
        item
        lg={12}
        md={12}
        sm={12}
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 5,
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            handlePrint(null, () => contentToPrint.current);
          }}
        >
          Print
        </Button>
      </Grid>
    </Grid>
  );
};
export default MaturityCertificateView;
