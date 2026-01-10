import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import DetailsNavbar from "../components/navbar/ProductDetailsNavbar";
import Footer from "../components/footer/Footer";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import { Container, Box } from "@mui/material";
export default function MainLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userToken")
  );
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "/home";
  const isProductDetails =
    matchPath("/product-details/:id", location.pathname) || 
    matchPath("/products-page", location.pathname) ||
    matchPath("/category-details/:id", location.pathname);
return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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
