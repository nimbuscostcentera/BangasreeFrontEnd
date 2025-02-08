import React from "react";
import { Box, Container } from "@mui/system";
import MiniDrawer from "../../Pages/AppBar/index";
import PageNotFound from "../../Pages/Common/PageNotFound";
import AuthAppBar from "../../Pages/AppBar/authAppBar";
import { Children } from "react";
function UserPrivateLayout({ children }) {
  return (
    <Container maxWidth={"xl"}>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <MiniDrawer />
        {children}
      </Box>
    </Container>
  );
}

export default UserPrivateLayout;
