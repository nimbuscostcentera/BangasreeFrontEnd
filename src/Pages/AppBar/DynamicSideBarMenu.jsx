import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Box, Tooltip } from "@mui/material";
import { useLocation } from "react-router-dom";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";
const DynamicSideBarMenu = ({ isOpen, Menu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Box>
      <List>
        {Menu.map((i) => {
          let isActive = location.pathname == i?.PageUrl;
          //console.log(isActive);
          return (
            <ListItem
              key={i?.PageId}
              disablePadding
              sx={{
                display: "block",
                backgroundColor: isActive ? "#E5F2FF" : "",
                borderRadius: isActive ? 2 : 0,
                color: isActive ? "black" : "white",
                m: 0.5,
                "&:hover": {
                  backgroundColor: "rgba(179, 198, 255, 0.5)",
                },
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: isOpen == "true" ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={() => {
                  navigate(`${i?.PageUrl}`);
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isOpen == "true" ? 1 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <Tooltip title={i?.PageName}>
                    <span>
                      <Icon
                        sx={{ color: isActive ? "black" : "white" }}
                        key={i?.PageId}
                      >
                        {i?.Icon}
                      </Icon>
                    </span>
                  </Tooltip>
                </ListItemIcon>
                <ListItemText
                  primary={i?.PageName}
                  sx={{ opacity: isOpen == "true" ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
DynamicSideBarMenu.propTypes = {
  isOpen: PropTypes.string.isRequired,
  Menu: PropTypes.array.isRequired,
};
export default DynamicSideBarMenu;
