import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import ViewCarouselRoundedIcon from "@mui/icons-material/ViewCarouselRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ drawerWidth = 260 }) {
  const location = useLocation();

  const mainItems = [
    { label: "Dashboard", to: "/dashboard", icon: <DashboardIcon /> },
    { label: "Home", to: "/home", icon: <StorefrontRoundedIcon /> },
    { label: "Users", to: "/dashboard/users", icon: <PeopleIcon /> },
    { label: "Coupon", to: "/dashboard/coupons", icon: <StorefrontRoundedIcon /> },
  ];

  const catalogItems = [
    { label: "Products", to: "/dashboard/products", icon: <Inventory2RoundedIcon /> },
    { label: "Categories", to: "/dashboard/categories", icon: <CategoryRoundedIcon /> },
    { label: "subCategories", to: "/dashboard/subcategory", icon: <CategoryRoundedIcon /> },
    { label: "Orders", to: "/dashboard/orders", icon: <ReceiptLongRoundedIcon /> },
  ];

  const marketingItems = [
    { label: "Experience Highlight", to: "/dashboard/home-section", icon: <ViewCarouselRoundedIcon /> },
    { label: "Home Tags", to: "/dashboard/tags", icon: <LocalOfferRoundedIcon /> },
    { label: "Promo Section", to: "/dashboard/promo-section/featured-collage", icon: <ShoppingCartIcon /> },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const colors = {
    paper: "rgb(15,19,27)",
    paper2: "#0b1220",
    border: "rgba(255,255,255,0.08)",
    text: "#e5e7eb",
    muted: "rgba(229,231,235,0.7)",
    hover: "rgba(255,255,255,0.06)",
    activeBg: "rgb(18,37,47)", 
    activeBorder: "rgba(245,158,11,0.35)",
    activeText: "#fbbf24",
    icon: "rgba(229,231,235,0.85)",
    activeIcon: "#fbbf24",
  };

  const W = { xs: 84, sm: 96, md: drawerWidth };
  const showText = { xs: "none", md: "block" };

  const SectionTitle = ({ children }) => (
    <Typography
      sx={{
        px: 2,
        pt: 1.5,
        pb: 0.7,
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: 0.8,
        textTransform: "uppercase",
        color: colors.muted,
        display: showText,
      }}
    >
      {children}
    </Typography>
  );

  const NavItem = ({ label, to, icon }) => {
    const active = isActive(to);

    const btn = (
      <ListItemButton
        component={Link}
        to={to}
        sx={{
          mx: 1.2,
          my: 0.5,
          borderRadius: 2.2,
          px: 1.2,
          py: 1.05,
          border: active ? `1px solid ${colors.activeBorder}` : `1px solid transparent`,
          backgroundColor: active ? colors.activeBg : "transparent",
          "&:hover": {
            backgroundColor: active ? colors.activeBg : colors.hover,
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 44,
            color: active ? colors.activeIcon : colors.icon,
            "& svg": { fontSize: 20 },
            justifyContent: "center",
          }}
        >
          {icon}
        </ListItemIcon>

        <ListItemText
          primary={label}
          sx={{
            display: showText,
            "& .MuiListItemText-primary": {
              fontSize: 13.5,
              fontWeight: active ? 900 : 750,
              color: active ? colors.activeText : colors.text,
            },
          }}
        />
      </ListItemButton>
    );

    return (
      <Box>
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <Tooltip title={label} placement="right" arrow>
            <Box>{btn}</Box>
          </Tooltip>
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" } }}>{btn}</Box>
      </Box>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: W,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: W,
          boxSizing: "border-box",
           backgroundColor: `${colors.paper} !important`,  
           color: colors.text,
          backgroundImage: "none",
          boxShadow: "none",
          borderRight: `1px solid ${colors.border}`,
          overflowX: "hidden",
        },
      }}
    >
      <Box
        sx={{
          px: 2,
          pt: 1.2,
          pb: 1.4,
          display: "flex",
          alignItems: "center",
          gap: 1.2,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            background:
              "linear-gradient(135deg, rgba(245,158,11,0.22), rgba(36, 104, 115, 0.14))",
            border: `1px solid ${colors.border}`,
          }}
        >
          <StorefrontRoundedIcon sx={{ color: colors.activeText }} />
        </Box>

        <Box sx={{ display: showText }}>
          <Typography sx={{ color: colors.text, fontWeight: 950, lineHeight: 1.1 }}>
            OptiBuy
          </Typography>
          <Typography sx={{ color: colors.muted, fontSize: 12 }}>
            Admin Panel
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: colors.border }} />

      <List sx={{ flex: 1, py: 1 }}>
        <SectionTitle>Main</SectionTitle>
        {mainItems.map((it) => (
          <NavItem key={it.to} {...it} />
        ))}

        <Divider sx={{ borderColor: colors.border, my: 1.2, mx: 1.4 }} />

        <SectionTitle>Catalog</SectionTitle>
        {catalogItems.map((it) => (
          <NavItem key={it.to} {...it} />
        ))}

        <Divider sx={{ borderColor: colors.border, my: 1.2, mx: 1.4 }} />

        <SectionTitle>Marketing</SectionTitle>
        {marketingItems.map((it) => (
          <NavItem key={it.to} {...it} />
        ))}
      </List>

      <Box
        sx={{
          px: 2,
          py: 1.4,
          borderTop: `1px solid ${colors.border}`,
          bgcolor: colors.paper2,
        }}
      >
        <Typography sx={{ fontSize: 11, color: colors.muted, display: showText }}>
          © {new Date().getFullYear()} EzMart
        </Typography>
      </Box>
    </Drawer>
  );
}
