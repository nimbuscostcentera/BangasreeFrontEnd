import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Banga from "../../assets/BangaLogo3.png";
export default function AuthAppBar() {
  return (
    <Box sx={{ flexGrow: 1, height: "5rem" }}>
      <AppBar position="static">
        <Toolbar>
          <img
            src={Banga}
            height={"50vm"}
            width={"180vm"}
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
