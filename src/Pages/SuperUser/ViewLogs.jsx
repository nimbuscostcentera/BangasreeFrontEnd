import React, { useState } from "react";
import moment from "moment";
import Grid from "@mui/system/Unstable_Grid";
import { Divider, TextField } from "@mui/material";
import DateRangFilter2 from "../../Components/Global/DateRangeFilter2";
import ReusableBreadcrumbs from "../../Components/Global/ReusableBreadcrumbs";
import UseFetchLogs from "../../Apps/CustomHook/useFetchLogs";
import ReusableUnCheckedTable from "../../Components/Global/ReusableUnCheckedTable";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
function ViewLogs() {
  const [Filters, setFilters] = useState({
    StartDate: null,
    EndDate: null,
    CellValue: "",
  });
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
  const { LogBookdetails } = UseFetchLogs(Filters, [
    Filters?.StartDate,
    Filters?.EndDate,
  ]);
  const column = [
    {
      field: `UserName`,
      headerName: "UserName",
      width: 130,
      hideable: false,
    },
    {
      field: `DateTime`,
      headerName: "DateTime",
      width: 150,
      hideable: false,
      renderCell: (i) => {
        return (
          <span>{moment(i?.rows?.DateTime).format("DD/MM/YYYY HH:mm:ss")}</span>
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
      width:275,
      hideable: false,
    },
    {
      field: `Request`,
      headerName: "Request",
      width: 500,
      hideable: false,
      renderCell: (item) => {
        let {
          CompanyCode = null,
          Utype = null,
          LoggerUUid = null,
          CustUUid = null,
          ...restall
        } = item?.row;
        return <span>{item?.row?.Request}</span>;
      },
    },
  ];

  return (
    <Grid container mt={2.5} ml={2}>
      <Grid item xs={12}>
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
      <Grid item xs={12} xl={12} mt={0.5}>
        <Divider />
      </Grid>
      <Grid
        item
        xl={3}
        lg={4}
        md={5.5}
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
        color={"#000000"}
        mb={1}
        ml={2}
      >
        <DateRangFilter2
          state1={Filters?.StartDate}
          state2={Filters?.EndDate}
          name1={"StartDate"}
          name2={"EndDate"}
          MaxDate1={
            Filters?.EndDate !== undefined &&
            Filters?.EndDate !== null &&
            Filters?.EndDate !== ""
              ? Filters?.EndDate
              : currentdate
          }
          MaxDate2={currentdate}
          InputHandler={FilterHandler}
        />
      </Grid>
      <Grid
        item
        xl={6.5}
        lg={7}
        md={5.5}
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
        mt={1}
        ml={2}
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
          rows={LogBookdetails || []}
          isloading={false}
          height={"67vh"}
          uniqueid={"LogID"}
          onClicksingleCell={(e) => {
            setFilters({ ...Filters, CellValue: JSON.stringify(e.value) });
          }}
        />
      </Grid>
    </Grid>
  );
}

export default ViewLogs;
