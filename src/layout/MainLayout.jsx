import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { Container, Box } from "@mui/material";
export default function MainLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userToken")
  );
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "/home";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Box sx={{ flex: 1 }}>
        {isHome ? (
          <Outlet context={{ setIsLoggedIn }} />
        ) : (
          <Container maxWidth="lg">
            <Outlet context={{ setIsLoggedIn }} />
          </Container>
        )}
      </Box>

      <Footer />
    </Box>
  );
}
