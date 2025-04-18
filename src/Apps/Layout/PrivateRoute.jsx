
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
const PrivateRoute = ({ authenticated }) => {
  return authenticated ? <Outlet /> : <Navigate to="/" />;
};
PrivateRoute.propTypes = {
  authenticated: PropTypes.string,
};
export default PrivateRoute;
