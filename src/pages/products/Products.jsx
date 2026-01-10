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

import { useTranslation } from "react-i18next";

export default function Products() {
  const { t } = useTranslation();

  const fetchProducts = async () => {
    const { data } = await AxiosInstance.get("products/active");
    return data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  const products = data?.products || [];

  const fetchRatingsMap = async () => {
    const results = await Promise.all(
      products.map(async (p) => {
        const id = p._id || p.id;
        try {
          const { data } = await AxiosInstance.get(`/products/${id}/reviews`);
          const reviews = data.reviews || [];
          const avg =
            reviews.length > 0
              ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
                reviews.length
              : 0;
          return { id, avg, count: reviews.length };
        } catch {
          return { id, avg: 0, count: 0 };
        }
      })
    );

    return results.reduce((acc, cur) => {
      acc[cur.id] = { avg: cur.avg, count: cur.count };
      return acc;
    }, {});
  };

  const {
    data: ratingsMap = {},
    isLoading: isRatingsLoading,
    isError: isRatingsError,
  } = useQuery({
    queryKey: ["productsRatingsMap", products.map((p) => p._id || p.id)],
    queryFn: fetchRatingsMap,
    enabled: products.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <CircularProgress />;
  if (isError) return <p>{t("products.errorWithMessage", { message: error.message })}</p>;

  const filteredProducts = products.filter((p) => {
    const id = p._id || p.id;
    const avg = ratingsMap?.[id]?.avg ?? 0;
    return avg > 4;
  });

  const count = filteredProducts.length;

  return (
    <Box className={styles.wrapper}>
      <Typography variant="h5" component={"h2"} className={styles.title}>
        {t("products.bestSelling")}
      </Typography>

      {isRatingsLoading && (
        <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
          {t("products.loadingRatings")}
        </Typography>
      )}

      {isRatingsError && (
        <Typography variant="body2" color="error" sx={{ textAlign: "center", mt: 1 }}>
          {t("products.errorLoadingRatings")}
        </Typography>
      )}

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
            {filteredProducts.map((product) => {
              const id = product._id || product.id;
              return (
                <Box key={id} sx={{ maxWidth: 300 }}>
                  <ProductCard
                    product={product}
                    avgRatingNumber={ratingsMap?.[id]?.avg}
                    reviewsCount={ratingsMap?.[id]?.count}
                  />
                </Box>
              );
            })}
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
              0: { spaceBetween: 8, slidesPerView: 1 },
              600: { spaceBetween: 12, slidesPerView: 2 },
              900: { spaceBetween: 12, slidesPerView: 3 },
              1200: { spaceBetween: 24, slidesPerView: 3 },
            }}
          >
            {filteredProducts.map((product) => {
              const id = product._id || product.id;
              return (
                <SwiperSlide key={id}>
                  <ProductCard
                    product={product}
                    avgRatingNumber={ratingsMap?.[id]?.avg}
                    reviewsCount={ratingsMap?.[id]?.count}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </Box>
    </Box>
  );
}
