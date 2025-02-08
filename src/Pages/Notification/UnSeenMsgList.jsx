import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import useFetchNotification from "../../Apps/CustomHook/useFetchNotification";
import SubList from "./SubList";

function UnSeenMsgList({nobj,  setNobj, setToggle}) {

  const { UnSeenMsg } = useFetchNotification();
 
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
      {UnSeenMsg.length !== 0 || UnSeenMsg.length !== undefined ? (
        <SubList
          nobj={nobj}
          setToggle={setToggle}
          setNobj={setNobj}
          MsgArray={UnSeenMsg.length !== 0 || UnSeenMsg.length !== undefined ?UnSeenMsg:[]}
        />
      ) : null}
    </Box>
  );
}

export default UnSeenMsgList;
