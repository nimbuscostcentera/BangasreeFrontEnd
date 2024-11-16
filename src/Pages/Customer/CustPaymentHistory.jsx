import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from "@mui/system/Unstable_Grid/Grid";
import { useReactToPrint } from "react-to-print";
import useFetchCustPayList from "../../Apps/CustomHook/useFetchCustPayList";
import ReusableUnCheckedTable from "../../Components/Global/ReusableUnCheckedTable";
import {
  Divider,
  Typography,
  IconButton,
  Box,
  styled,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Paper,
} from "@mui/material";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  border: `1px solid black`,
  color: "black", // Use theme's divider color
}));
const HeaderCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  border: `1px solid black`,
  color: "black",
}));
const StyledTableContainer = styled(TableContainer)({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  backgroundColor: "white",
});
const StyledTable = styled(Table)({
  overflow: "clip",
});

function CustPaymentHistory() {
  const contentToPrint = useRef(null);
  const location = useLocation();
  const { SchemeRegId } = location.state;
  const { isloading29, pay, isError29, error29, isSuccess29 } =
    useFetchCustPayList({ SchemeRegId: SchemeRegId });
  const columns = [
    {
      field: "SchemeTitle",
      headerName: "Scheme Title",
      PrintHeaderName: "Scheme",
      width: 110,
      printWidth: 80,
    },
    {
      field: "CustomerAccNo",
      headerName: "Account No.",
      PrintHeaderName: "Account No.",
      width: 130,
      printWidth: 90,
    },

    {
      field: "CollDate",
      headerName: "Collection Date",
      PrintHeaderName: "Collection Date",
      width: 120,
      printWidth: 80,
      renderCell: (item) => {
        return (
          <Typography>
            {moment(item?.row?.CollDate).format("DD/MM/YYYY")}
          </Typography>
        );
      },
    },
    {
      field: "Purity",
      headerName: "Purity",
      PrintHeaderName: "Purity",
      width: 60,
      printWidth: 40,
      renderCell: (row) => {
        return <Typography>24kt</Typography>;
      },
    },
    {
      field: "rate",
      headerName: "Gold Rate",
      PrintHeaderName: "Gold Rate",
      width: 80,
      printWidth: 70,
      renderCell: (row) => {
        return <Typography>₹8256/-</Typography>;
      },
    },
    {
      field: "totcolection",
      headerName: "Collected Amt.",
      PrintHeaderName: "Collected Amt",
      width: 110,
      printWidth: 100,
      renderCell: (item) => {
        return (
          <Box sx={{ textAlign: "end", width: "100%" }}>
            <Typography>₹{item?.row?.totcolection || 0}/-</Typography>
          </Box>
        );
      },
    },
    {
      field: "PaymentType",
      headerName: "Pay.Type",
      PrintHeaderName: "Pament Type",
      width: 90,
      printWidth: 30,
      renderCell: (item) => {
        return (
          <Box sx={{ textAlign: "center", width: "100%" }}>
            {item?.row?.PaymentType === 1
              ? "Reg.fees"
              : item?.row?.PaymentType === 2
              ? "EMI"
              : null}
          </Box>
        );
      },
    },
    {
      field: "PaymentStatus",
      headerName: "Pay.Status",
      PrintHeaderName: "Pament Status",
      width: 90,
      printWidth: 30,
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
              ? "rejected"
              : ""}
          </>
        );
      },
    },
    {
      field: "AgentCode",
      PrintHeaderName: "AgentCode",
      headerName: "Agent code",
      width: 120,
      printWidth: 80,
    },
    // { field: "Name", headerName: "Agent", width: 150, printWidth: 100 },
  ];
  const handlePrint = useReactToPrint({
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
    pageStyle: ` @page {
      size: A4 landscape;
      margin:8mm;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        margin-top: 40px;
        margin-bottom:20px;
      }
      .printable-content {
        color: black;
      }
    }`,
  });
  return (
    <Grid container mt={4} ml={2} maxWidth={"xl"}>
      <Grid item sm={12} xs={12} md={12} lg={12}>
        <Box
          mr={3}
          display={"flex"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
        >
          <ReusableBreadcrumbs
            props={[
              { title: "Home", link: "/customer", icon: "home" },
              {
                title: "Payment History",
                link: "#",
                icon: "manage_accounts",
              },
            ]}
          />
        </Box>
        <Divider />
      </Grid>
      <Grid
        item
        md={12}
        lg={12}
        sm={12}
        xs={12}
        mt={2}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography color={"#5c5c5c"} variant="h6">
          Payment History
        </Typography>
        <Box sx={{ color: "black" }}>
          Print A/C Statement:
          <IconButton
            onClick={() => {
              handlePrint(null, () => contentToPrint.current);
            }}
          >
            <LocalPrintshopIcon />
          </IconButton>
        </Box>
      </Grid>
      <Grid item md={12} lg={12} sm={12} xs={12} mt={2}>
        <ReusableUnCheckedTable
          columns={columns}
          rows={pay}
          uniqueid={"CollectionId"}
        />
      </Grid>
      <Box sx={{ display: "none" }}>
        <div ref={contentToPrint}>
          <PrintableTable row={pay} Col={columns} />
        </div>
      </Box>
    </Grid>
  );
}

const PrintableTable = ({ Col, row }) => {
  return (
    <StyledTableContainer component={Paper}>
      <StyledTable size="small">
        <TableHead sx={{ backgroundColor: "white", color: "black" }}>
          <TableRow>
            {Col?.map((header, index) => {
              return (
                <HeaderCell key={index}>
                  <Typography sx={{ fontSize: "16px" }}>
                    {header?.PrintHeaderName}
                  </Typography>
                </HeaderCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {row?.map((item, index) => {
            return (
              <TableRow key={index}>
                {Col?.map((celldata, index) => {
                  return (
                    <StyledTableCell
                      sx={{ width: celldata?.printWidth }}
                      key={index}
                    >
                      {celldata?.field == "CollDate" ? (
                        <Typography sx={{ fontSize: "15px" }}>
                          {moment(item[celldata?.field]).format("DD/MM/YYYY")}
                        </Typography>
                      ) : (
                        <Typography sx={{ fontSize: "15px" }}>
                          {item[celldata?.field]}
                        </Typography>
                      )}
                    </StyledTableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};
export default CustPaymentHistory;
