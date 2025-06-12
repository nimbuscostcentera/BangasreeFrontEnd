import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import Grid from "@mui/system/Unstable_Grid/Grid";
import {
  Button,
  OutlinedInput,
  Paper,
  TextField
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  SendNotification,
  ClearState45,
} from "../../Slice/Notification/SendNotificationSlice";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Reply() {
  const [FormObj, setFormObj] = useState({});
  const dispatch = useDispatch();
  const { nobj } = useSelector((state) => state.NotificationHandler);

  //auth
  const { userInfo,global } = UseFetchLogger();
  //notiobj params
 
  var notiobj = {
    ...global,
    senderid: userInfo?.details?.UserID,
    senderName: userInfo?.details?.UserName,
    TicketId: nobj?.TicketId,
    Subject: nobj?.Subject,
    reciversid: nobj?.FromUser,
  };
  const OnSubmitHandler = (e) => {
    e.preventDefault();
    var finalObj = {
      ...FormObj,
      ...notiobj,
    };
    dispatch(SendNotification(finalObj));
  };

  const OnChangeHandler = (e) => {
    var val = e.target.value;
    var key = e.target.name;
    setFormObj({ ...FormObj, [key]: val });
  };

  //Notification Send List
  const { isloading45, Resp45, error45, isError45, isSuccess45 } = useSelector(
    (state) => state.sendmsg
  );

  useEffect(() => {
    if (isSuccess45 && !isloading45) {
      toast.success(Resp45, { position: toast.POSITION.TOP_RIGHT });
    }
    if (isError45 && !isloading45) {
      toast.error(error45, { position: toast.POSITION.TOP_RIGHT });
    }
    dispatch(ClearState45());
    document.getElementById("replyform").reset();
  }, [isSuccess45, isloading45, isError45]);

  return (
    <Box
      id="replyform"
      component={"form"}
      encType="multipart/form-data"
      method="post"
      onSubmit={(e) => {
        OnSubmitHandler(e);
      }}
      onChange={OnChangeHandler}
    >
      <Grid container color={"#000000"} sx={{ pt: 2, m: 2 }}>
        <ToastContainer autoClose={5000} />
        <Grid
          item
          md={11}
          sm={11}
          xs={12}
          mx={2}
          display={"flex"}
          justifyContent={"fleax-start"}
        >
          <Paper
            sx={{
              elevation: 5,
              textAlign: "center",
              px: 1,
              height: "2rem",
              mt: 1.5,
            }}
          >
            To....
          </Paper>
          <OutlinedInput
            size="small"
            required
            value={nobj?.FromUserName}
            name="ReceiverName"
            fullWidth
            sx={{ m: 1, backgroundColor: "#ffffff" }}
          />
        </Grid>
        <Grid
          item
          md={11}
          sm={11}
          xs={12}
          mx={2}
          display={"flex"}
          justifyContent={"fleax-start"}
        >
          <Paper
            sx={{
              elevation: 5,
              textAlign: "center",
              px: 1,
              height: "2rem",
              mt: 1.5,
            }}
          >
            from....
          </Paper>
          <OutlinedInput
            size="small"
            fullWidth
            value={
              userInfo?.details?.Utype == 3
                ? userInfo?.details?.CustomerName
                : userInfo?.details?.Name
            }
            multiline={true}
            required
            name="FromUserName"
            sx={{ m: 1, backgroundColor: "#ffffff" }}
          />
        </Grid>
        <Grid
          md={11}
          sm={11}
          xs={12}
          mx={2}
          display={"flex"}
          justifyContent={"fleax-start"}
        >
          <Paper
            sx={{
              elevation: 5,
              textAlign: "center",
              px: 1,
              height: "2rem",
              mt: 1.5,
            }}
          >
            Subject
          </Paper>
          <OutlinedInput
            size="small"
            fullWidth
            multiline={true}
            value={nobj?.Subject}
            required
            name="Subject"
            sx={{ m: 1, backgroundColor: "#ffffff" }}
          />
        </Grid>
        <Grid item md={11} sm={11} xs={12} mx={2} mt={3}>
          <TextField
            label="Write Massege here"
            multiline
            fullWidth
            rows={8}
            name="Message"
            sx={{ backgroundColor: "#ffffff" }}
          />
        </Grid>
        <Grid
          item
          md={11}
          lg={11}
          sm={12}
          xs={12}
          mt={3}
          display={"flex"}
          justifyContent={"center"}
          alignContent={"center"}
        >
          <Button variant="contained" color="secondary" type="submit">
            Send
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reply;
