import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import BgImg from "../../assets/jewellery.jpg";
import Copyright from "../../Components/Global/CopyRight";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
export default function AuthScreen() {
  //localStorage.clear();
  return (
    <Box m={-2}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={8}
          sx={{
            backgroundImage: `url(${BgImg})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></Grid>
        <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
          <Outlet />
          <Copyright />
        </Grid>
      </Grid>
    </Box>
  );
}
