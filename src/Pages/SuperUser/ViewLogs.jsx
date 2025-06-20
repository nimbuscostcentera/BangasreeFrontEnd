import { useEffect, useState } from "react";
import moment from "moment";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Divider, TextField } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";

import ReusableUnCheckedTable from "../../Components/Global/ReusableUnCheckedTable";
import DateRangFilter2 from "../../Components/Global/DateRangeFilter2";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import UseFetchLogs from "../../Apps/CustomHook/useFetchLogs";

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
      l:1060,
      xl: 1125,
      xxl: 1210,
      xxxl: 1345,
      Big: 1500,
    },
  },
});

function ViewLogs() {
  const [Filters, setFilters] = useState({
    StartDate: null,
    EndDate: null,
    CellValue: "",
  });
  const [filteredData,setFilterData]=useState([]);
  const { global } = UseFetchLogger();
  const currentdate = moment();
  const FilterHandler = (e) => {
    let value = e.target.value;
    let key = e.target.name;
    setFilters({
      ...Filters,
      [key]: value,
    });
  };
  const { LogBookdetails,isLogListLoading,isLogListSuccess } = UseFetchLogs(Filters, [
    Filters?.StartDate,
    Filters?.EndDate,
  ]);
  const column = [
    {
      field: `UserName`,
      headerName: "UserName",
      width: 160,
      hideable: false,
    },
    {
      field: `DateTime`,
      headerName: "DateTime",
      width: 180,
      hideable: false,
      renderCell: (i) => {
        console.log(i?.row?.DateTime);
        return (
          <span>{moment(i?.row?.DateTime).format("DD/MM/YYYY HH:mm:ss")}</span>
        );
      },
    },
    {
      field: `PageName`,
      headerName: "PageName",
      width: 150,
      hideable: false,
    },
    {
      field: `Description`,
      headerName: "Description",
      width: 150,
      hideable: false,
    },
    {
      field: `message`,
      headerName: "Request",
      width: 500,
      hideable: false
    },
  ];
 
  useEffect(() => {
    if (isLogListSuccess && !isLogListLoading) {
      let arr = [];
        LogBookdetails?.forEach((i) => arr.push({ ...i }));
        let req = {};
        arr?.forEach((item) => {
          req = JSON.parse(item?.Request);
          item.message = `A ${
            req?.Utype == 1
              ? req?.SuperUserType == 1
                ? "Super User"
                : "BackOfficeUser"
              : "Agent"
          } of LoggerID ${req?.LoggerID} and BarnchID ${req?.LoggerBranchId} ${
            item?.Description
          } ${req?.SchemeRegId ? "of SchemeID " + req?.SchemeRegId : ""} ${
            req?.CollectionId? "of Collection ID " + req?.CollectionId:""
          }`;
        });
        setFilterData(arr);
    } else {
      return;
    }
  }, [LogBookdetails,isLogListLoading, isLogListSuccess,Filters?.EndDate,Filters?.StartDate]);
  return (
    <ThemeProvider theme={CustomTheme}>
       <Grid container ml={2} mt={3} maxWidth={"l"}>
        <Grid item xs={12} sm={4} md={4} lg={6} xl={6}>
          <ReusableBreadcrumbs
            props={[
              {
                title: "Home",
                link: global.Utype == 1 ? "/executive" : "/agent",
                icon: "home",
              },
              {
                title: "View Logs",
                link: "#",
                icon: "manage_history",
              },
            ]}
          />
        </Grid>
        <Grid
          item
          xl={6}
          sm={8}
          lg={6}
          md={10}
          xs={12}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <DateRangFilter2
            state1={Filters?.StartDate||""}
            state2={Filters?.EndDate||""}
            name1={"StartDate"}
            name2={"EndDate"}
            MaxDate1={
              Filters?.EndDate !== undefined &&
              Filters?.EndDate !== null &&
              Filters?.EndDate !== ""
                ? Filters?.EndDate
                : currentdate.format("YYYY-MM-DD")
            }
            MaxDate2={currentdate.format("YYYY-MM-DD")}
            InputHandler={FilterHandler}
          />
        </Grid>
        <Grid item xs={12} xl={12} mt={0.5}>
          <Divider />
        </Grid>
        <Grid
          item
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          display={"flex"}
          justifyContent={{
            xl: "flex-start",
            lg: "flex-start",
            md: "flex-start",
            sm: "center",
            xs: "center",
          }}
          alignItems={"center"}
          flexWrap={"wrap"}
          color={"#000000"}
          my={2}
        >
          <TextField
            value={Filters?.CellValue}
            size="small"
            fullWidth
            label="Show"
            InputLabelProps={{ shrink: true }}
            multiline={true}
            rows={2}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} xl={12}>
          <ReusableUnCheckedTable
            columns={column || []}
            rows={filteredData || []}
            isloading={false}
            height={580}
            uniqueid={"LogID"}
            onClicksingleCell={(e) => {
              setFilters({ ...Filters, CellValue: JSON.stringify(e.value) });
            }}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default ViewLogs;
