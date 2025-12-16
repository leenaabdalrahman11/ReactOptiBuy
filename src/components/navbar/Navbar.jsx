import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { Link as RouterLink } from "react-router-dom";
import style from "./Navbar.module.css";

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const token = localStorage.getItem("userToken");

  let isAdmin = false;

  if (token) {
    const decoded = jwtDecode(token);
    isAdmin = decoded.role === "admin";
    console.log("Decoded JWT:", decoded);
  }

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const DrawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/">
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {isLoggedIn && isAdmin && (
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/dashboard">
              <ListItemText primary="Admin Dashboard" />
            </ListItemButton>
          </ListItem>
        )}

        {isLoggedIn && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/cart">
                <ListItemText primary="Cart" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/profile">
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/userOrder">
                <ListItemText primary="My Orders" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Log Out" />
              </ListItemButton>
            </ListItem>
          </>
        )}

        {!isLoggedIn && (
          <>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/login">
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/register">
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
      <Divider />
    </Box>
  );

  return (
    <>
      <Box sx={{ zIndex: 9999 }}>
        <AppBar
          position="sticky"
          sx={{ zIndex: 9999999 }}
          className={style.NavBar}
        >
          <Toolbar className={style.NavList}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography className={style.NavMenu} component="div">
              <RouterLink
                to="/"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Home
              </RouterLink>
            </Typography>

            <Box sx={{ marginLeft: "auto" }}>
              {isLoggedIn ? (
                <Button color="inherit" onClick={handleLogout}>
                  Log Out
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/login"
                    sx={{ mr: 1 }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/register"
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
}
