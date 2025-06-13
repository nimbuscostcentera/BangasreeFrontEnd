import { useLocation } from "react-router-dom";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Box,
  Divider,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import BangasreeLogo from "../../assets/BangaLogo_updated8Feb.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { MCshowFunc } from "../../Slice/Collection/MCShowSlice";
import useFetchSupscription from "../../Apps/CustomHook/UseFetchSubscription";
import moment from "moment";
// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 900,
  margin: "auto",
  backgroundColor: "#fff",
}));

const Logo = styled("img")({
  width: 255,
  height: 112,
  marginBottom: 16,
});

const SignatureBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: "flex",
  justifyContent: "space-between",
  "& > div": {
    textAlign: "center",
    minWidth: 200,
  },
}));

const LabelCell = styled(TableCell)({
  backgroundColor: "#f5f5f5",
  fontWeight: "bold",
  width: "150px",
});

const ValueCell = styled(TableCell)({
  width: "200px",
});

function MaturityCertificateView() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { SchemeRegId } = location.state;
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var myPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Subscriptions")[0];
  const { global } = UseFetchLogger();
  const { resp65, isSuccess65 } = useSelector((state) => state.McShow);

  useEffect(() => {
    dispatch(MCshowFunc({ ...global, SchemeRegId: SchemeRegId }));
  }, []);

  const { sub } = useFetchSupscription({ SchemeRegId: SchemeRegId }, [SchemeRegId]);

  let subscribe = useMemo(() => sub && sub[0], [sub]);
  let MC = useMemo(() => resp65[0], [isSuccess65]);
  let invoiceNo = `${MC?.id}`;
  console.log(invoiceNo, "hi");
  while (invoiceNo?.length < 6) {
    invoiceNo = ("0" + invoiceNo).toString();
    console.log(invoiceNo, "hi");
  }
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "landscape", // Set to Portrait mode
      unit: "mm",
      format: "a5", // Set to A5 paper size
    });

    const pageWidth = doc.internal.pageSize.width; // 210mm (A4 width)
    const pageHeight = doc.internal.pageSize.height; // 297mm (A4 height)

    // Adjust margins
    const marginLeft = 10;
    const marginTop = 5;

    // Add Logo
    const logo = new Image();
    logo.src = BangasreeLogo;
    doc.addImage(logo, "PNG", marginLeft, marginTop-2 , 60, 27);

    // Add Header
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(139, 36, 36);
    doc.text("CLOSURE CERTIFICATE", pageWidth - 40, marginTop +6, {
      align: "center",
    });

    // Invoice & Date Fields
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice No: ${invoiceNo}`, pageWidth - 50, marginTop + 12);
    doc.text(
      `Date: ${moment(MC?.createdAt).format("DD/MM/YYYY")}`,
      pageWidth - 50,
      marginTop + 17
    );

    // Maturity Certificate Title
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold"); // Add padding
    const textHeight = 8; // Adjust height as needed
    const rectX = 10; // Center align
    const rectY = marginTop + 25; // Adjust Y position

    doc.setFillColor(245, 245, 245); // Light grey background
    doc.rect(rectX, rectY, pageWidth - 20, textHeight, "F"); // "F" fills the rectangle

    // Add the text
    doc.setTextColor(0, 0, 0); // Set text color to black
    doc.text(
      "Maturity/PreMaturity Certificate",
      pageWidth / 2,
      marginTop + 30,
      {
        align: "center",
      }
    );

    // Customer & Billing Info
    // Define margin and table positions
    const tabmarginLeft = 12;
    const tabmarginTop = 45;
    const columnWidth = 45; // Adjust as per requirement

    // Customer & Account Details Table
    const customerInfo = [
      ["Customer Name", subscribe?.CustomerName],
      ["A/c No.", subscribe?.CustomerAccNo],
      ["Scheme", subscribe?.SchemeTitle],
      ["EMI", `${(subscribe?.EMI || 0).toFixed(2)}/-`],
      ["Frequency", subscribe?.frequency],
      ["No. of EMI", MC?.NoOfInstallments],
    ];

    // Maturity & Bill Details Table
    const billInfo = [
      ["Bill No.", MC?.BillNumber],
      ["Billing Date", moment(MC?.Billingdate).format("DD/MM/YYYY")],
      ["Order No.", MC?.Ordernumber],
      ["Order Date", moment(MC?.Orderdate).format("DD/MM/YYYY")],
      ["Status", subscribe?.MaturityStatus == 2 ? "PreMature" : "Matured"],
      ["PreMature For", subscribe?.MaturityComment || "N/A"],
    ];

    // First Table: Customer & Account Details
    doc.autoTable({
      startY: tabmarginTop,
      head: false, // No header
      body: customerInfo,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 1 },
      margin: { left: tabmarginLeft },
      columnStyles: {
        0: { cellWidth: columnWidth, fillColor: [245, 245, 245] }, // Grey background
        1: { cellWidth: columnWidth, fillColor: [255, 255, 255] }, // White background
      },
    });

    // Second Table: Maturity & Bill Details (Positioned Next to First Table)
    doc.autoTable({
      startY: tabmarginTop,
      head: false, // No header
      body: billInfo,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 1 },
      margin: { left: tabmarginLeft + columnWidth * 2 + 5 }, // Position second table next to the first
      columnStyles: {
        0: { cellWidth: columnWidth, fillColor: [245, 245, 245] }, // Grey background
        1: { cellWidth: columnWidth, fillColor: [255, 255, 255] }, // White background
      },
    });

    // Jewellery Description Table
    const jewelleryData = [
      [
        MC?.Description,
        `${(MC?.TotalDepositedAmount || 0).toFixed(2)}/-`,
        `${(subscribe?.RedeemAmt || 0).toFixed(2)}/-`,
        `${(MC?.Totalweight || 0).toFixed(3)}gm`,
        `${(MC?.Totalbillamount || 0).toFixed(2)}/-`,
      ],
    ];

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 5,
      head: [
        [
          "Description",
          "Deposited Amt.",
          "Redeemed Amt.",
          "Weight (gm)",
          "Bill Amt.",
        ],
      ],
      body: jewelleryData,
      theme: "striped",
      headStyles: { fillColor: "#8b2424" },
      styles: { fontSize: 9, cellPadding: 1 },
      margin: { left: marginLeft, right: marginLeft },
    });

    // Signature Section
    let finalYaxis = doc.lastAutoTable.finalY + 15;
    doc.line(marginLeft, finalYaxis, marginLeft + 40, finalYaxis);
    doc.text("Customer Signature", marginLeft, finalYaxis + 5);
    doc.line(pageWidth / 2 - 20, finalYaxis, pageWidth / 2 + 20, finalYaxis);
    doc.text("Checked By", pageWidth / 2 - 10, finalYaxis + 5);
    doc.line(pageWidth - 55, finalYaxis, pageWidth - 10, finalYaxis);
    doc.text("Authorized Signatory", pageWidth - 50, finalYaxis + 5);

    // Footer

    doc.setFontSize(8);

    // Define attributes and values (two per row)
    let finalY = pageHeight - 15;
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
        color={"black"}
      >
        {" "}
        <Box mr={3} mt={1}>
          <ReusableBreadcrumbs
            props={[
              {
                title: "Home",
                link: global.Utype == 1 ? "/executive" : "/agent",
                icon: "home",
              },
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
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} xl={12} mt={1}>
        <StyledPaper elevation={2}>
          {/* Header */}
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Logo
                src={BangasreeLogo}
                alt="Bangasree Jewellers"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6} textAlign="right">
              <Typography variant="h5" color="error">
                CLOSURE CERTIFICATE
              </Typography>
              <Typography variant="body1">Invoice No: {invoiceNo}</Typography>
              <Typography variant="body1">
                Date:{moment(MC?.createdAt).format("DD/MM/YYYY")}
              </Typography>
            </Grid>
          </Grid>

          {/* Certificate Title */}
          <Box bgcolor="#f5f5f5" py={0.3} mb={3}>
            <Typography variant="h6" align="center">
              Maturity/PreMaturity Certificate
            </Typography>
          </Box>

          {/* Customer Details Table */}
          <Grid container spacing={2}>
            {/* Left Table */}
            <Grid item xs={6}>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <LabelCell>Customer Name</LabelCell>
                      <ValueCell>{subscribe?.CustomerName || ""}</ValueCell>
                    </TableRow>
                    <TableRow>
                      <LabelCell>Customer A/c No.</LabelCell>
                      <ValueCell>{subscribe?.CustomerAccNo || ""}</ValueCell>
                    </TableRow>
                    <TableRow>
                      <LabelCell>Scheme Title</LabelCell>
                      <ValueCell>{subscribe?.SchemeTitle || ""}</ValueCell>
                    </TableRow>
                    <TableRow>
                      <LabelCell>EMI Amount(₹)</LabelCell>
                      <ValueCell>
                        {`${(subscribe?.EMI || 0).toFixed(2) || 0}/-`}
                      </ValueCell>
                    </TableRow>
                    <TableRow>
                      <LabelCell>EMI Frequency</LabelCell>
                      <ValueCell>{subscribe?.frequency || ""}</ValueCell>
                    </TableRow>
                    <TableRow>
                      <LabelCell>No. of EMI</LabelCell>
                      <ValueCell>{MC?.NoOfInstallments || ""}</ValueCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Right Table */}
            <Grid item xs={6}>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <LabelCell>Bill No.</LabelCell>
                      <ValueCell>{MC?.BillNumber || ""}</ValueCell>
                    </TableRow>
                    <TableRow>
                      <LabelCell>Billing Date</LabelCell>
                      <ValueCell>{MC?.Billingdate || ""}</ValueCell>
                    </TableRow>
                    <TableRow>
                      <LabelCell>Order No.</LabelCell>
                      <ValueCell>{MC?.Ordernumber || ""}</ValueCell>
                    </TableRow>
                    <TableRow>
                      <LabelCell>Order Date</LabelCell>
                      <ValueCell>
                        {moment(MC?.Orderdate).format("DD/MM/YYYY") || ""}
                      </ValueCell>
                    </TableRow>
                    <TableRow>
                      <LabelCell>Maturity status</LabelCell>
                      <ValueCell>
                        {subscribe?.MaturityStatus == 2
                          ? "PreMature"
                          : subscribe?.MaturityStatus == 3
                          ? "Matured"
                          : null}
                      </ValueCell>
                    </TableRow>
                    <TableRow>
                      <LabelCell>PreMature For</LabelCell>
                      <ValueCell>
                        {subscribe?.MaturityComment || "N/A"}
                      </ValueCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          {/* Jewellery Details Table */}
          <TableContainer component={Paper} variant="outlined" sx={{ mt: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#8b2424" }}>
                  <TableCell sx={{ color: "white", width: "250px" }}>
                    Item Description
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    Deposit Amt. (₹)
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    Redeemed Amt. (₹)
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>Total wt. (gm)</TableCell>
                  <TableCell sx={{ color: "white" }}>Bill Amt. (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{MC?.Description}</TableCell>
                  <TableCell>{`${(MC?.TotalDepositedAmount || 0).toFixed(
                    2
                  )}/-`}</TableCell>
                  <TableCell>{`${(subscribe?.RedeemAmt || 0).toFixed(
                    2
                  )}/-`}</TableCell>
                  <TableCell>{(MC?.Totalweight || 0).toFixed(3)}</TableCell>
                  <TableCell>{`${(MC?.Totalbillamount || 0).toFixed(
                    2
                  )}/-`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          <br />
          {/* Signatures */}
          <SignatureBox>
            <div>
              <Divider sx={{ width: 150, margin: "auto" }} />
              <Typography variant="body2" gutterBottom color={"black"}>
                Customer Signature
              </Typography>
            </div>
            <div>
              <Divider sx={{ width: 150, margin: "auto" }} />
              <Typography variant="body2" gutterBottom color={"black"}>
                Checked By
              </Typography>
            </div>
            <div>
              <Divider sx={{ width: 150, margin: "auto" }} />
              <Typography variant="body2" gutterBottom color={"black"}>
                Signature for Bangasree
                <br />
                Jewellers Pvt. Ltd.
              </Typography>
            </div>
          </SignatureBox>

          {/* Footer */}
          <Box mt={4} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              <strong>Regd. Office:</strong> 361, A. P. Nagar, Sonarpur Bazar
              More, Kolkata 700150 | <strong>Mail:</strong>{" "}
              contact.us@bangasreejewellers.com
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Phone:</strong> +91-8585023758 / +91-9874823963 |{" "}
              <strong>Website:</strong> www.bangasreejewellers.com
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>GSTIN:</strong> 19AAHCB0947P1Z4 <strong>CIN:</strong>{" "}
              U74999WB2017PTC219632 <strong>BIS Hallmark Registration:</strong>{" "}
              5190141511
            </Typography>
          </Box>
        </StyledPaper>
      </Grid>
      <Grid
        item
        xs={12}
        xl={12}
        sx={{ display: "flex", justifyContent: "center", mt: 1 }}
      >
        <Button
          variant="contained"
          onClick={() => {
            generatePDF();
          }}
        >
          Print
        </Button>
      </Grid>
    </Grid>
  );
}

export default MaturityCertificateView;
