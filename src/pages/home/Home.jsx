import { Box, Container, Typography } from "@mui/material";
import style from "./Home.module.css";
import React from "react";
import Categories from "../categories/Categories";
import Products from "../products/Products";

export default function Home() {
  return (
    <>
      <div className={style.HeaderImage}></div>
      <Box py={2} textAlign="center">
        <Container maxWidth="lg">
          <Categories />
          <Box>
            <Products />
          </Box>
        </Container>
      </Box>
    </>
  );
}
