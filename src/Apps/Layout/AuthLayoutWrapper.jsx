import AuthAppBar from "../../Pages/AppBar/authAppBar";
import PropTypes from "prop-types";
import { Container } from "@mui/system";
export default function AuthLayoutWrapper({ children }) {
  return (
    <Container
      maxWidth={"XXL"}
      sx={{
          m: "0px !important",
          p: "0px !important",
      }}
    >
      <AuthAppBar />
      {children}
    </Container>
  );
}
AuthLayoutWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};