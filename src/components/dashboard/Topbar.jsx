import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  InputBase,
  Paper,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useQuery } from "@tanstack/react-query";
import AxiosUserInstance from "../../api/AxiosUserInstance";

export default function Topbar({ toggleSidebar, drawerWidth = 260 }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchProfile = async () => {
    const res = await AxiosUserInstance.get("/users/profile");
    return res.data;
  };

  const { data } = useQuery({
    queryKey: ["profile"], 
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5,
  });

  const user = data?.user;


  const avatarSrc =
    user?.image?.secure_url ||
    user?.image?.url ||
    user?.image ||
    "";

  const displayName = user?.userName || user?.name || "User";
  const displayRole = user?.role || "Admin";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,


        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },

        bgcolor: "#122730",
        color: "#e5e7eb",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64,display:"flex",justifyContent:"space-between" } }}>

        <IconButton
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 1, display: { sm: "none" }, color: "#e5e7eb" }}
        >
          <MenuIcon />
        </IconButton>

        <Typography sx={{ fontWeight: 900, fontSize: 18, mr: 2 }} noWrap>
          Dashboard
        </Typography>


        <Box sx={{ display: "flex", alignItems: "center", gap: 1.4, ml: 2}}>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              pl: 1,
              pr: 0.8,
              py: 0.6,
              borderRadius: 999,
              "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
            }}
          >
            <Avatar
              src={avatarSrc}
              alt={displayName}
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#22d3ee",
                color: "#020617",
                fontWeight: 900,
              }}
            >
              {!avatarSrc && displayName?.charAt(0)?.toUpperCase()}
            </Avatar>

            <Box sx={{ display: { xs: "none", sm: "block" }, lineHeight: 1.1 }}>
              <Typography sx={{ fontSize: 13.5, fontWeight: 900 }} noWrap>
                {displayName}
              </Typography>
              <Typography sx={{ fontSize: 11.5, opacity: 0.7 }} noWrap>
                {displayRole}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
