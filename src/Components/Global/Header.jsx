import { Typography, Box } from "@mui/material";
import PropTypes from "prop-types"
const Header = ({ title, subtitle }) => {
  return (
    <Box sx={{ display: "grid",marginBottom:"15px" }}>
      <Box
        sx={{
          display: "block",
          color: "#374151",
          textAlign: "start",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", fontSize: "26px", float: "left" }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "start" }}>
        <Typography variant="h5" sx={{ color: "#1b9359", fontSize: "22px" }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};
Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};
export default Header;
