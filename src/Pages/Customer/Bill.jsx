import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Button,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  Table,
  TableRow,
  Container,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useReactToPrint } from "react-to-print"; // Importing useReactToPrint
import logo from "../../assets/BangaLogo2.png";
import ThankYou from "../../assets/thank_you.png";
const URL = "https://dummyjson.com/users";
const URL2 = "https://dummyjson.com/products";

const MyButton = styled(Button)(() => ({
  "@media print": {
    display: "none",
  },
}));
export const Header = () => {
  const [Buyerdata, setBuyerData] = useState({});
  const [address, setAddress] = useState({});
  useEffect(() => {
    axios
      .get(URL)
      .then((res) => {
        setBuyerData(res.data.users[0]);
        setAddress(res.data.users[0].address);
      })
      .catch((err) => {});
  }, []);
  return (
    <Box>
      <Grid container direction="row">
        <Grid item flexGrow={1} ml={5}>
          <Box
            sx={{
              backgroundColor: "#612F12",
              width: 350,
              height: 160,
              padding: 2,
              color: "white",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "0px 0px 180px 180px",
            }}
          >
            <img src={logo} alt="logo" width={"100%"} height={"75%"} />
          </Box>
        </Grid>
        <Grid item>
          <Box
            sx={{
              fontSize: 55,
              fontFamily: "-moz-initial",
              textDecorationLine: "underline",
              pt: 3,
              ml: 10,
              color: "#000000",
            }}
          >
            Invoice
          </Box>
          <Box pl={5} mx={8} color={"#000000"}>
            invoice No:1025
            <br />
            Date:04/05/2023
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ padding: 1, marginLeft: 6, color: "#612F12" }}>
        <Grid container>
          <Grid item flexGrow={0.95}>
            <b>
              Invoice to:{Buyerdata.firstName} {Buyerdata.lastName}
            </b>
            <br />
            Contact No. {Buyerdata.phone}
            <br />
            Email ID : {Buyerdata.email}
            <br />
            Address:&nbsp;{address.address},<br />
            {address.city},{address.state},PinCode:{address.postalCode}
          </Grid>
          <Grid item>
            <b>
              Invoice from:{Buyerdata.firstName} {Buyerdata.lastName}
            </b>
            <br />
            Contact No. {Buyerdata.phone}
            <br />
            Email ID : {Buyerdata.email}
            <br />
            Address:&nbsp;{address.address},<br />
            {address.city},{address.state},PinCode:{address.postalCode}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
export const Footer = () => {
  return (
    <Box>
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
    </Box>
  );
};

export const CustTableDetail = () => {
  const [rows, setRows] = useState({});

  useEffect(() => {
    axios
      .get(URL2)
      .then((res) => {
        setRows(res.data.products);
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      <Box sx={{ backgroundColor: "white", marginX: 6, padding: 1, mt: 3 }}>
        <Paper
          sx={{
            overflowX: "auto",
            width: "100%",
          }}
        >
          {rows.length > 0 ? (
            <>
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 200 }}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Tno.</TableCell>
                      <TableCell align="center">Date</TableCell>
                      <TableCell align="center">Deposit (₹)</TableCell>
                      <TableCell align="center">22k Gold Bought(g)</TableCell>
                      <TableCell align="center">
                        Current value of Gold(22k) (₹)
                      </TableCell>
                      <TableCell align="center">Transaction Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell scope="row" align="center">
                          {row.id}
                        </TableCell>
                        <TableCell align="center">{row.category}</TableCell>
                        <TableCell align="center">{row.brand}</TableCell>
                        <TableCell align="center">
                          {row.discountPercentage}
                        </TableCell>
                        <TableCell align="center">{row.rating}</TableCell>
                        <TableCell align="center">{row.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : null}
        </Paper>
      </Box>
    </>
  );
};
const Bill = () => {
  return (
    <Container>
      <Box backgroundColor={"#ffe2ad"}>
        <Header />
        <CustTableDetail />
        <Footer />
      </Box>
    </Container>
  );
};
export default Bill;
