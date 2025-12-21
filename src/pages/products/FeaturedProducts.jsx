import React, { useState } from "react";
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
import { Grid, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import styles from "./FeaturedProducts.module.css";

export default function FeaturedProducts() {
  const [isCentered, setIsCentered] = useState(false);
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

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography>Error loading featured products</Typography>;

  return (
    <Swiper
      modules={[Grid, Pagination]}
      pagination={{ clickable: true }}
      spaceBetween={24}
      watchOverflow={true}
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
            sx={{
              width: 300,
              height: 300,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardMedia
              component="img"
              sx={{
                flex: "0 0 80%",
                height: 0, 
                width: "100%",
                objectFit: "cover",
                display: "block",
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
              }}
            >
              <div>
                <Typography fontWeight={600}>{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ${product.priceAfterDiscount ?? product.price}
                </Typography>
              </div>

              <span
                onClick={() => navigate(`/product-details/${product._id}`)}
                style={{
                  color: "#844f70",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                View Product Details
              </span>
            </CardContent>
          </Card>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
