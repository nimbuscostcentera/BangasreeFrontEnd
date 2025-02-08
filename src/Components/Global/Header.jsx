import { Typography, Box } from "@mui/material";
import { Container } from "@mui/system";

const Header = ({ title, subtitle }) => {
  return (
    <Box sx={{ display: "grid" }}>
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

export default Header;
