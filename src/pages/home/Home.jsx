import { Box, Container, Typography } from "@mui/material";
import style from "./Home.module.css";
import React from "react";
import Categories from "../categories/Categories";
import Products from "../products/Products";
import Review from "../reviews/Review";
import FeaturedProducts from "../products/FeaturedProducts";
import Search from "../../components/search/Search";
export default function Home() {
  return (
    <>
      <div className={style.HeaderImage} >
                    <Search />
        
      </div>
      <Box py={2} textAlign="center" style={{ marginTop: "16px" }}>
        <Container maxWidth="lg">
          <Categories />
          <Box>
            <FeaturedProducts />
          </Box>
          <Box>
            <Products />
          </Box>
          <Review />
        </Container>
      </Box>
    </>
  );
}
