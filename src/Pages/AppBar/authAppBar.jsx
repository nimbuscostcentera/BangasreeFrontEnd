import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Banga from "../../assets/BangaLogo3.png";
export default function AuthAppBar() {
  return (
    <Box sx={{ flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <img
            src={Banga}
            height={"50px"}
            width={"180px"}
            alt={
              <Typography variant="h6" noWrap component="div" color={"inherit"}>
                BanagaSree Jewellers
              </Typography>
            }
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
