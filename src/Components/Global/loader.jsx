import React from 'react';
import { styled } from "@mui/system";

const Spinner = styled("div")(({ bgColor }) => ({
  margin:"auto",
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  background: `radial-gradient(farthest-side,${bgColor} 94%,#0000) top/9px 9px no-repeat, conic-gradient(#0000 30%,${bgColor})`,
  WebkitMask: "radial-gradient(farthest-side,#0000 calc(100% - 9px),#000 0)",
  animation: "spinner-c7wet2 1s infinite linear",
  "@keyframes spinner-c7wet2": {
    "100%": {
      transform: "rotate(1turn)",
    },
  },
}));

function Loader({SpinnerColor="#fdfdff"}) {
  return <Spinner bgColor={SpinnerColor}></Spinner>;
}

export default Loader