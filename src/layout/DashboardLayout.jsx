import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { Box, Toolbar } from "@mui/material";
const drawerWidth = 260;
export default function DashboardLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar drawerWidth={drawerWidth} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Topbar />
        <Toolbar />
        <Box sx={{ }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
