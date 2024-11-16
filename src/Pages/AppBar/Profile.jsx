import React, { useMemo } from "react";
import moment from "moment";
import { Box, textAlign, width } from "@mui/system";
import { Typography, Divider, TextField } from "@mui/material";
import Grid from "@mui/material/Grid/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import ResetPass from "./ResetPass";
import useFetchCards from "../../Apps/CustomHook/UseFetchCards";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";

import NoImage from "../../assets/user1.png";
var BaseImageUrl = import.meta.env.VITE_IMAGEURL;

const CustomTheme = createTheme({
  breakpoints: {
    keys: ["xxs", "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"],
    values: {
      xxs: 100,
      xs: 200,
      sm: 400,
      mid: 550,
      md: 695,
      lg: 1000,
      xl: 1110,
      xxl: 1210,
      xxxl: 1345,
      Big: 1500,
    },
  },
});

function Profile() {
  const { userInfo } = UseFetchLogger();
  let imgWidth = window?.innerWidth === 950 ? "100%" : "250px";
   let obj = {};
   if (userInfo?.details?.Utype == 3) {
     obj.CustomerID = userInfo?.details?.CustomerID;
     obj.CustUUid = userInfo?.details?.UUid;
   }
    const { CardData } = useFetchCards(obj, [], "");
  

  return (
    <ThemeProvider theme={CustomTheme}>
      <Grid container mt={5} ml={3} columnGap={5} rowGap={1}>
        <Grid
          item
          sm={12}
          xs={12}
          md={12}
          lg={12}
          xl={4.3}
          xxl={3.6}
          xxxl={3.4}
          sx={{
            bgcolor: "#EDEFF0",
            color: "black",
            boxShadow: "2px 2px 5px grey",
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "column",
              md: "row",
              lg: "row",
              xl: "column",
              xxl: "column",
            },
            justifyContent: {
              sm: "flex-start",
              xs: "flex-start",
              md: "space-between",
              lg: "space-between",
              xl: "flex-start",
              xxl: "flex-start",
            },
            alignItems: {
              sm: "center",
              xs: "center",
              md: "space-between",
              lg: "space-between",
              xl: "center",
              xxl: "center",
            },
          }}
        >
          <Box
            sx={{
              width: {
                sm: 240,
                md: 260,
                lg: "27%",
                xl: 270,
                xxl: 280,
                xxxl: 240,
              },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
              mt: {
                xl: 2,
                xxl: 2,
                xxxl: 2,
              },
            }}
          >
            <img
              src={
                userInfo?.details?.Utype == 1
                  ? `${BaseImageUrl}/Superuser/ProfilePhoto/${userInfo?.details?.Photo}`
                  : userInfo?.details?.Utype == 2
                  ? `${BaseImageUrl}/Agent/ProfilePhoto/${userInfo?.details?.Photo}`
                  : userInfo?.details?.Utype == 3
                  ? `${BaseImageUrl}/Customer/ProfilePhoto/${userInfo?.details?.AplicantPhoto}`
                  : null
              }
              alt="profile image"
              width={"100%"}
              onError={(e) => {
                e.target.src = NoImage;
              }}
            />
          </Box>
          <Box
            sx={{
              width: {
                mid: 300,
                md: 350,
                lg: 260,
                xl: 200,
                xxl: 260,
                xxxl: 230,
              },
              ml: {
                lg: 5,
                md: 0,
                xl: 0,
              },
              mt: {
                sm: 1,
                mid: 1,
                xxl: 1,
                xxxl: 1,
              },
            }}
          >
            <Typography sx={{ textAlign: "center" }} variant="h6">
              {userInfo?.details?.Name || userInfo?.details?.CustomerName}
            </Typography>
            <Divider />
            <Grid
              container
              rowGap={1}
              p={1}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Grid item sm={2} xs={2} md={2} lg={2}>
                <AccountCircleIcon fontSize="medium" color="secondary" />
              </Grid>
              <Grid item sm={10} xs={10} md={10} lg={10}>
                <Typography>
                  {userInfo?.details?.Utype == 1
                    ? "SuperUser"
                    : userInfo?.details?.Utype == 2
                    ? "Agent"
                    : userInfo?.details?.Utype == 3
                    ? "Customer"
                    : null}
                </Typography>
              </Grid>

              <Grid item sm={2} xs={2} md={2} lg={2}>
                <PhoneIcon fontSize="medium" color="success" />
              </Grid>
              <Grid item sm={10} xs={10} md={10} lg={10}>
                <Typography>
                  {userInfo?.details?.Utype == 1
                    ? userInfo?.details?.PhoneNumber
                    : userInfo?.details?.Utype == 2
                    ? userInfo?.details?.Phonenumber
                    : userInfo?.details?.Utype == 3
                    ? userInfo?.details?.PhoneNumber
                    : null}
                </Typography>
              </Grid>

              <Grid item sm={2} xs={2} md={2} lg={2}>
                <EmailIcon fontSize="medium" color="primary" />
              </Grid>
              <Grid
                item
                sm={10}
                xs={10}
                md={10}
                lg={10}
                sx={{ flexWrap: "wrap", display: "flex" }}
              >
                <Typography>{userInfo?.details?.EmailId}</Typography>
              </Grid>

              <Grid item sm={2} xs={2} md={2} lg={2}>
                <LocationOnIcon fontSize="medium" color="error" />
              </Grid>
              <Grid item sm={10} xs={10} md={10} lg={10}>
                <Typography sx={{ flexWrap: "wrap", display: "flex" }}>
                  {userInfo?.details?.Address || "37/1 Jayashree park"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid
          item
          sm={12}
          xs={12}
          md={12}
          lg={12}
          xl={7}
          xxl={7.7}
          xxxl={8}
          sx={{
            bgcolor: "#EDEFF0",
            color: "black",
            boxShadow: "2px 2px 5px grey",
            p: 1,
          }}
        >
          <ResetPass />
          <Box sx={{ ml: 2, mt: 1, display: "flex", flexDirection: "row" }}>
            <AssignmentIndIcon fontSize="medium" color="info" />
            <Typography variant="h6" sx={{ mt: -0.3 }}>
              More Details
            </Typography>
          </Box>
          <Divider />
          <Grid container>
            {userInfo?.details?.Utype == 1 ? (
              <>
                <Grid
                  item
                  m={2}
                  py={1}
                  xs={11}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Designation"}
                    fullWidth
                    value={userInfo?.details?.Designation}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={2}
                  py={1}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Branch"}
                    fullWidth
                    value={userInfo?.details?.BranchName}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                  m={2}
                  py={1}
                >
                  <TextField
                    label={"ID Proof Type"}
                    fullWidth
                    value={userInfo?.details?.IDProofType}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                  m={2}
                  py={1}
                >
                  <TextField
                    label={"ID Proof Number"}
                    fullWidth
                    value={userInfo?.details?.IDProofNumber}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
              </>
            ) : userInfo?.details?.Utype == 2 ? (
              <>
                <Grid
                  item
                  m={1}
                  pt={1}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Agent Code"}
                    fullWidth
                    value={userInfo?.details?.AgentCode}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={1}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Area Name"}
                    fullWidth
                    value={userInfo?.details?.AreaName}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={0.5}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Branch Name"}
                    fullWidth
                    value={userInfo?.details?.BranchName}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={0.5}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Comission Percentage"}
                    fullWidth
                    value={`${userInfo?.details?.Commision}%`}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={0.5}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Sex"}
                    fullWidth
                    value={userInfo?.details?.Sex}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={0.5}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Date of Birth"}
                    fullWidth
                    value={moment(userInfo?.details?.DOB).format("DD-MM-YYYY")}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={0.5}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Bank Name"}
                    fullWidth
                    value={userInfo?.details?.BankName}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={0.5}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Account Number"}
                    fullWidth
                    value={userInfo?.details?.AccountNumber}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={0.5}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Submitted ID Proof"}
                    fullWidth
                    value={userInfo?.details?.IDProofType}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={0.5}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"ID Proof Number"}
                    fullWidth
                    value={userInfo?.details?.IDProofNumber}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
              </>
            ) : userInfo?.details?.Utype == 3 ? (
              <>
                <Grid
                  item
                  m={1}
                  pt={1}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Agent Name"}
                    fullWidth
                    value={`${CardData?.AgentName}:${userInfo?.details?.AgentCode}`}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={1}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Branch Name"}
                    fullWidth
                    value={userInfo?.details?.BranchName}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={1}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Area Name"}
                    fullWidth
                    value={userInfo?.details?.AreaID}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={1}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Occupation"}
                    fullWidth
                    value={userInfo?.details?.Occupation}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={1}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Gurdian"}
                    fullWidth
                    value={userInfo?.details?.Guardian}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={1}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Date of Birth"}
                    fullWidth
                    value={moment(userInfo?.details?.DOB).format("DD-MM-YYYY")}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={1}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Sex"}
                    fullWidth
                    value={userInfo?.details?.Sex}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={1}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Alternate Number"}
                    fullWidth
                    value={userInfo?.details?.AlternateNo}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={1}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Id Proof Type"}
                    fullWidth
                    value={userInfo?.details?.IdProofType}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  m={1}
                  pt={1}
                  xs={12}
                  sm={11.3}
                  md={5}
                  lg={5}
                  xl={5}
                  xxl={5.3}
                  xxxl={5.3}
                >
                  <TextField
                    label={"Id Proof Number"}
                    fullWidth
                    value={userInfo?.details?.IdProofNumber}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
              </>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Profile;
