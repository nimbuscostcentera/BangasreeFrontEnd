import React from "react";
import {
  Typography,
  Button
} from "@mui/material";
import StyledBox from "../styledComponent/StyledBox";
export default function SingleIconButton({
  icon1,
  h1,
  disable1,
  funcTrigger1,
  textcolor1,
  mt1,
  mb1
}) {
  return (
    <StyledBox mt={mt1} mb={mb1}>
      <Button
        variant="text"
        onClick={funcTrigger1}
        disabled={disable1}
        sx={{ width: 10 }}
      >
        {icon1}{" "}
      </Button>
      <Typography color={textcolor1 || "#2e2f30"} ml={-2}>
        {h1}
      </Typography>
    </StyledBox>
  );
}
