import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { useLocation } from "react-router-dom";
import Grid from "@mui/system/Unstable_Grid/Grid";
import ReusableUnCheckedTable from "../../Components/Global/ReusableUnCheckedTable";
import { Divider, Typography, IconButton, Box } from "@mui/material";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { PaymentDetailList } from "../../Slice/PaymentDetails/PaymentDetailsSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import Banga from "../../assets/BangaLogo_updated8Feb.png";
import jsPDF from "jspdf";
import "jspdf-autotable";

function CustPaymentHistory() {
  const dispatch = useDispatch();
  const [pay, setPay] = useState([]);
  const [printableRow, setPrintableRow] = useState([]);
  const location = useLocation();
  const { SchemeRegId = null } = location.state || {};

  const { global } = UseFetchLogger();
  const { isloading29, Resp29, isSuccess29 } = useSelector(
    (state) => state.CustPayDetails
  );

  useEffect(() => {
    if (SchemeRegId) {
      dispatch(PaymentDetailList({ ...global, SchemeRegId: SchemeRegId }));
    }
  }, [SchemeRegId]);

  useEffect(() => {
    if (isSuccess29 && SchemeRegId && Resp29?.length !== 0) {
      setPay(Resp29);
      let arr = [...Resp29];
      let modifiedArr = arr.map((item) => {
        let obj = { ...item };
        obj.Purity = "916 HUID";
        obj.gold_rate = `${(item?.gold_rate || 0).toFixed(2)}/-`;
        obj.PaymentMode =
          item?.PaymentMode == "1"
            ? "Cash"
            : item?.PaymentMode == "2"
            ? "Online Bank"
            : item?.PaymentMode == "3"
            ? "Cheque"
            : item?.PaymentMode == "4"
            ? "UPI"
            : "";
        obj.Collection = `${(item?.totcolection || 0).toFixed(2)}/-`;
        return obj;
      });
      setPrintableRow(modifiedArr);
    }
  }, [isSuccess29, SchemeRegId, isloading29]);

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
            ₹{item?.row?.gold_rate || 0}/-
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
      field: "PaymentMode",
      headerName: "Payment Mode",
      width: 120,
      printWidth: 30,
      renderCell: (item) => {
        return (
          <>
            {item?.row?.PaymentMode == 1
              ? "Cash"
              : item?.row?.PaymentMode == 2
              ? "Online Bank"
              : item?.row?.PaymentMode == 3
              ? "Cheque"
              : item?.row?.PaymentMode == 4
              ? "UPI"
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

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const footerHeight = 30;
    const maxTableHeight = pageHeight - footerHeight - 15;
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
      ["Customer Name", printableRow[0]?.CustomerName],
      ["Phone", printableRow[0]?.PhoneNumber],
      ["Address", printableRow[0]?.Address],
      ["A/C No.", printableRow[0]?.CustomerAccNo],
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
          data.cell.styles.minCellHeight = 4 * 5.5; // Each line = 5px height
        }
      },
      styles: { fontSize: 9, cellPadding: 2.3 },
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
      styles: { fontSize: 9, cellPadding: 2.1 },
      margin: { left: 110 },
      tableWidth: 90,
    });

    custTableHeight = Math.max(doc.autoTable.previous.finalY, custTableHeight);
    const paymentHistoryColumns = [
      { header: "Date", dataKey: "CollDate" },
      { header: "Purity", dataKey: "Purity" },
      { header: "Gold Rate", dataKey: "gold_rate" },
      { header: "Paid Amt.", dataKey: "Collection" },
      { header: "Payment Mode", dataKey: "PaymentMode" },
      { header: "Agent", dataKey: "AgentCode" },
    ];

    const paymentHistoryRows = printableRow.map((item) => ({
      CollDate: moment(item.CollDate).format("DD/MM/YYYY"),
      Purity: item.Purity,
      gold_rate: item.gold_rate,
      Collection: item.Collection,
      PaymentMode: item?.PaymentMode,
      AgentCode: item?.AgentCode,
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
        headStyles: { fillColor: "#8b2424" },
        styles: { fontSize: 9, cellPadding: 1.5 },
        margin: { left: 10, right: 10 },
        pageBreak: "auto",
        didDrawPage: function (data) {
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
    <Grid container ml={2} mt={2}>
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
      <Grid item md={12} lg={12} sm={12} xs={12} mt={2}>
        <ReusableUnCheckedTable
          columns={col || []}
          rows={pay || []}
          uniqueid={"CollectionId"}
          isloading={isloading29}
          height={400}
        />
      </Grid>
    </Grid>
  );
}

export default CustPaymentHistory;
