import React, { useEffect, useState } from "react";
import Grid from "@mui/system/Unstable_Grid/Grid";
import { Divider, IconButton, Paper, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  ReadNotification,
  ClearState46,
} from "../../Slice/Notification/ReadNotificationSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MsgShow() {
  const dispatch = useDispatch();
  const { nobj } = useSelector((state) => state.NotificationHandler);
  // //auth
  const { userInfo,global } = UseFetchLogger();
  //global variable
  var notiobj = {
    ...global,
    UserID:userInfo?.details?.UserID,
    senderName: userInfo?.details?.UserName,
    Notificationid: nobj?.Notificationid,
    read: 1,
  };

  useEffect(() => {
    if (typeof nobj === "object" && Object.keys(nobj).length !== 0) {
      dispatch(ReadNotification(notiobj));
    }
  }, [nobj]);

  return (
    <Paper sx={{ bgcolor: "#ffffff", ml: 2, mt: 2, p: 1, height: "30rem" }}>
      <Grid container>
        <Grid
          item
          md={12}
          ml={2}
          display={"flex"}
          justifyContent={"flex-start"}
        >
          <Typography variant="h6">Subject:</Typography>&nbsp;
          <Typography variant="h5">{nobj?.Subject}</Typography>
        </Grid>
        <Grid
          item
          md={12}
          mx={2}
          mt={1}
          display={"flex"}
          justifyContent={"fleax-start"}
        >
          <Typography> from:{nobj?.FromUserName}</Typography>
        </Grid>
        <Grid
          item
          md={12}
          mt={1}
          mx={2}
          display={"flex"}
          justifyContent={"fleax-start"}
        >
          <Typography> to: {nobj?.Receiver}</Typography>
        </Grid>
        <Grid item md={12} p={2}>
          <Divider />
          <Typography>{nobj?.Message}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default MsgShow;
