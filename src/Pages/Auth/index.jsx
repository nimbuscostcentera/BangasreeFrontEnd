import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import BgImg from "../../assets/jewellery.jpg";
import Copyright from "../../Components/Global/CopyRight";
import { Outlet } from "react-router-dom";
export default function AuthScreen() {
  //localStorage.clear();
  return (
      <Grid container component="main" sx={{ height: "91vh",m:"0px !important",p:"0px !important" }}>
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
  );
}
