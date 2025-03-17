import { Box, Container } from "@mui/system";
import MiniDrawer from "../../Pages/AppBar/index";
import PropTypes from "prop-types";
const UserPrivateLayout=({ children })=>{
  return (
    <Container
      maxWidth={"xl"}
      sx={{
        m: "0px !important",
        p: "0px !important",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", m: 0, p: 0 }}>
        <MiniDrawer />
        <div
          style={{
            padding:"30px",
            width: "90%",
            height:"88vh"
          }}
        >{children}
        </div>
      </Box>
    </Container>
  );
}
UserPrivateLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default UserPrivateLayout;
