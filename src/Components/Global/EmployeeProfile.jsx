import React, { useState } from "react";
import {
  Grid,
  Box,
  Rating,
  Typography,
  Stack,
  Tab,
  Divider,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Phone, LocationOn, MailOutline } from "@mui/icons-material";
import AgentTable from "../../Pages/Agent/AgentTable";

const EmployeeProfile = ({ data }) => {
  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "20px",
        boxShadow: 24,
        position: "relative",
        color: "#000000",
      }}
    >
      <Grid container ml={1} mt={0.5}>
        <Grid item md={12} lg={2.7} m={5}>
          <img src={data.Photo} height="45%" width="100%" />
          <Stack direction="row" justifyContent="space-around">
            <b>{data?.Name}</b>
            <Rating
              name="half-rating-read"
              defaultValue={4.5}
              precision={0.5}
              readOnly
            />
          </Stack>
          <br />
          <Divider
            sx={{ "--Divider-childPosition": `1%`, marginLeft: "-10px" }}
          >
            Contact Details
          </Divider>

          <Grid container>
            <Grid item xs={4}>
              <Phone color="primary" />
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography>{data.PhoneNumber || data?.Phonenumber}</Typography>
            </Grid>
            <Grid item xs={4}>
              <MailOutline color="error" />
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography>{data.EmailId}</Typography>
            </Grid>
          </Grid>

          <Divider
            sx={{ "--Divider-childPosition": `1%`, marginLeft: "-10px" }}
          >
            Address Details
          </Divider>
          <br />
          <Stack direction="row">
            <LocationOn />
            <Typography>{data.Address}</Typography>
          </Stack>
          <br />
          <Divider
            sx={{ "--Divider-childPosition": `1%`, marginLeft: "-10px" }}
          >
            Personal Detail
          </Divider>
          <Grid container columnGap={10} rowGap={1}>
            <Grid item xs={3.5} alignItems={"right"}>
              <Typography>DOB </Typography>
            </Grid>
            <Grid xs={4} alignItems={"right"}>
              <Typography> {data.DOB} </Typography>
            </Grid>
            <Grid xs={3.5}>
              <Typography> DOJ </Typography>
            </Grid>
            <Grid xs={4} alignItems={"right"}>
              <Typography> {data.RegistrationDate} </Typography>
            </Grid>
            <Grid xs={3.5}>
              <Typography> Sex </Typography>
            </Grid>
            <Grid xs={4} alignItems={"right"}>
              <Typography> {data.Sex} </Typography>
            </Grid>
          </Grid>
        </Grid>
        {/**2nd part */}
        <Grid item lg={7.5} md={12} mt={3} ml={5}>
          <h2>BangaShree Jewellers</h2>
          <Divider
            sx={{ "--Divider-childPosition": `1%`, marginLeft: "-10px" }}
          >
            Office Details
          </Divider>
          <br />
          <Grid container columnGap={2} rowGap={2} sx={{ width: "100%" }}>
            <Grid
              item
              sm={12}
              md={5}
              lg={3.3}
              sx={{
                display: "flex",
                alignItemss: "center",
                padding: "2px",
                borderRadius: "5px",
              }}
            >
              <b>ID: </b>{" "}
              <i>{data?.Utype === 1 ? data?.SuperUserID : data?.AgentID}</i>
            </Grid>
            <Grid
              item
              sm={12}
              md={5}
              lg={3.8}
              sx={{
                display: "flex",
                alignItemss: "center",
                padding: "2px",
                borderRadius: "5px",
              }}
            >
              <b>Agent Code</b> : {data.AgentCode}
            </Grid>
            <Grid
              item
              sm={12}
              md={10}
              lg={3}
              sx={{
                display: "flex",
                padding: "2px",
                borderRadius: "5px",
              }}
            >
              <b>Status</b> :{data.Status ? "Active" : "Inactive"}
            </Grid>
            <Grid
              item
              lg={3.3}
              md={12}
              sx={{
                display: "flex",
                alignItemss: "flex-start",
                padding: "2px",
                borderRadius: "5px",
              }}
            >
              <b>Bank:</b> {data.BankName}
            </Grid>
            <Grid item lg={3.8} md={12}>
              <b>Account Type :</b>
              {data.AccountType}
            </Grid>
            <Grid item lg={3.5} md={12}>
              <b>Account Number :</b>
              {data.AccountNumber}
            </Grid>
            <Grid item lg={3.3} md={12}>
              <b>IFSC Code:</b>
              {data.IFSCCode}
            </Grid>
            <Grid item lg={4} md={12}>
              <b> MICR:</b>
              {data.IFSCCode}
            </Grid>
            <Box>
              <TabContext value={value}>
                <Box sx={{ borderBottom: "2px solid #CBCBCB", width: "100vh" }}>
                  <TabList aria-label="Profile View" onChange={handleChange}>
                    <Tab label="tab one" value="1" />
                    <Tab label="tab two" value="2" />
                    <Tab label="tab three" value="3" />
                  </TabList>
                </Box>
                <TabPanel value="1">Panel 1</TabPanel>
                <TabPanel value="2">
                  <AgentTable />
                </TabPanel>
                <TabPanel value="3">Panel 3</TabPanel>
              </TabContext>
            </Box>
          </Grid>
        </Grid>
        {/**tab bar in 2nd grid item */}
      </Grid>
    </Box>
  );
};
export default EmployeeProfile;
