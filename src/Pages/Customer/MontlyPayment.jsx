import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFetchMonthlyPayment from "../../Apps/CustomHook/useFetchMonthlyPayment";
import Grid from "@mui/system/Unstable_Grid/Grid";
import ReusableUnCheckedTable from "../../Components/Global/ReusableUnCheckedTable";
import { Divider, Typography } from "@mui/material";
import useFetchWallet from "../../Apps/CustomHook/useFetchWallet";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Box } from "@mui/system";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
function MonthlyPayment() {
  const location = useLocation();
  const { SchemeRegId } = location.state;
  const { isloading52, mpay, isError52, error52, isSuccess52 } =
    useFetchMonthlyPayment({ SchemeRegId: SchemeRegId });
  const { isloading53, wallBal, isError53, error53, isSuccess53 } =
    useFetchWallet({ SchemeRegId: SchemeRegId });
  const { global } = UseFetchLogger();
  const columns = [
    {
      field: "Month",
      headerName: "Month",
      headerAlign: "left",
      align: "left",
      width: 180,
      renderCell: (item) => {
        var a = item.row.Month.split("-");
        var b = "";
        if (a[0] == 1) {
          b = "January";
        } else if (a[0] == 2) {
          b = "February";
        } else if (a[0] == 3) {
          b = "March";
        } else if (a[0] == 4) {
          b = "April";
        } else if (a[0] == 5) {
          b = "May";
        } else if (a[0] == 6) {
          b = "June";
        } else if (a[0] == 7) {
          b = "July";
        } else if (a[0] == 8) {
          b = "August";
        } else if (a[0] == 9) {
          b = "September";
        } else if (a[0] == 10) {
          b = "October";
        } else if (a[0] == 11) {
          b = "November";
        } else {
          b = "December";
        }
        b = b + "," + a[1];
        return <Typography>{b}</Typography>;
      },
    },
    { field: "ExpectedCollection", headerName: "Expected Amount", width: 180 },
    { field: "ActualCollection", headerName: "Paid Amount", width: 150 },
  ];
  return (
    <Grid container mt={4} ml={3} columnGap={2.5} rowGap={1}>
      <Grid item sm={12} xs={12} md={12} lg={12}>
        <Box
          mr={3}
          mb={0.5}
          display={"flex"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
        >
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
                title: "Monthly Payment",
                link: "/customer/monthlypayment",
                icon: "calendar_month",
              },
            ]}
          />
        </Box>
        <Divider />
      </Grid>
      <Grid
        item
        sm={12}
        md={12}
        lg={12}
        xs={12}
        display={"flex"}
        sx={{ justifyContent: "space-between" }}
        mt={1}
      >
        <Typography variant="h6" color={"#5c5c5c"}>
          Monthly Payment Details:
        </Typography>
        <Typography
          variant="h6"
          color={"#5c5c5c"}
          display={"flex"}
          flexDirection={"row"}
          flexWrap={"wrap"}
          px={2}
        >
          Customer Account No. {wallBal?.CustomerAccNo}
          <Box ml={2} mt={0.5}>
            <AccountBalanceWalletIcon />
          </Box>
          <Box>{wallBal?.Wallet}₹</Box>
        </Typography>
      </Grid>
      <Grid
        item
        sm={12}
        md={12}
        lg={12}
        xs={12}
        display={"flex"}
        sx={{ justifyContent: "Space-between" }}
      >
        <ReusableUnCheckedTable
          columns={columns}
          rows={mpay}
          uniqueid={"CollectionId"}
          width={"100%"}
        />
      </Grid>
    </Grid>
  );
}

export default MonthlyPayment;
