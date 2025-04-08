import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Badge, Divider, Popover, Tooltip } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AppsIcon from "@mui/icons-material/Apps";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";

import Banga from "../../assets/BangaLogo3.png";
import SideBarImage from "../../assets/black.jpg";
import Nopic from "../../assets/user1.png";

import SubList from "../Notification/SubList";
import Loader from "../../Components/Global/loader";
import DynamicSideBarMenu from "./DynamicSideBarMenu";
import SingleIconButton from "../../Components/Global/SingleIconButton";

import useFetchNotification from "../../Apps/CustomHook/useFetchNotification";
import UseFetchLogger from "../../Apps/CustomHook/UseFetchLogger";

import {
  PagePermissionAccess,
} from "../../Slice/Page/PageAccessSlice";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  // const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [nobj, setNobj] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  var at = localStorage.getItem("AccessToken");
  //auth
  const { userInfo, global, AccessToken } = UseFetchLogger();

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const popoveropen = Boolean(anchorEl);
  const id = popoveropen ? "simple-popper" : undefined;

  const [anchorEl1, setAnchorEl1] = useState(null);

  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose1 = () => {
    setAnchorEl1(null);
  };
  const popoveropen1 = Boolean(anchorEl1);
  const id1 = popoveropen1 ? "shortcut-popper" : undefined;

  const { UnSeenMsg } = useFetchNotification();
  var [bool, setbool] = useState(true);

  const ShowMsg = () => {
    navigate("/executive/notifications", { state: { sms: nobj } });
  };

  const [menu, setMenu] = useState([]);
  const { isloading16, AccessID, isSuccess16 } =
    useSelector((state) => state.PageList);

  useEffect(() => {
    if (at !== undefined) {
      dispatch(PagePermissionAccess(global));
    }
  }, [AccessToken]);

  useEffect(() => {
    if (isSuccess16 && !isloading16) {
      setMenu(AccessID);
    }
  }, [isSuccess16]);

  var parray = JSON.parse(window.localStorage.getItem("loggerPermission"));
  var LeadPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Leads")[0];
  var CustPermission =
    parray && parray.filter((i) => i?.PageName == "Manage Customer")[0];
  var Collectionpermission =
    parray && parray.filter((i) => i?.PageName == "Manage Collections")[0];
  var notiPermi =
    parray && parray.filter((i) => i?.PageName == "Notification")[0];
  return (
    <>
      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundImage: "linear-gradient(to right ,#070f87, #0385ff)",
          color: "whitesmoke",
        }}
      >
        <Toolbar>
          <Box flexGrow={1} display={"flex"}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 1,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>

            <img
              src={Banga}
              height={"50vh"}
              width={"145vh"}
              alt={
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  color={"inherit"}
                >
                  BanagaSree Jewellers
                </Typography>
              }
              onError={(e) => {
                e.target.src = Nopic;
                e.target.width = 200;
                e.target.height = 200;
              }}
            />
          </Box>
          {userInfo?.details?.Utype !== 3 ? (
            <>
              <IconButton
                aria-describedby={id}
                aria-label="notification"
                color="inherit"
                onClick={handleClick1}
              >
                <Tooltip title="Short Cut">
                  <span>
                    <AppsIcon fontSize="medium" color="inherit" />
                  </span>
                </Tooltip>
              </IconButton>
              <Popover
                id={id1}
                open={popoveropen1}
                anchorEl={anchorEl1}
                onClose={handleClose1}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                sx={{
                  mr: 1,
                  padding: 1,
                }}
              >
                <Box
                  sx={{
                    color: "black",
                    height: "auto",
                    overflow: "hidden",
                    overflowY: "scroll",
                    border: "1px solid #ccc",
                    bgcolor: "#ffffff",
                    minWidth: "15vh",
                    p: 1,
                    ml: -2,
                  }}
                >
                  {LeadPermission?.Create == 1 ? (
                    <SingleIconButton
                      h1={"Add Lead"}
                      icon1={<PostAddIcon fontSize="medium" color="#2e2f30" />}
                      Tooltip1={"Add Lead"}
                      funcTrigger1={() => { navigate("/executive/addleads") }}
                    />
                  ) : null}
                  {CustPermission?.Create == 1 ? (
                    <SingleIconButton
                      h1={"Add Customer"}
                      icon1={
                        <PersonAddAlt1Icon fontSize="medium" color="#2e2f30" />
                      }
                      Tooltip1={"Add Customer"}
                      funcTrigger1={() => { navigate("/executive/customerregistration") }}
                    />
                  ) : null}
                  {Collectionpermission?.Create == 1 ? (
                    <SingleIconButton
                      h1={"Add Collection"}
                      icon1={
                        <CurrencyRupeeIcon fontSize="medium" color="#2e2f30" />
                      }
                      Tooltip1={"Add Collection"}
                      funcTrigger1={() => { navigate("/executive/collectionentry") }}
                    />
                  ) : null}
                  {Collectionpermission?.ViewPage == 1 ? (
                    <SingleIconButton
                      h1={"Manage Collection"}
                      icon1={
                        <ManageAccountsIcon fontSize="medium" color="#2e2f30" />
                      }
                      Tooltip1={"Manage Collection"}
                      funcTrigger1={() => { navigate("/executive/managecollections") }}
                    />
                  ) : null}
                  {LeadPermission?.ViewPage == 1 ? (
                    <SingleIconButton
                      Tooltip1={"Manage Leads"}
                      icon1={
                        <SettingsAccessibilityIcon
                          fontSize="medium"
                          color="#2e2f30"
                        />
                      }
                      h1={"Manage Leads"}
                      funcTrigger1={() => { navigate("/executive/manageleads") }}
                    />
                  ) : null}
                </Box>
              </Popover>
            </>
          ) : null}
          {notiPermi?.ViewPage == 1 ? (
            <>
              <IconButton
                aria-describedby={id}
                aria-label="notification"
                color="inherit"
                onClick={handleClick}
                sx={{mt:-1}}
              >
                <Tooltip title="Notification">
                  <span>
                    <Badge color="error" badgeContent={UnSeenMsg.length}>
                      <NotificationsIcon color="inherit" fontSize="medium" />
                    </Badge>
                  </span>
                </Tooltip>
              </IconButton>
              <Popover
                id={id}
                open={popoveropen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                sx={{
                  mr: 1,
                  padding: 1,
                }}
              >
                <Box
                  sx={{
                    color: "black",
                    height: UnSeenMsg.length !== 0 ? "70vh" : "8vh",
                    overflowY: "hidden",
                    border: "1px solid #ccc",
                    bgcolor: UnSeenMsg.length !== 0 ? "#E5E1DA" : "#ffffff",
                    minWidth: "15vh",
                    p: UnSeenMsg.length !== 0 ? 0.5 : 1,
                  }}
                >
                  {UnSeenMsg.length !== 0 ? (
                    <SubList
                      onclickEvent={ShowMsg}
                      bool={bool}
                      setbool={setbool}
                      setNobj={setNobj}
                      MsgArray={
                        UnSeenMsg.length !== 0 || UnSeenMsg.length !== undefined
                          ? UnSeenMsg
                          : []
                      }
                    />
                  ) : (
                    <Box sx={{ color: "#000000" }}>
                      <Typography>No Notification Found</Typography>
                    </Box>
                  )}
                </Box>
              </Popover>
            </>
          ) : null}
          <IconButton
            aria-label="Logout"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            color="inherit"
          >
            <Tooltip title="Log Out">
              <span>
                <LogoutIcon fontSize="medium" />
              </span>
            </Tooltip>
          </IconButton>
          <IconButton
            aria-label="notification"
            color="inherit"
            onClick={() => {
              navigate("/executive/profile");
            }}
          >
            <Tooltip title="Go To Profile">
              <span>
                <AccountCircleIcon />
              </span>
            </Tooltip>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          ml: -4,
          "& .MuiDrawer-paper": {
            backgroundImage: `linear-gradient(rgba(3, 111, 252, 0.5), rgba(3, 111, 252, 0.5)), url(${SideBarImage})`,
            color: "#ffffff",
            overflowY: "scroll",
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {open === true ? (
              <ChevronLeftIcon sx={{ color: "#ffffff" }} />
            ) : null}
          </IconButton>
        </DrawerHeader>
        {open ? (
          <Box>
            <Box mt={-6} sx={{justifyContent:"center",textAlign:"center"}}>
              <Typography variant="h5" color={"#ffffff"}>
                {userInfo?.details?.Utype === 1
                  ? "SuperUser"
                  : userInfo?.details?.Utype === 2
                  ? "Agent"
                  : "Customer"}
              </Typography>
            </Box>

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              ml={-2}
            >
              {global?.LoggerID ? (
                <img
                  alt="profile-user"
                  width="150px"
                  height="140px"
                  src={
                    userInfo?.details?.Utype === 1
                      ? `${
                          import.meta.env.VITE_IMAGEURL
                        }/Superuser/ProfilePhoto/${userInfo?.details?.Photo}`
                      : userInfo?.details?.Utype === 2
                      ? `${import.meta.env.VITE_IMAGEURL}/Agent/ProfilePhoto/${
                          userInfo?.details?.Photo
                        }`
                      : `${
                          import.meta.env.VITE_IMAGEURL
                        }/Customer/ProfilePhoto/${
                          userInfo?.details?.AplicantPhoto
                        }`
                  }
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                  onError={(e) => {
                    e.target.src = Nopic;
                  }}
                />
              ) : (
                <Box
                  height={"100%"}
                  width={"100%"}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Loader />
                </Box>
              )}
            </Box>
            <Box textAlign="center">
              <Typography variant="h6" fontWeight="bold" sx={{ ml: "-2px" }}>
                {userInfo?.details?.Utype === 1
                  ? userInfo?.details?.Name
                  : userInfo?.details?.Utype === 2
                  ? userInfo?.details?.Name
                  : userInfo?.details?.CustomerName}
              </Typography>
              <Typography variant="h6" color={"#e6f1ff"}>
                {userInfo?.details?.Utype === 1
                  ? `${userInfo?.details?.Designation}`
                  : userInfo?.details?.Utype === 2
                  ? `${userInfo?.details?.AgentCode}`
                  : null}
              </Typography>
            </Box>
          </Box>
        ) : (
          ""
        )}
        <Divider sx={{ bgcolor: "#ffffff" }} />
        {open && menu?.length == 0 ? (
          <Box
            height={"70%"}
            width={"100%"}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader />
          </Box>
        ) : (
          <DynamicSideBarMenu isOpen={open.toString()} Menu={menu} />
        )}
      </Drawer>
    </>
  );
}
