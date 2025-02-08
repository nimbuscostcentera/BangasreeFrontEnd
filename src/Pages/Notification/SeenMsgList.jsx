import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import SubList from "./SubList";
import useFetchNotification from "../../Apps/CustomHook/useFetchNotification";
function SeenMsgList({setNobj, setToggle,nobj }) {

  const { seen=[] } = useFetchNotification();
  return (
    <Box
      sx={{
        color: "black",
        height: "75vh",
        overflow: "hidden",
        overflowY: "scroll",
        border: "1px solid #ccc",
      }}
    >
      {seen.length !== 0 || seen.length !== undefined ? (
        <SubList
          setToggle={setToggle}
          setNobj={setNobj}
          MsgArray={seen || []}
          nobj={nobj}
        />
      ) : null}
    </Box>
  );
}

export default SeenMsgList;
