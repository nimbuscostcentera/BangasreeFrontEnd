import { Typography, Box } from "@mui/material";

const Header = ({ title, subtitle }) => {
  return (
    <Box mb="10px">
      <Typography
        variant="h4"
        color={"#374151"}
        sx={{ fontWeight: "bold", fontSize: "26px" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" sx={{ color: "#1b9359", fontSize: "22px" }}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
