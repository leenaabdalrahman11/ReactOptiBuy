import { Box, Container, Typography } from "@mui/material";
import style from "./Home.module.css";
import { jwtDecode } from "jwt-decode";

import React from "react";
import Categories from "../categories/Categories";
import Products from "../products/Products";
import Review from "../reviews/Review";
import FeaturedProducts from "../products/FeaturedProducts";
import Search from "../../components/search/Search";
import WhyChooseUs from "../../components/info/WhyChooseUs";
import PromoCollageSection from "../promoCollageSection/PromoCollageSection";
import ExperienceHighlightSection from "../../components/experienceHighlightSection/ExperienceHighlightSection";

import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  let userName = "";

  const token = localStorage.getItem("userToken");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userName = decoded.Name || decoded.userName || "";
    } catch (e) {
      userName = "";
    }
  }

  return (
    <>
      <div className={style.HeaderImage}>
        <Box
          className={style.welcomComponent}
          sx={{
            width: { xs: "92%", sm: "70%", md: "50%", lg: "40%" },
            px: { xs: 2, sm: 3 },
            py: { xs: 2.5, sm: 3 },
          }}
        >
          <Typography
            className={style.welcomeText}
            variant="h4"
            component="h1"
            sx={{
              fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
              lineHeight: 1.15,
              color:"white"
            }}
          >
            {userName
              ? t("home.welcomeUser", { name: userName })
              : t("home.welcome")}
          </Typography>

          <Typography
            component="p"
            sx={{
              mt: 1,
              opacity: 0.88,
              color: "white",
              fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" },
            }}
          >
            {t("home.subtitle")}
          </Typography>
        </Box>
      </div>

      <Box py={2} textAlign="center" style={{ marginTop: "16px" }}>
        <Container maxWidth="lg">
          <WhyChooseUs />

          <Box>
            <Categories />
          </Box>

          <Box>
            <FeaturedProducts />
          </Box>

          <Box>
            <Products />
          </Box>

          <Box>
            <ExperienceHighlightSection />
          </Box>

          <Box>
            <PromoCollageSection />
          </Box>

          <Review />
        </Container>
      </Box>
    </>
  );
}
