import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { useTranslation } from "react-i18next";
import i18n from "i18next";

import style from "./Navbar.module.css";
import Search from "../search/Search.jsx";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher.jsx";

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const { t } = useTranslation();
  const isRtl = i18n.language === "ar";

  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [hideNavActions, setHideNavActions] = React.useState(false);
  const [hideOnScroll, setHideOnScroll] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  const token = localStorage.getItem("userToken");
  let isAdmin = false;

  if (token) {
    const decoded = jwtDecode(token);
    isAdmin = decoded.role === "admin";
  }

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
    setHideNavActions(open);
  };

  const handleDrawerItemClick = () => {
    setDrawerOpen(false);
    setHideNavActions(false);
  };

const DrawerList = (
  <Box role="presentation" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <Box sx={{ px: 2.5, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Typography sx={{ fontWeight: 900, letterSpacing: 0.4 }}>
        {t("navbar.menu")}
      </Typography>


    </Box>

    <Divider sx={{ borderColor: "rgba(181, 181, 181, 0.94)" }} />

    <List sx={{ px: 1.2, pt: 1 }}>
      {[
        { to: "/", label: t("navbar.home") },
        { to: "/products-page", label: t("navbar.products") },
        { to: "/cart", label: t("navbar.cart") },
      ].map((item) => (
        <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={RouterLink}
            to={item.to}
            onClick={handleDrawerItemClick}
            sx={{
              borderRadius: 2,
              mx: 1,
              "&:hover": { backgroundColor: "rgba(217,122,43,0.16)" },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}

      {isLoggedIn && (
        <>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={RouterLink}
              to="/profile"
              onClick={handleDrawerItemClick}
              sx={{ borderRadius: 2, mx: 1, "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" } }}
            >
              <ListItemText primary={t("navbar.profile")} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={RouterLink}
              to="/userOrder"
              onClick={handleDrawerItemClick}
              sx={{ borderRadius: 2, mx: 1, "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" } }}
            >
              <ListItemText primary={t("navbar.myOrders")} />
            </ListItemButton>
          </ListItem>

          {isAdmin && (
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to="/dashboard"
                onClick={handleDrawerItemClick}
                sx={{ borderRadius: 2, mx: 1, "&:hover": { backgroundColor: "rgba(47,107,79,0.18)" } }}
              >
                <ListItemText primary={t("navbar.adminDashboard")} />
              </ListItemButton>
            </ListItem>
          )}
      <Box sx={{ transform: "scale(0.9)" }}>
        <LanguageSwitcher />
      </Box>
          <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.12)" }} />

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleLogout();
                handleDrawerItemClick();
              }}
              sx={{
                borderRadius: 2,
                mx: 1,
                backgroundColor: "rgba(217,122,43,0.12)",
                "&:hover": { backgroundColor: "rgba(217,122,43,0.22)" },
              }}
            >
              <ListItemText primary={t("navbar.logout")} />
            </ListItemButton>
            
          </ListItem>
        </>
      )}

      {!isLoggedIn && (
        <>
          <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.12)" }} />

          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={RouterLink}
              to="/login"
              onClick={handleDrawerItemClick}
              sx={{ borderRadius: 2, mx: 1, "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" } }}
            >
              <ListItemText primary={t("navbar.login")} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/register"
              onClick={handleDrawerItemClick}
              sx={{
                borderRadius: 2,
                mx: 1,
                backgroundColor: "rgba(217,122,43,0.18)",
                "&:hover": { backgroundColor: "rgba(217,122,43,0.26)" },
              }}
            >
              <ListItemText primary={t("navbar.register")} />
            </ListItemButton>
          </ListItem>
        </>
      )}
    </List>

    <Box sx={{ mt: "auto", px: 2.5, py: 2, opacity: 0.75, fontSize: 12 }}>
      © {new Date().getFullYear()} OptiBuy
    </Box>
  </Box>
);


  React.useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;

      setScrolled(currentY > 20);

      if (currentY > 80 && currentY > lastY) setHideOnScroll(true);
      else setHideOnScroll(false);

      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Box sx={{ zIndex: 9999 }}>
        <AppBar
        
          position="fixed"
          className={`${style.NavBar} ${hideOnScroll ? style.hideNav : ""} ${
            scrolled ? style.scrolled : ""
          }`}
          sx={{
            background: scrolled
              ? "rgba(15, 23, 42, 0.55)"
              : "rgba(15, 23, 42, 0.35)",
            backdropFilter: "blur(10px)",
             direction: "ltr",
            WebkitBackdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(255,255,255,0.10)",
            boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.20)" : "none",
            zIndex: 9999,
          }}
        >
          <Toolbar className={style.toolbar}>
            <Box className={style.left}>
              <IconButton
                edge="start"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                className={style.MenuIcon}
              >
                <MenuIcon />
              </IconButton>

              <Typography
                component={RouterLink}
                to="/"
                className={style.brand}
                sx={{ textDecoration: "none" }}
              >
                OptiBuy
              </Typography>
            </Box>

            {!hideNavActions && (
              <Box className={style.center}>
                <Box className={style.NavMenu}>
                  {isLoggedIn && (
                    <>
                      <RouterLink to="/" className={style.navLink}>
                        {t("navbar.home")}
                      </RouterLink>
                      <RouterLink to="/products-page" className={style.navLink}>
                        {t("navbar.products")}
                      </RouterLink>
                      <RouterLink to="/cart" className={style.navLink}>
                        {t("navbar.cart")}
                      </RouterLink>
                      <RouterLink to="/profile" className={style.navLink}>
                        {t("navbar.profile")}
                      </RouterLink>
                      <RouterLink to="/userOrder" className={style.navLink}>
                        {t("navbar.myOrders")}
                      </RouterLink>
                    </>
                  )}
                </Box>
              </Box>
            )}

            <Box className={style.searchWrap}>
              <Search />
            </Box>

            {!hideNavActions && (
              <Box className={style.right}>
                {isLoggedIn ? (
                  <Button onClick={handleLogout} className={style.ghostBtn}>
                    {t("navbar.logout")}
                  </Button>
                ) : (
                  <Box className={style.authBtns}>
                    <Button
                      component={RouterLink}
                      to="/login"
                      className={style.ghostBtn}
                    >
                      {t("navbar.login")}
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/register"
                      className={style.primaryBtn}
                    >
                      {t("navbar.register")}
                    </Button>
                  </Box>
                )}
              </Box>
            )}

          </Toolbar>
        </AppBar>
      </Box>

<Drawer
  anchor={isRtl ? "right" : "left"}
  open={drawerOpen}
  onClose={toggleDrawer(false)}
  PaperProps={{
    sx: {
      width: 300,
      background: "rgba(6, 9, 15, 0.72)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderRight: isRtl ? "none" : "1px solid rgba(255,255,255,0.10)",
      borderLeft: isRtl ? "1px solid rgba(255,255,255,0.10)" : "none",
      color: "#fff",
    },
  }}
>
  {DrawerList}
</Drawer>
    </>
  );
}
