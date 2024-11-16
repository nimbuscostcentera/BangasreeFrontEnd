import React, { useState } from 'react';
import moment from 'moment';
import { Box, Container, Grid, Divider } from "@mui/material";
import ReusableDataTable from '../../Components/Global/ReusableTable';
import DateRangFilter2 from '../../Components/Global/DateRangeFilter2';
import ReusableBreadcrumbs from '../../Components/Global/ReusableBreadcrumbs';
function ViewLogs() {
    const [Filters, setFilters] = useState({ StartDate: null, EndDate: null });
    const currentdate = moment();
    const FilterHandler = () => {
        
    }
  return (
    <Grid container mt={2.5} ml={2}>
      <Grid item xs={12}>
        <ReusableBreadcrumbs
          props={[
            {
              title: "Home",
              link: "/superuser/purity-metal",
              icon: "home",
            },
            {
              title: "View Logs",
              link: "/superuser/managescheme",
              icon: "location_searching",
            }
          ]}
        />
      </Grid>
      <Grid item xs={12} mt={0.5}>
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
          xs:"center"
        }}
        alignItems={"center"}
        flexWrap={"wrap"}
        color={"#000000"}
        mb={1}
        ml={2}
      >
        <Box>
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
        </Box>
      </Grid>
      <Grid item xs={12} mt={2}>
        <ReusableDataTable
          columns={[]}
          rows={[]}
          isloading={false}
          height={500}
          uniqueid={""}
        />
      </Grid>
    </Grid>
  );
}

export default ViewLogs