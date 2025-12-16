import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "../../api/AxiosInstance";

import { EffectCoverflow, Pagination } from "swiper/modules";
import { Box, Typography, CircularProgress } from "@mui/material";
import ProductCard from "./ProductCard";
import styles from "./Products.module.css";

export default function Products() {
  const fetchProducts = async () => {
    const { data } = await AxiosInstance.get("products/active");
    console.log("API raw response:", data.products);
    return data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <CircularProgress />;
  if (isError) return <p>error is {error.message}</p>;

  const products = data?.products || [];
  const count = products.length;

  return (
    <Box className={styles.wrapper}>
      <Typography variant="h5" component={"h2"} className={styles.title}>
        Products
      </Typography>

      <Box className={styles.swiperContainer}>
        {count < 4 ? (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",

              flexWrap: "wrap",
            }}
          >
            {products.map((product) => (
              <Box key={product._id || product.id} sx={{ maxWidth: 300 }}>
                <ProductCard product={product} />
              </Box>
            ))}
          </Box>
        ) : (
          <Swiper
            effect="coverflow"
            grabCursor
            loop={count > 3}
            slideToClickedSlide={count > 3}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            pagination
            modules={[EffectCoverflow, Pagination]}
            className={`mySwiper ${styles.productsSwiper}`}
            breakpoints={{
              0: { spaceBetween: 8 },
              600: { spaceBetween: 12 },
              900: { spaceBetween: 12, slidesPerView: 3 },
              1200: { spaceBetween: 24, slidesPerView: 3 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product._id || product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>
    </Box>
  );
}
