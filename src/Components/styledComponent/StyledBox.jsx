import Box from "@mui/material/Box";
import { styled } from "@mui/system";
const StyledBox = styled(Box)({
  display: "flex",
    justifyContent: {
    xxl:"flex-start",
    xl:"flex-start",
    lg:"flex-start",
    md:"flex-start",
    sm: "center",
    xs:"center"
    },
  flexDirection: "row",
  flexWrap: "wrap",

  alignItems: "center",
  color: "#000000",
});

export default StyledBox