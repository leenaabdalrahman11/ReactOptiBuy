import React, { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "../../api/AxiosInstance";
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import styles from "./FeaturedProducts.module.css";

export default function FeaturedProducts() {
  const [isCentered, setIsCentered] = useState(false);
  const [title, setTitle] = useState("Seasonal Offers");

  const getSlidesPerView = (swiper) => {
    const spv = swiper?.params?.slidesPerView;
    return typeof spv === "number" ? spv : 1;
  };

  const updateCentering = (swiper) => {
    const spv = getSlidesPerView(swiper);
    const shouldCenter = products.length > 0 && products.length < spv;
    setIsCentered(shouldCenter);
  };
  const fetchFeatured = async () => {
    const { data } = await AxiosInstance.get("/products/featured");
    console.log("Featured products response:", data);
    return data.products || [];
  };
  const navigate = useNavigate();
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: fetchFeatured,
  });
  useEffect(() => {
    const saved = localStorage.getItem("season_title");
    if (saved) setTitle(saved);

    const onStorage = () => {
      const newVal = localStorage.getItem("season_title");
      if (newVal) setTitle(newVal);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography>Error loading featured products</Typography>;

  return (
    <Box className={styles.wrapper}>
<Typography
  variant="h5"
  component="h2"
  className={styles.title}
>
  {title}
</Typography>
      <Swiper
        modules={[Grid, Pagination, Autoplay]}
        pagination={{ clickable: true }}
        spaceBetween={24}
        loop={true}
        watchOverflow={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className={`${styles.mySwiper} ${isCentered ? styles.centered : ""}`}
        breakpoints={{
          0: { slidesPerView: 1, grid: { rows: 1 } },
          600: { slidesPerView: 2, grid: { rows: 1 } },
          900: { slidesPerView: 3, grid: { rows: 1 } },
          1200: { slidesPerView: 4, grid: { rows: 1 } },
        }}
        onInit={(swiper) => updateCentering(swiper)}
        onResize={(swiper) => updateCentering(swiper)}
        onBreakpoint={(swiper) => updateCentering(swiper)}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id} className={styles.slide}>
            <Card
  onClick={() => navigate(`/product-details/${product._id}`)}
  sx={{
    width: "100%",
    maxWidth: 280,
    height: 350,
    display: "flex",
    flexDirection: "column",
    borderRadius: "24px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    border: "1px solid rgba(207, 26, 17, 0.1)",
    cursor: "pointer",
    boxShadow: "0 8px 30px rgba(80, 20, 15, 0.08)",
    transition: "transform 0.35s ease, box-shadow 0.35s ease",
    "&:hover": {
      transform: "translateY(-10px)",
      boxShadow: "0 20px 45px rgba(207, 26, 17, 0.16)",
    },
    "&:hover img": {
      transform: "scale(1.06)",
    },
  }}
>
              <CardMedia
  component="img"
  sx={{
    width: "100%",
    height: 245,
    objectFit: "cover",
    display: "block",
    transition: "transform 0.5s ease",
  }}
  image={product.mainImage?.secure_url}
  alt={product.name}
/>

              <CardContent
  sx={{
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    p: 2,
  }}
>
                <Typography
  sx={{
    fontWeight: 700,
    color: "#2b2020",
    fontSize: "1rem",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  }}
>
  {product.name}
</Typography>

                <Typography
  sx={{
    mt: 1,
    fontWeight: 800,
    color: "#cf1a11",
    fontSize: "1.05rem",
  }}
>
  ${product.priceAfterDiscount ?? product.price}
</Typography>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
