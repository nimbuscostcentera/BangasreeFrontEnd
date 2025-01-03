import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { useLocation } from "react-router-dom";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Loader from "../../Components/Global/loader";
import { useReactToPrint } from "react-to-print";
import ReusableUnCheckedTable from "../../Components/Global/ReusableUnCheckedTable";
import {
  Divider,
  Typography,
  IconButton,
  Box,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Modal,
} from "@mui/material";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { PaymentDetailList } from "../../Slice/PaymentDetails/PaymentDetailsSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import Banga from "../../assets/BangaLogo_black.png";

function CustPaymentHistory() {
  const dispatch = useDispatch();
  const componentRef = useRef(null);
  const [open, setOpen] = useState(true);
  const [pay, setPay] = useState([]);
  const [CustomerDetail, setCustomerDetail] = useState({
    BranchName: null,
    AreaName: null,
    Duration: null,
    frequency: null,
    EMI: null,
    SchemeTitle: null,
    Address: null,
    PhoneNumber: null,
    AgentCode: null,
    CustomerAccNo: null,
    CustomerName: null,
  });
  const [printableRow, setPrintableRow] = useState([]);
  const location = useLocation();
  const { SchemeRegId = null } = location.state || {};

  const handlePrint = useReactToPrint({ content: () => componentRef.current });
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   pageStyle: ` @page {
  //     size: potrate;
  //     margin: 10mm;
  //   }
  //   @media print {
  //     body {
  //       -webkit-print-color-adjust: exact;
  //       margin-top:10px;
  //       margin-bottom:20px
  //     }
  //     .printable-content {
  //       color: black;
  //     }
  //   }`,
  // });

  const { global } = UseFetchLogger();
  const { isloading29, Resp29, isError29, error29, isSuccess29 } = useSelector(
    (state) => state.CustPayDetails
  );
  //customer payment history api call by customer schemeregid(frontend-account no)
  useEffect(() => {
    if (SchemeRegId) {
      dispatch(PaymentDetailList({ ...global, SchemeRegId: SchemeRegId }));
    }
  }, [SchemeRegId]);

  //payment history save to hook
  useEffect(() => {
    if (isSuccess29 && SchemeRegId && Resp29?.length !== 0) {
      setOpen(false);
      setPay(Resp29);
      let arr = [...Resp29];
      setCustomerDetail({
        BranchName: arr[0]?.BranchName,
        AreaName: arr[0]?.AreaName,
        Duration: arr[0]?.Duration,
        frequency: arr[0]?.frequency,
        EMI: arr[0]?.EMI,
        SchemeTitle: arr[0]?.SchemeTitle,
        Address: arr[0]?.Address,
        PhoneNumber: arr[0]?.PhoneNumber,
        AgentCode: arr[0]?.AgentCode,
        CustomerAccNo: arr[0]?.CustomerAccNo,
        CustomerName: arr[0]?.CustomerName,
      });

      let modifiedArr = arr.map((item) => {
        let obj = { ...item };
        obj.Purity = "22K";
        obj.gold_rate = `₹${item?.gold_rate || 0}/-`;
        obj.PaymentMode =
          item?.PaymentMode == 1 ? "Cash" : "Online/Bank Transaction";
        obj.Collection = `₹${item?.totcolection || 0}/-`;
        return obj;
      });
      setPrintableRow(modifiedArr);
    }
    if (isloading29) {
      setOpen(true);
    }
  }, [isSuccess29, SchemeRegId, isloading29]);
  //column for datagrid
  const columns = [
    {
      field: "CustomerName",
      headerName: "Customer",
      PrintHeaderName: "Customer Name",
      width: 150,
      printWidth: 80,
    },
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
        return <Typography>22kt</Typography>;
      },
    },
    {
      field: "gold_rate",
      headerName: "Gold Rate",
      PrintHeaderName: "Gold Rate",
      width: 80,
      printWidth: 70,
      renderCell: (item) => {
        return <Typography>₹{item?.row?.gold_rate}/-</Typography>;
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
  //column for print
  const ColPrint = [
    {
      field: "CollDate",
      headerName: "Collection Date",
      PrintHeaderName: "Collection Date",
      printWidth: 70,
    },
    {
      field: "Purity",
      headerName: "Purity",
      PrintHeaderName: "Purity",
      printWidth: 30,
    },
    {
      field: "gold_rate",
      headerName: "Gold Rate",
      PrintHeaderName: "Gold Rate",
      printWidth: 40,
    },
    {
      field: "Collection",
      headerName: "Paid Amt.",
      PrintHeaderName: "Paid Amt.",
      printWidth: 40,
    },
    {
      field: "PaymentMode",
      headerName: "Payment Mode",
      PrintHeaderName: "Payment Mode",
      width: 80,
      printWidth: 70,
    },
    {
      field: "AgentCode",
      headerName: "AgentCode",
      PrintHeaderName: "AgentCode",
      width: 80,
      printWidth: 70,
    },
  ];

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Grid container mt={4} ml={2} maxWidth={"xl"}>
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
      <Grid item sm={12} xs={12} md={12} lg={12}>
        <Box
          mr={3}
          display={"flex"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
        >
          {global?.utype == 1 ? (
            <ReusableBreadcrumbs
              props={[
                {
                  title: "Edit Customer",
                  link: "/superuser/vieweditcustomer",
                  icon: "pencil",
                },
                {
                  title: "Payment History",
                  link: "#",
                  icon: "manage_accounts",
                },
              ]}
            />
          ) : (
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
          )}
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
          <IconButton onClick={handlePrint}>
            <LocalPrintshopIcon />
          </IconButton>
        </Box>
      </Grid>
      <Grid item md={12} lg={12} sm={12} xs={12} mt={2}>
        <ReusableUnCheckedTable
          columns={columns || []}
          rows={pay || []}
          uniqueid={"CollectionId"}
          isloading={isloading29}
          height={400}
        />
      </Grid>
      <Grid item xs={12} xl={12} color={"grey"}>
        <hr />
        <h3>Preview Payment History</h3>
        <hr />
      </Grid>
      <Grid item xs={12} xl={12}>
        <div ref={componentRef}>
          <PrintableTable row={printableRow} Col={ColPrint} />

          {/* <Grid
        item
        xs={12}
        sm={6}
        md={4.7}
        lg={3.8}
        xl={3.8}
        sx={{
          color: "grey",
        }}
      >
        <div style={{ maxWidth: "250px", maxHeight: "80px" }}>
          <img src={Banga} width={"100%"} height={"100%"} />
        </div>
        <br /> <br />
        <br />
        <div style={{ width: "80%", marginTop: 2, marginLeft: 2 }}>
          <Typography>ACCOUNT HISTORY</Typography>
          <hr />
          <table>
            <tbody>
              <tr>
                <td>Transaction Period:</td>
                <td>
                  {startDate} to {endDate}
                </td>
              </tr>
            </tbody>
          </table>{" "}
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={3.6}
        lg={4.4}
        xl={4.5}
        sx={{
          padding: 0,
          color: "grey",
          display: "flex",

          justifyContent: {
            xl: "center",
            lg: "center",
            md: "center",
            sm: "end",
            xs: "start",
          },
        }}
      >
        <table>
          <tbody>
            <tr>
              <td>Customer:</td>
              <td style={{ padding: "0 0 0 5px" }}>
                {CustomerDetail?.CustomerName}
              </td>
            </tr>
            <tr>
              <td>A/C. No:</td>
              <td style={{ padding: "0 0 0 5px" }}>
                {CustomerDetail?.CustomerAccNo}
              </td>
            </tr>
            <tr>
              <td>Agent Code:</td>
              <td style={{ padding: "0 0 0 5px" }}>
                {CustomerDetail?.AgentCode}
              </td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td style={{ padding: "0 0 0 5px" }}>
                {CustomerDetail?.PhoneNumber}
              </td>
            </tr>
            <tr>
              <td style={{ alignItems: "flex-start", display: "flex" }}>
                Address:
              </td>
              <td
                style={{
                  minWidth: "100px",
                  padding: "0 0 0 5px",
                  textWrap: "wrap",
                }}
              >
                {CustomerDetail?.Address}
              </td>
            </tr>
          </tbody>
        </table>
      </Grid>{" "}
      <Grid
        item
        xs={12}
        sm={12}
        md={3.5}
        lg={3.8}
        xl={3.5}
        sx={{
          color: "grey",
          display: "flex",
          justifyContent: {
            xl: "end",
            lg: "center",
            md: "center",
            sm: "center",
            xs: "start",
          },
        }}
      >
        <table>
          <tbody>
            <tr>
              <td>Scheme Name:</td>
              <td style={{ padding: "0 0 0 5px" }}>
                {CustomerDetail?.SchemeTitle}
              </td>
            </tr>
            <tr>
              <td>Installment Amount:</td>
              <td style={{ padding: "0 0 0 5px" }}>₹{CustomerDetail?.EMI}/-</td>
            </tr>
            <tr>
              <td>Installment Schedule:</td>
              <td style={{ padding: "0 0 0 5px" }}>
                {CustomerDetail?.frequency}
              </td>
            </tr>
            <tr>
              <td>Plan Tenure:</td>
              <td style={{ padding: "0 0 0 5px" }}>
                {CustomerDetail?.Duration}
              </td>
            </tr>
            <tr>
              <td>Area : </td>
              <td style={{ padding: "0 0 0 5px" }}>
                {CustomerDetail?.AreaName}
              </td>
            </tr>{" "}
            <tr>
              <td>Branch Code:</td>
              <td style={{ padding: "0 0 0 5px" }}>
                {CustomerDetail?.BranchName}
              </td>
            </tr>
          </tbody>
        </table>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Box
          sx={{
            maxHeight: "400px", // Set a maximum height for the table container
            overflow: "auto", // Enable scrolling
            border: "1px solid lightgrey",
            "::-webkit-scrollbar": {
              height: "5px",
              bgcolor: "grey",
            },
          }}
        >
          <Table size="small" sx={{ overflow: "auto" }}>
            <TableHead>
              <TableRow
                sx={{
                  border: "1px solid lightgrey",
                }}
              >
                {ColPrint?.map((header, index) => {
                  return (
                    <TableCell key={index}>
                      <Typography sx={{ fontSize: "16px" }}>
                        {header?.PrintHeaderName}
                      </Typography>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody sx={{ border: "1px solid lightgrey" }}>
              {printableRow?.map((item, index) => {
                return (
                  <TableRow key={index}>
                    {ColPrint?.map((celldata, index) => {
                      return (
                        <TableCell
                          sx={{ width: celldata?.printWidth }}
                          key={index}
                        >
                          {celldata?.field == "CollDate" ? (
                            <Typography sx={{ fontSize: "15px" }}>
                              {moment(item[celldata?.field]).format(
                                "DD/MM/YYYY"
                              )}
                            </Typography>
                          ) : (
                            <Typography sx={{ fontSize: "15px" }}>
                              {item[celldata?.field]}
                            </Typography>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>{" "}
      </Grid> */}
        </div>
      </Grid>
    </Grid>
  );
}

const PrintableTable = ({ row, Col }) => {
  var startDate = moment(row[0]?.StartDate).format("DD/MM/YYYY");
  var endDate = moment(row[0]?.StartDate)
    .add(12, "months")
    .format("DD/MM/YYYY");

  // var endDate = moment(row[0]?.StartDate).add(row[0]?.Duration, "months");
  return (
    <Grid container width={"100%"}>
      <Grid
        item
        xs={12}
        sm={3.8}
        md={4}
        lg={3.8}
        xl={3.8}
        sx={{
          color: "grey",
        }}
      >
        <img src={Banga} width={"100%"} height={"50%"} />

        <br />
        <div style={{ width: "80%", marginTop: 2, marginLeft: 2 }}>
          <Typography>ACCOUNT HISTORY</Typography>
          <hr />
          <table>
            <tbody>
              <tr>
                <td>Transaction Period:</td>
                <td>
                  {startDate} to {endDate}
                </td>
              </tr>
            </tbody>
          </table>{" "}
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        sm={4.3}
        md={4.3}
        lg={4.2}
        xl={4.5}
        sx={{
          paddingX: "40px",
          color: "grey",
          display: "flex",

          justifyContent: {
            xl: "center",
            lg: "center",
            md: "center",
            sm: "end",
            xs: "start",
          },
        }}
      >
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td>Customer:</td>
              <td style={{ padding: "0 0 0 5px", textAlign: "end" }}>
                {row[0]?.CustomerName}
              </td>
            </tr>
            <tr>
              <td>A/C. No:</td>
              <td style={{ padding: "0 0 0 5px", textAlign: "end" }}>
                {row[0]?.CustomerAccNo}
              </td>
            </tr>
            <tr>
              <td>Agent Code:</td>
              <td style={{ padding: "0 0 0 5px", textAlign: "end" }}>
                {row[0]?.AgentCode}
              </td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td style={{ padding: "0 0 0 5px", textAlign: "end" }}>
                {row[0]?.PhoneNumber}
              </td>
            </tr>
            <tr>
              <td>Address:</td>
              <td
                style={{
                  minWidth: "100px",
                  padding: "0 0 0 5px",
                  textWrap: "wrap",
                  textAlign: "end",
                }}
              >
                {row[0]?.Address}
              </td>
            </tr>
          </tbody>
        </table>
      </Grid>
      {/** third grid of header */}
      <Grid
        item
        xs={12}
        sm={3.8}
        md={3.5}
        lg={4}
        xl={3.8}
        sx={{
          paddingX: "40px",
          color: "grey",
          display: "flex",
          justifyContent: {
            xl: "end",
            lg: "center",
            md: "center",
            sm: "center",
            xs: "start",
          },
        }}
      >
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ textAlign: "start" }}>Scheme Name:</td>
              <td style={{ textAlign: "end" }}>{row[0]?.SchemeTitle || ""}</td>
            </tr>
            <tr>
              <td>Installment Amount:</td>
              <td style={{ textAlign: "end" }}>₹{row[0]?.EMI || 0}/-</td>
            </tr>
            <tr>
              <td>Installment Schedule:</td>
              <td style={{ textAlign: "end" }}>{row[0]?.frequency || ""}</td>
            </tr>
            <tr>
              <td>Plan Tenure:</td>
              <td style={{ textAlign: "end" }}>{row[0]?.Duration || ""}</td>
            </tr>
            <tr>
              <td>Area : </td>
              <td style={{ textAlign: "end" }}>{row[0]?.AreaName || ""}</td>
            </tr>{" "}
            <tr>
              <td>Branch Code:</td>
              <td style={{ textAlign: "end" }}>{row[0]?.BranchName || ""}</td>
            </tr>
          </tbody>
        </table>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Box
          sx={{
            minWidth: "250px",
            // Set a maximum height for the table container
            overflow: "auto", // Enable scrolling
            border: "1px solid lightgrey",
            "::-webkit-scrollbar": {
              height: "5px",
              bgcolor: "grey",
            },
          }}
        >
          <Table size="small" sx={{ overflow: "auto" }}>
            <TableHead>
              <TableRow
                sx={{
                  border: "1px solid lightgrey",
                }}
              >
                {Col?.map((header, index) => {
                  return (
                    <TableCell key={index}>
                      <Typography sx={{ fontSize: "16px" }}>
                        {header?.PrintHeaderName}
                      </Typography>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody sx={{ border: "1px solid lightgrey" }}>
              {row?.map((item, index) => {
                return (
                  <TableRow key={index}>
                    {Col?.map((celldata, index) => {
                      return (
                        <TableCell
                          sx={{ width: celldata?.printWidth }}
                          key={index}
                        >
                          {celldata?.field == "CollDate" ? (
                            <Typography sx={{ fontSize: "15px" }}>
                              {moment(item[celldata?.field]).format(
                                "DD/MM/YYYY"
                              )}
                            </Typography>
                          ) : (
                            <Typography sx={{ fontSize: "15px" }}>
                              {item[celldata?.field]}
                            </Typography>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>{" "}
      </Grid>
    </Grid>
  );
};
export default CustPaymentHistory;
