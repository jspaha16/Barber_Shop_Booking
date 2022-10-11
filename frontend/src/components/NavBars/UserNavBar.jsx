import React, { useContext } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  ListItem,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { UserContext } from "../../contexts/UserContext";
import { Link, useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";

const drawerWidth = 240;
const paths = {
  mg: [
    { link: "Appointments", path: "/appointment" },
    { link: "My Appointments", path: "/userAppointments" },
    { link: "Book Appointment", path: "/booking" },
    { link: "Profile Setup", path: "/profile" },
    { link: "Schedule Form", path: "/scheduleForm" },
    { link: "View / Cancel Barber's Appointment", path: "/viewcancelappointment" },
    { link: "Barbers", path: "/barbers" },
  ],
  bb: [
    { link: "Appointments", path: "/appointment" },
    { link: "My Appointments", path: "/userAppointments" },
    { link: "Profile Setup", path: "/profile" },
    { link: "Schedule Form", path: "/scheduleForm" },
  ],
  cs: [
    { link: "My Appointments", path: "/userAppointments" },
    { link: "Book Appointment", path: "/booking" },
    { link: "Profile Setup", path: "/profile" },
  ],
};

export default function NavBar({ children }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { logout } = useLogout();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    logout();
    setAnchorEl(null);
    navigate("/");
  };

  return (
    <Box>
      <AppBar
        position="fixed"
        className="nav"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            <Typography variant="h6" noWrap component="div">
              Power Rangers Barber Shop
            </Typography>
          </Box>
          <Typography variant="h6" component="div">
            {user.email}
          </Typography>
          <IconButton aria-label="user-icon" onClick={handleClick}>
            <AccountBoxIcon fontSize="large" />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box className="user-nav">
            <List>
              {paths[user.userType].map((text, index) => (
                <ListItem className="list" key={index}>
                  <CustomLink to={text.path}>{text.link}</CustomLink>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Box>
          <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
          <Box sx={{ p: 3 }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
