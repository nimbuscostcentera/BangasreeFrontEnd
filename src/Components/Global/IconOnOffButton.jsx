import React from "react";
import { IconButton, Tooltip, Typography } from "@mui/material";
import StyledBox from "../styledComponent/StyledBox";
export default function IconOnOffButton({
  icon1,
  icon2,
  Tooltip1,
  Tooltip2,
  h1,
  h2,
  disable1,
  disable2,
  funcTrigger1,
  funcTrigger2,
  textcolor1,
  textcolor2,mt,mb
}) {
  return (
    <StyledBox mr={1} mt={mt||2} mb={0||mb}>
      {icon1 ? (
        <StyledBox>
          <Typography color={textcolor1}>{h1}</Typography>
          <Tooltip title={Tooltip1}>
            <span>
              <IconButton onClick={funcTrigger1} disabled={disable1}>
                {icon1}
              </IconButton>
            </span>
          </Tooltip>
        </StyledBox>
      ) : null}
      {icon2 ? (
        <StyledBox >
          <Typography color={textcolor2}>{h2}</Typography>
          <Tooltip title={Tooltip2}>
            <span>
              <IconButton onClick={funcTrigger2} disabled={disable2}>
                {icon2}
              </IconButton>
            </span>
          </Tooltip>
        </StyledBox>
      ) : null}
    </StyledBox>
  );
}
