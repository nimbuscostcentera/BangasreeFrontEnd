import React from "react";
import { Box, Container } from "@mui/system";
import { styled } from "@mui/system";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
export const Typo = styled(Typography)({
  fontFamily: "Arvo, serif",
  fontSize: "30px",
  color: "grey",
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
});

export const SubPara = styled("p")({
  color: "grey",
  textAlign: "center",
});

export const Back = styled(Button)({
  color: "#fff",
  padding: "10px 20px",
  background: "#39ac31",
  boxShadow: " 1px 1px 1",
});

export const Contant_box = {
  marginTop: "-50px",
};

function PageNotFound() {
  const navigate = useNavigate();
  return (
    <Box m={5}>
      <Box
        sx={{
          backgroundImage:
            "url(https://cdn.dribbble.com/users/722246/screenshots/3066818/404-page.gif)",
          height: "350px",
          backgroundPosition: "center",
          justifyContent: "center",
        }}
      ></Box>

      <Typo>Look like you are lost</Typo>
      <SubPara>the page you are looking for not avaible!</SubPara>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Back
          onClick={() => {
            navigate("/");
          }}
        >
          go to home
        </Back>
      </Box>
    </Box>
  );
}

export default PageNotFound;
