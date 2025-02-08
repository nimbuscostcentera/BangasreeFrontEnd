import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { Grid ,Box,Divider,Typography} from "@mui/material";
import ReusableUnCheckedTable from "../../Components/Global/ReusableUnCheckedTable";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import useFetchSchemeHistory from "../../Apps/CustomHook/useFetchSchemeHistory";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
function SchemeHistory() {
  const col = [
    {
      field: "SchemeTitle",
      headerName: "Scheme Name",
      width: 130,
      hideable: false,
    },
    {
      field: "Regfees",
      headerName: "Reg.Fees",
      width: 100,
      renderCell: (item) => (
        <Typography>{" ₹" + `${item?.row?.Regfees}` + "/-"}</Typography>
      ),
      hideable: false,
    },

    {
      field: "UserName",
      headerName: "Changed By",
      width: 130,
      hideable: false,
    },
    {
      field: "Date",
      headerName: "Date",
      width: 200,
      hideable: false,
      renderCell: (i) => {
        return (
          <>
            {moment(i?.row?.Date).format("DD/MM/YYYY-HH:mm:ss")}
          </>
        );
      },
    },
  ];
  const { global } = UseFetchLogger();
  const { SchemeHist, isSHLoading } = useFetchSchemeHistory({
    UUid:global?.LoggerUUid
  }, []);
  return (
    <Grid container mt={3} ml={3} rowGap={1}>
      <ToastContainer />

      <Grid item xs={12}>
        <Box my={1} mx={1}>
          <ReusableBreadcrumbs
            props={[
              {
                title: "Home",
                link: global.Utype == 1 ? "/executive" : "/agent",
                icon: "home",
              },
              {
                title: "Manage Schemes",
                link: "/superuser/managescheme",
                icon: "savings",
              },
              {
                title: "Scheme History",
                link: "#",
                icon: "history",
              },
            ]}
          />
        </Box>
        <Divider />
      </Grid>
      <Grid item xl={12} xs={12} mt={3}>
        <ReusableUnCheckedTable
          columns={col}
          rows={SchemeHist}
          isloading={isSHLoading}
          uniqueid={"id"}
          height={450}
        />
      </Grid>
    </Grid>
  );
}

export default SchemeHistory;
