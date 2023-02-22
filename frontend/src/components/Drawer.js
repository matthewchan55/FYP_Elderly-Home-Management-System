// MUI compoenent
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DescriptionIcon from "@mui/icons-material/Description";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ElderlyIcon from "@mui/icons-material/Elderly";
import WorkIcon from "@mui/icons-material/Work";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Avatar, Button, ListSubheader } from "@mui/material";

// React import
import { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { useLogout } from "../hook/useLogout";
import { useAuthContext } from "../hook/useAuthContext";
import { Link } from "react-router-dom";

const drawerWidth = 300;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    //padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft({ main }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [managementOpen, setManagementOpen] = useState(false);
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleManagementOpen = () => {
    setManagementOpen(!managementOpen);
  };

  const handleLogoutClick = () => {
    logout();
  };

  //const handleAvatarOpen = () => {};

  return (
    // ** improvement: 1. Link to change to a component/ also each list item
    // 2. List item change to .map() https://codesandbox.io/s/s9rel2?file=/demo.js
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            //sx = css thing you want to write
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>

          <Link
            to="/home"
            style={{ color: "inherit", textDecoration: "inherit" }}
          >
            <Typography variant="h6" noWrap component="div">
              Elderly home management system
            </Typography>
          </Link>

          <Link
            to="/profile"
            style={{ color: "inherit", textDecoration: "inherit" }}
          >
            <Button sx={{ width: 300 }}>
              <Avatar src="/broken-image.jpg" sx={{ mr: 1 }}></Avatar>
              <Box sx={{ width: 200 }}>
                <Typography
                  color="white"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textTransform: "lowercase",
                  }}
                >
                  {user.account}
                </Typography>
                <Typography color="white">{user.userType}</Typography>
              </Box>
            </Button>
          </Link>

          <IconButton
            variant="contained"
            color="inherit"
            onClick={() => {
              handleLogoutClick();
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerOpen}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider />
        <List>
          <ListSubheader component="div">Common</ListSubheader>
          <Link
            to="/home"
            style={{ color: "inherit", textDecoration: "inherit" }}
          >
            <ListItem key={"Dashboard"} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary={"Dashboard"} />
              </ListItemButton>
            </ListItem>
          </Link>

          <ListItem
            key={"Management modules"}
            disablePadding
            onClick={handleManagementOpen}
          >
            <ListItemButton>
              <ListItemIcon>
                <Diversity3Icon />
              </ListItemIcon>
              <ListItemText primary={"Management modules"} />
              {managementOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          <Collapse in={managementOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link
                to="/management/staff"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ManageAccountsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Staff Management" />
                </ListItemButton>
              </Link>
              <Link
                to="/management/residents"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ElderlyIcon />
                  </ListItemIcon>
                  <ListItemText primary="Residents Management" />
                </ListItemButton>
              </Link>

              <Link
                to="/management/work"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Work Management" />
                </ListItemButton>
              </Link>

              <Link
                to="/management/finance"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  <ListItemText primary="Financial Management" />
                </ListItemButton>
              </Link>

              <Link
                to="/management/medication"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <VaccinesIcon />
                  </ListItemIcon>
                  <ListItemText primary="Medication Management" />
                </ListItemButton>
              </Link>

              <Link
                to="/management/activity"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <DirectionsRunIcon />
                  </ListItemIcon>
                  <ListItemText primary="Activity Management" />
                </ListItemButton>
              </Link>

              <Link
                to="/management/facility"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <RoomPreferencesIcon />
                  </ListItemIcon>
                  <ListItemText primary="Facility Management" />
                </ListItemButton>
              </Link>

              <Link
                to="/management/others"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <AddCircleOutlineIcon />
                  </ListItemIcon>
                  <ListItemText primary="Others" />
                </ListItemButton>
              </Link>
            </List>
          </Collapse>

          <ListItem key={"Planner"} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ScheduleIcon />
              </ListItemIcon>
              <ListItemText primary={"Planner"} />
            </ListItemButton>
          </ListItem>

          <ListItem key={"History and records"} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <WorkHistoryIcon />
              </ListItemIcon>
              <ListItemText primary={"History and records"} />
            </ListItemButton>
          </ListItem>

          <ListItem key={"Documents and reports"} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary={"Documents and reports"} />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />

        <List>
          <ListSubheader component="div">Others</ListSubheader>
          <ListItem key={"notification"} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <MarkUnreadChatAltIcon />
              </ListItemIcon>
              <ListItemText primary={"Notification"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Settings"} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={"Settings"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
        {main}
      </Main>
    </Box>
  );
}
