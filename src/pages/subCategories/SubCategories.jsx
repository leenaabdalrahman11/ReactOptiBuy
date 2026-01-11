import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "../../api/AxiosInstance";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

import styles from "./SubCategories.module.css";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
} from "@mui/material";

export default function SubCategories() {
  const { id } = useParams();

  const fetchProductsBySubCategory = async () => {
    const { data } = await AxiosInstance.get(`/subcategory/${id}/products`);
    return data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["productsBySubCategory", id],
    queryFn: fetchProductsBySubCategory,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  if (isError) return <p>Error: {error?.message}</p>;

  const products = data?.products || [];

const heroImage =
  products[0]?.mainImage?.secure_url ||
  "";
  return (
    <Box className={styles.page}>
      <Box className={styles.hero}   sx={{
    backgroundImage: `url(${heroImage})`,
  }}>
        <Box className={styles.heroOverlay} />
        <Box className={styles.heroContent}>
          <Typography className={styles.heroTitle}>
            Look what we have in this SubCategory
          </Typography>
          <Typography className={styles.heroSubtitle}>
            Discover the best picks curated just for you.
          </Typography>
        </Box>
      </Box>

      <Box className={styles.sectionHeader}>
        <Box className={styles.pill}>POPULAR ITEMS</Box>
      </Box>

      <Box className={styles.sliderWrap}>
        {isLoading ? (
          <Box className={styles.skeletonRow}>
            {[1, 2, 3].map((n) => (
              <Box key={n} className={styles.skeletonCard}>
                <Skeleton variant="rounded" height={220} />
                <Box style={{ padding: 12 }}>
                  <Skeleton width="70%" />
                  <Skeleton width="40%" />
                </Box>
              </Box>
            ))}
          </Box>
        ) : products.length === 0 ? (
          <Typography className={styles.emptyText}>
            No products found in this subcategory.
          </Typography>
        ) : (
          <Swiper
            spaceBetween={18}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            breakpoints={{
              0: { slidesPerView: 1.05 },
              520: { slidesPerView: 1.4 },
              720: { slidesPerView: 2.1 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className={styles.swiper}
          >
            {products.map((prod, index) => (
              <SwiperSlide key={prod?._id || index}>
<SwiperSlide key={prod?._id || index}>
  <Link
    to={`/product-details/${prod?._id}`}
    className={styles.cardLink}
  >
    <Card className={styles.card} elevation={0}>
      <CardMedia
        component="img"
        className={styles.cardImage}
        image={prod?.mainImage?.secure_url || ""}
        alt={prod?.name || "product"}
        loading="lazy"
      />

      <CardContent className={styles.cardContent}>
        <Typography className={styles.cardTitle} noWrap>
          {prod?.name}
        </Typography>

        {prod?.price != null && (
          <Typography className={styles.cardPrice}>
            {prod.price} ₪
          </Typography>
        )}
      </CardContent>
    </Card>
  </Link>
</SwiperSlide>

              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>
    </Box>
  );
}
