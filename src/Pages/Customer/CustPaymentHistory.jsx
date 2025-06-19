import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Banga from "../../assets/BangaLogo_updated8Feb.png";
import jsPDF from "jspdf";
import moment from "moment";
import "jspdf-autotable";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Divider, Typography, IconButton, Box } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";

import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

import ReusableUnCheckedTable from "../../Components/Global/ReusableUnCheckedTable";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";

// import { PaymentDetailList } from "../../Slice/PaymentDetails/PaymentDetailsSlice";
import {
  PaymentHistoryFunc,
  ClearStatePayHistory,
} from "../../Slice/PaymentDetails/PaymentHistorySlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";

const CustomTheme = createTheme({
  breakpoints: {
    keys: ["xxs", "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"],
    values: {
      xxs: 100,
      xs: 200,
      sm: 400,
      mid: 695,
      md: 825,
      lg: 960,
      l: 1060,
      xl: 1125,
      xxl: 1210,
      xxxl: 1345,
      Big: 1500,
    },
  },
});

function CustPaymentHistory() {
  const dispatch = useDispatch();
  const [pay, setPay] = useState([]);
  const [printableRow, setPrintableRow] = useState([]);
  const location = useLocation();
  const { SchemeRegId = null } = location.state || {};

  const { global } = UseFetchLogger();
  // const { isloading29, Resp29, isSuccess29 } = useSelector(
  //   (state) => state.CustPayDetails
  // );
  const { isPayHistoryLoading, PaymentHistoryList, isPayHistorySucc } =
    useSelector((state) => state.payHist);
  useEffect(() => {
    if (SchemeRegId) {
      dispatch(PaymentHistoryFunc({ ...global, SchemeRegId: SchemeRegId }));
    }
  }, [SchemeRegId]);

  useEffect(() => {
    if (isPayHistorySucc && SchemeRegId && !isPayHistoryLoading) {
      let arr = [...PaymentHistoryList];
      let sum = 0;
      let modifiedArr = arr.map((item) => {
        let obj = { ...item };
        obj.Purity = "916 HUID";
        obj.gold_rate = `${(item?.gold_rate || 0).toFixed(2)}/-`;
        obj.PMode =
          item?.PaymentMode == "1"
            ? "Cash"
            : item?.PaymentMode == "2"
            ? "Online Bank Transfer"
            : item?.PaymentMode == "3"
            ? "Cheque"
            : item?.PaymentMode == "4"
            ? "UPI"
            // : item?.PaymentMode == "5"
            // ? "Credit Note"
            // : item?.PaymentMode == "6"
            // ? "Poila Boisakh Coupon"
            : null;
        sum = sum + item?.totcolection;
        obj.TotalPaidAmt = `${sum}/-`;
        obj.Collection = `${(item?.totcolection || 0).toFixed(2)}/-`;
        return obj;
      });
      modifiedArr.reverse();
      setPay(modifiedArr);
      setPrintableRow(modifiedArr);
    }
    dispatch(ClearStatePayHistory());
  }, [isPayHistorySucc, SchemeRegId, isPayHistoryLoading]);

  const col = [
    {
      field: "CustomerName",
      headerName: "Customer",
      PrintHeaderName: "Customer Name",
      width: 140,
    },
    {
      field: "SchemeTitle",
      headerName: "Scheme Title",
      PrintHeaderName: "Scheme",
      width: 180,
    },
    {
      field: "CustomerAccNo",
      headerName: "Account No.",
      PrintHeaderName: "Account No.",
      width: 150,
    },

    {
      field: "CollDate",
      headerName: "Date",
      PrintHeaderName: "Collection Date",
      width: 120,
      printWidth: 80,
      renderCell: (item) => {
        return <span>{moment(item?.row?.CollDate).format("DD/MM/YYYY")}</span>;
      },
    },
    {
      field: "Purity",
      headerName: "Purity",
      PrintHeaderName: "Purity",
      width: 90,
      renderCell: () => {
        return <span>916 HUID</span>;
      },
    },
    {
      field: "gold_rate",
      headerName: "Gold Rate",
      PrintHeaderName: "Gold Rate",
      width: 90,
      printWidth: 70,
      renderCell: (item) => {
        return (
          <span style={{ textAlign: "center", width: "100%", fontSize: 15 }}>
            ₹{item?.row?.gold_rate || 0}
          </span>
        );
      },
    },
    {
      field: "totcolection",
      headerName: "Collected Amt.",
      PrintHeaderName: "Collected Amt",
      width: 120,
      printWidth: 100,
      renderCell: (item) => {
        return (
          <span style={{ textAlign: "center", width: "100%", fontSize: 15 }}>
            ₹{item?.row?.totcolection || 0}/-
          </span>
        );
      },
    },
    {
      field: "TotalPaidAmt",
      headerName: "Total Paid Amt.",
      PrintHeaderName: "Total Paid Amt.",
      width: 120,
      printWidth: 100,
      renderCell: (item) => {
        return (
          <span style={{ textAlign: "center", width: "100%", fontSize: 15 }}>
            ₹{item?.row?.TotalPaidAmt || 0}
          </span>
        );
      },
    },
    {
      field: "PaymentType",
      headerName: "Pay.Type",
      PrintHeaderName: "Pament Type",
      width: 110,
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
      width: 110,
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
      field: "PMode",
      headerName: "Payment Mode",
      width: 120,
      printWidth: 30,
      renderCell: (item) => {
        return <>{item?.row?.PMode}</>;
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

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const ROWS_PER_PAGE = 23;

    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    const logo = new Image();
    logo.src = Banga;
    doc.addImage(logo, "PNG", 10, 7, 60, 27);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(139, 36, 36);
    doc.text("Payment History", pageWidth - 50, 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(`Area: ${printableRow[0]?.AreaName}`, pageWidth - 50, 20);
    doc.text(`Branch: ${printableRow[0]?.BranchName}`, pageWidth - 50, 24);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(245, 245, 245);
    doc.rect(10, 32, pageWidth - 20, 6, "F");
    doc.setTextColor(0, 0, 0);
    doc.text("Customer Details", pageWidth / 2, 36, { align: "center" });
    // Customer Details Title
    const CustDetails = [
      ["Cust. Name", printableRow[0]?.CustomerName],
      ["Phone", printableRow[0]?.PhoneNumber],
      ["Address", printableRow[0]?.Address],
      ["A/C No.", printableRow[0]?.CustomerAccNo],
      [
        "Reg. Fees.",
        `${
          printableRow[0]?.Regfees == 0 ||
          printableRow[0]?.Regfees == null ||
          printableRow[0]?.Regfees == undefined
            ? "Not Paid Yet"
            : "Rs." + printableRow[0]?.Regfees + "/- Paid"
        }`,
      ],
    ];

    doc.autoTable({
      startY: 40,
      body: CustDetails,
      theme: "grid",
      headStyles: { fillColor: "#8b2424" },
      columnStyles: {
        0: { fillColor: [245, 245, 245] },
        1: { fillColor: [255, 255, 255] },
      },
      didParseCell: function (data) {
        if (data.row.index === 2) {
          // Address row
          data.cell.styles.minCellHeight = 3 * 5.6; // Each line = 5px height
        }
      },
      styles: { fontSize: 9, cellPadding: 2.1 },
      margin: { left: 10, right: 10 },
      tableWidth: 90,
    });

    let custTableHeight = doc.autoTable.previous.finalY;

    // Account Details Table
    const accountDetails = [
      ["Scheme Name", printableRow[0]?.SchemeTitle],
      ["Plan Tenure", `${printableRow[0]?.Duration} months`],
      ["Installment Schedule", printableRow[0]?.frequency],
      [
        "Starting Date",
        moment(printableRow[0]?.StartDate).format("DD/MM/YYYY"),
      ],
      [
        "Ending Date",
        moment(printableRow[0]?.StartDate)
          .add(printableRow[0]?.Duration, "months")
          .format("DD/MM/YYYY"),
      ],
      ["Installment Amount", `${(printableRow[0]?.EMI || 0).toFixed(2)}/-`],
    ];

    doc.autoTable({
      startY: 40,
      startX: 110,
      body: accountDetails,
      theme: "grid",
      headStyles: { fillColor: "#8b2424" },
      columnStyles: {
        0: { fillColor: [245, 245, 245] },
        1: { fillColor: [255, 255, 255] },
      },
      styles: { fontSize: 9, cellPadding: 2.2 },
      margin: { left: 110 },
      tableWidth: 90,
    });

    custTableHeight = Math.max(doc.autoTable.previous.finalY, custTableHeight);
    const paymentHistoryColumns = [
      { header: "Date", dataKey: "CollDate" },
      { header: "Purity", dataKey: "Purity" },
      { header: "Gold Rate", dataKey: "gold_rate" },
      { header: "Paid Amt.", dataKey: "Collection" },
      { header: "Total Paid Amt.", dataKey: "TotalPaidAmt" },
      { header: "Payment Mode", dataKey: "PMode" },
      { header: "Agent", dataKey: "AgentCode" },
    ];

    const paymentHistoryRows = printableRow.map((item) => ({
      CollDate: moment(item.CollDate).format("DD/MM/YYYY"),
      Purity: item?.Purity || "",
      gold_rate: item?.gold_rate || "",
      Collection: item?.Collection || "",
      TotalPaidAmt: item?.TotalPaidAmt || "",
      PMode: item?.PMode || "",
      AgentCode: item?.AgentCode || "",
    }));

    let startY = custTableHeight + 10;
    let rowsPerPage = ROWS_PER_PAGE;
    for (let i = 0; i < paymentHistoryRows.length; i += rowsPerPage) {
      if (i !== 0) {
        doc.addPage();
        doc.setDrawColor(0);
        doc.setLineWidth(0.3);
        doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
        startY = 20;
      }
      rowsPerPage = i == 0 ? ROWS_PER_PAGE : 35;
      doc.autoTable({
        startY: startY,
        head: [paymentHistoryColumns.map((col) => col.header)],
        body: paymentHistoryRows
          .slice(i, i + rowsPerPage)
          .map((row) => paymentHistoryColumns.map((col) => row[col.dataKey])),
        theme: "grid",
        headStyles: { fillColor: "#8b2424", halign: "center" },
        styles: { fontSize: 9, cellPadding: 1.5, halign: "center" },
        columnStyles: {
          2: { halign: "right", cellWidth:25 },
          3: { halign: "right", cellWidth:25 },
          4: { halign: "right", cellWidth:30 },
          5: { cellWidth:30},
        },
        margin: { left: 10, right: 10 },
        pageBreak: "auto",
        didDrawPage: function () {
          let pageNumber = doc.internal.getNumberOfPages();
          let footerY = doc.internal.pageSize.height - 18;
          addFooter(doc, footerY, pageNumber);
        },
      });
    }

    function addFooter(doc, footerY, pageNumber) {
      let pageWidth = doc.internal.pageSize.width;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text(`Page ${pageNumber}`, pageWidth / 2, footerY - 5, {
        align: "center",
      });
      const footerLines = [
        "Regd. Office: 361, A. P. Nagar, Sonarpur Bazar More, Kolkata 700150 | Mail : contact.us@bangasreejewellers.com",
        "Phone: +91-8585023758 / +91-9874823963 | Website: www.bangasreejewellers.com",
        "GSTIN: 19AAHCB0947P1Z4  CIN: U74999WB2017PTC219632 BIS Hallmark Registration: 5190141511 ",
      ];
      footerLines.forEach((line, index) => {
        doc.text(line, pageWidth / 2, footerY + index * 5, { align: "center" });
      });
    }

    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url);
  };

  return (
    <ThemeProvider theme={CustomTheme}>
      <Grid container ml={2} mt={2} maxWidth={"l"}>
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
          <Box mr={3} mt={1}>
            {global.Utype == 1 ? (
              <ReusableBreadcrumbs
                props={[
                  {
                    title: "Home",
                    link:
                      global.Utype == 3
                        ? "/customer"
                        : global.Utype == 1
                        ? "/executive"
                        : "/agent",
                    icon: "home",
                  },
                  {
                    title: "Manage Collection",
                    link: "/executive/managecollections",
                    icon: "manage_accounts",
                  },
                  {
                    title: "Payment History",
                    link: "#",
                    icon: "savings",
                  },
                ]}
              />
            ) : (
              <ReusableBreadcrumbs
                props={[
                  {
                    title: "Home",
                    link:
                      global.Utype == 3
                        ? "/customer"
                        : global.Utype == 1
                        ? "/executive"
                        : "/agent",
                    icon: "home",
                  },
                  {
                    title: "Payment History",
                    link: "#",
                    icon: "manage_accounts",
                  },
                ]}
              />
            )}
          </Box>
        </Grid>{" "}
        <Grid item xs={12} sm={12} md={12} lg={12} my={0} py={0}>
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
            marginTop: "5px",
            marginBottom: "0px",
          }}
        >
          <Typography color={"#5c5c5c"} variant="h6">
            Payment History
          </Typography>
          <Box sx={{ color: "black" }}>
            Print A/C Statement:
            <IconButton onClick={generatePDF}>
              <LocalPrintshopIcon />
            </IconButton>
          </Box>
        </Grid>
        <Grid item md={12} lg={12} sm={12} xs={12} mt={1}>
          <ReusableUnCheckedTable
            columns={col || []}
            rows={pay || []}
            uniqueid={"CollectionId"}
            isloading={isPayHistoryLoading}
            height={580}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default CustPaymentHistory;
