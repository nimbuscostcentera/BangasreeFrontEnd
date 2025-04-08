import { Box, Typography } from "@mui/material";

const StatBox = ({
  title,
  title2,
  subtitle,
  icon,
  stcolor,
  progress,
  increase,
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Box justifyContent="center" textAlign={"center"}>
        {/* <Box justifyContent="center" alignItems="center"> */}
        {icon}
        <Typography
          sx={{
            color: stcolor ? stcolor : "#374151",
            fontWeight: "bold",
          }}
        >
          {title}
        </Typography>
        {title2 ? (
          <Typography
            sx={{
              color: stcolor ? stcolor : "#374151",
            }}
          >
            {title2}
          </Typography>
        ) : null}
      </Box>

      <Box justifyContent="center" textAlign={"center"}>
        <Typography
          sx={{ color: stcolor ? stcolor : "#22c55e", fontSize: "18px" }}
        >
          {subtitle}
        </Typography>
        {/* <Typography variant="h6" fontStyle="italic" sx={{ color: "#4ade80" }}>
          {increase}
        </Typography> */}
      </Box>
    </Box>
  );
};

export default StatBox;
