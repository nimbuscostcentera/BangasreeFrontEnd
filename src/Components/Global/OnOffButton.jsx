import React from "react";
import { Button, Box } from "@mui/material";
export default function OnOffButton({ yes, no, type1, type2, functrigger1, functrigger2,theme1,theme2 ,disabled1,disabled2}) {
  return (
    <Box sx={{ mt: 1, display: "flex", justifyContent: "space-around" }}>
      {yes ? (
        <>
          <Box mx={1}>
            <Button
              color={theme1}
              variant="contained"
              type={type1}
              disabled={disabled1}
              onClick={functrigger1}
            >
              {yes}
            </Button>
          </Box>
        </>
      ) : null}
      {no ? (
        <>
          {" "}
          <Box mx={1}>
            <Button
              color={theme2}
              variant="contained"
              type={type2}
              disabled={disabled2}
              onClick={functrigger2}
            >
              {no}
            </Button>
          </Box>
        </>
      ) : null}
    </Box>
  );
}
