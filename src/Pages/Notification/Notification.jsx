import Grid from "@mui/material/Grid/Grid";
import MsgList from "./MsgList";
import MsgSend from "./MsgSend";
import ReplyMsg from "./Reply";
import MsgShow from "./MsgShow";
import Fab from "@mui/material/Fab";
import CreateIcon from "@mui/icons-material/Create";
import ReplyIcon from "@mui/icons-material/Reply";
import { Box } from "@mui/system";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleHandler,
} from "../../Slice/others/NotificationHandlerSlice";
function Notification() {
  const dispatch = useDispatch();

  const { toggle, nobj } = useSelector(
    (state) => state.NotificationHandler
  );
  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var notiPermi =
    parray && parray.filter((i) => i?.PageName == "Notification")[0];

  return (
    <Grid container maxWidth={"xl"}>
      <Grid
        item
        md={4.5}
        lg={4.5}
        sm={12}
        xs={12}
        sx={{ bgcolor: "#E5E1DA", mt: 1, p: 0.5 }}
      >
        <MsgList />
      </Grid>
      <Grid
        item
        md={7.5}
        lg={7.5}
        sm={12}
        xs={12}
        mt={3}
        sx={{ bgcolor: "#E5E1DA", border: "1px solid #cccccc" }}
      >
        {toggle == 0 ? (
          <MsgShow />
        ) : toggle == 1 ? (
          <ReplyMsg />
        ) : toggle == 2 ? (
          <MsgSend />
        ) : null}
        {notiPermi?.Create == 1 ? (
          <Box
            sx={{
              "& > :not(style)": { m: 1 },
              position: "fixed",
              right: 45,
              bottom: 20,
            }}
          >
            <Fab
              color="secondary"
              aria-label="Reply"
              variant="circular"
              disabled={Object?.keys(nobj).length == 0 ? true : false}
              onClick={() => {
                dispatch(toggleHandler(1));
                //setReply(true);
              }}
            >
              <Tooltip title="Reply">
                <span>
                  <ReplyIcon />
                </span>
              </Tooltip>
            </Fab>

            <Fab
              color="primary"
              aria-label="Create"
              variant="circular"
              onClick={() => {
                dispatch(toggleHandler(2));
              }}
            >
              <Tooltip title="Create New">
                <span>
                  <CreateIcon />
                </span>
              </Tooltip>
            </Fab>
          </Box>
        ) : null}
      </Grid>
    </Grid>
  );
}

export default Notification;
