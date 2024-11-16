import React from "react";
import CenterBox from "../styledComponent/CenterBox";
import { Typography } from "@mui/material";
function Card({ title1, title2, value ,color1,tc}) {
  return (
    <CenterBox
      sx={{
        p: 2,
        backgroundColor: `${color1}`,
        border: `1px solid ${color1}`,
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        borderRadius: 3,
        mx: 1,
        my: 2,
        minWidth: "8rem",
        color:`${tc}`,
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h6">{title1}</Typography>
      <Typography>{title2}</Typography>
      <text>{value}</text>
    </CenterBox>
  );
}

export default Card;
