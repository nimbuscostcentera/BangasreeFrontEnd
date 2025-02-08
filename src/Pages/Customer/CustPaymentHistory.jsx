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
import Banga from "../../assets/BangaLogo_color2.png";
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
        obj.PaymentMode =item?.PaymentMode == "1"
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
      orientation: "portrait", // A4 Portrait
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.width; // 210mm (A4 width)
    const pageHeight = doc.internal.pageSize.height; // 297mm (A4 height)

    // Add border with reduced margins
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Add logo (adjusted size for A4)
    const logo = new Image();
    logo.src = Banga;
    doc.addImage(logo, "PNG", 10, 7, 60, 27); // Reduced size

    // Header: "Payment Details" (Right-aligned)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(139, 36, 36);
    const headerText = "Payment History";

    const headerTextWidth = doc.getTextWidth(headerText);
    doc.text(headerText, pageWidth - headerTextWidth - 15, 15); // Adjusted alignment
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(
      `Area: ${printableRow[0]?.AreaName}`,
      pageWidth - headerTextWidth - 10,
      20
    );
    doc.text(
      `Branch: ${printableRow[0]?.BranchName}`,
      pageWidth - headerTextWidth - 10,
      24
    );
    //  Title
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold"); // Add padding
    const textHeight = 6; // Adjust height as needed
    const rectX = 10; // Center align
    const rectY = 32; // Adjust Y position

    doc.setFillColor(245, 245, 245); // Light grey background
    doc.rect(rectX, rectY, pageWidth - 20, textHeight, "F"); // "F" fills the rectangle

    // Add the text
    doc.setTextColor(0, 0, 0); // Set text color to black
    doc.text("Customer Details", pageWidth / 2, 36, {
      align: "center",
    });

    // Customer Details Table
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const CustDetails = [
      ["Customer Name", printableRow[0]?.CustomerName],
      ["Phone", printableRow[0]?.PhoneNumber],
      ["Address", printableRow[0]?.Address],
      ["Account No", printableRow[0]?.CustomerAccNo],
    ];

    doc.autoTable({
      startY: 40,
      startX: 10, // Left-aligned
      head: false,
      body: CustDetails,
      theme: "grid",
      columnStyles: {
        0: { fillColor: [245, 245, 245] }, // Grey background
        1: { fillColor: [255, 255, 255] }, // White background
      },
      styles: { fontSize: 9, cellPadding: 2 },
      margin: { left: 10, right: 10 },
      tableWidth: 90, // Set width to control spacing
    });

    // Account Details Title
    doc.setFontSize(10); // Move title to the right
    doc.setFont("helvetica", "normal");

    // Account Details Table
    const accountDetails = [
      ["Plan Tenure", `${printableRow[0]?.Duration} months`],
      ["Installment Schedule", printableRow[0]?.frequency],
      [
        "Date of Starting",
        moment(printableRow[0]?.StartDate).format("DD/MM/YYYY"),
      ],
      ["Installment Amount", `${(printableRow[0]?.EMI || 0).toFixed(2)}/-`],
    ];

    doc.autoTable({
      startY: 40,
      startX: 110, // Move to the right side
      head: false,
      body: accountDetails,
      theme: "grid",
      columnStyles: {
        0: { fillColor: [245, 245, 245] }, // Grey background
        1: { fillColor: [255, 255, 255] }, // White background
      },
      styles: { fontSize: 9, cellPadding: 2 },
      margin: { left: 110 }, // Ensures correct positioning
      tableWidth: 90, // Keep width consistent
    });
    // Payment History Table (Smaller font to fit 12 rows)

    const paymentHistoryColumns = [
      { header: "Date", dataKey: "CollDate" },
      { header: "Purity", dataKey: "Purity" },
      { header: "Gold Rate", dataKey: "gold_rate" },
      { header: "Paid Amt.", dataKey: "Collection" },
      // { header: "Due", dataKey: "Remaining" },
      { header: "Payment Mode", dataKey: "PaymentMode" },
      { header: "Agent", dataKey: "AgentCode" },
    ];

    const paymentHistoryRows = printableRow.map((item) => ({
      CollDate: moment(item.CollDate).format("DD/MM/YYYY"),
      Purity: item.Purity,
      gold_rate: item.gold_rate,
      Collection: item.Collection,
      // Remaining: `${(item.EMI - item.totcolection || 0).toFixed(2)}/-`,
      PaymentMode: item?.PaymentMode,
      AgentCode: item?.AgentCode,
    }));

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 3,
      head: [paymentHistoryColumns.map((col) => col.header)],
      body: paymentHistoryRows.map((row) =>
        paymentHistoryColumns.map((col) => row[col.dataKey])
      ),
      headStyles: { fillColor: "#8b2424" },
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 1.5, lineHeight: 1 },
      margin: { left: 10, right: 10 },
      pageBreak: "auto",
    });

    // Footer

    doc.setFontSize(8);

    // Define attributes and values (two per row)
    let finalY = pageHeight - 25;
    let centerX = pageWidth / 2;
    let lineSpacing = 5; // Adjust line spacing to prevent overlap

    doc.setFontSize(8);
    const details = [
      {
        label1: "Regd. Office:",
        value1: "361, A. P. Nagar, Sonarpur Bazar More, Kolkata 700150",
        label2: "Mail:",
        value2: "contact.us@bangasreejewellers.com",
      },
      {
        label1: "Phone:",
        value1: "+91-8585023758 / +91-9874823963",
        label2: "Website:",
        value2: "www.bangasreejewellers.com",
      },
      {
        label1: "GSTIN:",
        value1: "19AAHCB0947P1Z4",
        label2: "CIN:",
        value2: "U74999WB2017PTC219632",
        label3: "BIS Hallmark Registration:",
        value3: "519014511",
      },
    ];
    // Define attributes and values (two per row, three in the last row)
    details.forEach((item, index) => {
      let yPos = finalY + index * lineSpacing;

      // Calculate total text width dynamically
      let totalWidth =
        doc.getTextWidth(item.label1 + " ") +
        doc.getTextWidth(item.value1 + "  |  ") +
        doc.getTextWidth(item.label2 + " ") +
        doc.getTextWidth(item.value2);

      if (item.label3) {
        totalWidth +=
          doc.getTextWidth("  |  ") +
          doc.getTextWidth(item.label3 + " ") +
          doc.getTextWidth(item.value3);
      }

      // Set xPos to center-align the entire row
      let xPos = centerX - totalWidth / 2;

      // First column (Bold Label + Normal Value)
      doc.setFont("helvetica", "bold");
      doc.text(item.label1, xPos, yPos);
      xPos += doc.getTextWidth(item.label1 + " ");

      doc.setFont("helvetica", "normal");
      doc.text(item.value1 + "  |  ", xPos, yPos);
      xPos += doc.getTextWidth(item.value1 + "  |  ");

      // Second column (Bold Label + Normal Value)
      doc.setFont("helvetica", "bold");
      doc.text(item.label2, xPos, yPos);
      xPos += doc.getTextWidth(item.label2 + " ");

      doc.setFont("helvetica", "normal");
      doc.text(item.value2, xPos, yPos);
      xPos += doc.getTextWidth(item.value2);

      // If a third column exists, add it
      if (item.label3) {
        doc.setFont("helvetica", "normal");
        doc.text("  |  ", xPos, yPos);
        xPos += doc.getTextWidth("  |  ");

        doc.setFont("helvetica", "bold");
        doc.text(item.label3, xPos, yPos);
        xPos += doc.getTextWidth(item.label3 + " ");

        doc.setFont("helvetica", "normal");
        doc.text(item.value3, xPos, yPos);
      }
    });
    // Save PDF
    // doc.save("Account_Statement.pdf");
    // Convert PDF to Blob URL and Print
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
