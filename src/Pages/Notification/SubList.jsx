import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import {
  fetchObjHandler,
  toggleHandler,
} from "../../Slice/others/NotificationHandlerSlice";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

function SubList({
  MsgArray,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const { toggle, bell, nobj } = useSelector(
    (state) => state.NotificationHandler
  );
  return (
    <List dense>
      {MsgArray.map((item, index) => {
        const labelId = `checkbox-list-secondary-label-${item?.Notificationid}`;
        const isActive = nobj && nobj?.Notificationid == item?.Notificationid;
        return (
          <ListItem
            key={index}
            sx={{
              bgcolor: isActive ? "#F3FFF6" : "#ffffff",
              borderRadius: "25px",
              border: isActive ? 2 : 0,
              borderStyle: "solid",
              borderColor: isActive ? "#0CAC1F" : "#000000",
              mt: 0.5,
            }}
          >
            <ListItemButton
              onClick={() => {
                dispatch(fetchObjHandler(item));
                dispatch(toggleHandler(0));
                if (location.pathname !== "/executive/notifications") {
                  navigate("/executive/notifications");
                }
              }}
            >
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${index + 1}`}
                  src={`/static/images/avatar/${index + 1}.jpg`}
                />
              </ListItemAvatar>
              <ListItemText
                id={labelId}
                //primary={`Monroh Hashel ${value + 1}`}
                primary={
                  <React.Fragment>
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <Typography
                        sx={{ display: "inline-flex", textAlign: "start" }}
                      >
                        {item?.FromUserName}
                      </Typography>{" "}
                      <span>{(item?.createdAt).split("T")[0]}</span>
                    </Box>
                  </React.Fragment>
                }
                secondary={
                  <React.Fragment>
                    <Box display={"flex"} justifyContent={"space-between"}>
                      <span> {item?.Subject}</span>
                      {item?.seen === 0 ? (
                        <Typography sx={{ color: "#4FAF53" }}>
                          <NotificationsActiveIcon fontSize="small" />
                        </Typography>
                      ) : (
                        <span>seen</span>
                      )}
                    </Box>
                  </React.Fragment>
                }
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

export default SubList;
