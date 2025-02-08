import React from 'react';
import GenCer from "../../assets/GenCer.png";
import { Box } from '@mui/system';

function GenCertificateIcon({color}) {

  const themeSelection = (color) => {
    switch (color) {
      case "error":
        return {
          filter: "brightness(0) saturate(100%) invert(13%) sepia(72%) saturate(5590%) hue-rotate(3deg) brightness(97%) contrast(125%)"};
      case "success":
        return {
          filter:"brightness(0) saturate(100%) invert(35%) sepia(92%) saturate(5625%) hue-rotate(138deg) brightness(96%) contrast(101%)",
        };
      case "disabled":
        return {
          filter:"brightness(0) saturate(100%) invert(56%) sepia(37%) saturate(0%) hue-rotate(291deg) brightness(105%) contrast(89%)"};
      default:
        return {
          filter: "brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(7470%) hue-rotate(279deg) brightness(101%) contrast(107%)"};
    }
  };

  const theme = themeSelection(color);
  return (
    <>
      <img src={GenCer} width={"70%"} style={theme} />
    </>
  );
}

export default GenCertificateIcon