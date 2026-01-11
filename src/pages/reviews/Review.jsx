import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useQuery } from "@tanstack/react-query";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import AxiosInstance from "../../api/AxiosInstance";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useNavigate } from "react-router-dom";
import styles from "./Review.module.css";

import { useTranslation } from "react-i18next";

export default function Review() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const prevRef = React.useRef(null);
  const nextRef = React.useRef(null);

  const fetchReviews = async () => {
    const response = await AxiosInstance.get("/reviews/latest");
    return response.data.reviews || [];
  };

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["review-latest"],
    queryFn: fetchReviews,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  if (isLoading || !reviews.length) return null;

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      const locale = i18n.language === "ar" ? "ar" : "en";
      return new Date(iso).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <Box className={styles.wrap}>
      <Typography className={styles.kicker}>
        {t("reviews.kicker", "TESTIMONIALS")}
      </Typography>

      <Typography className={styles.title}>
        {t("reviews.title", "Our Client Reviews")}
      </Typography>

      <Box className={styles.sliderShell}>
        <IconButton
          ref={prevRef}
          className={`${styles.navBtn} ${styles.prev}`}
          aria-label="prev"
        >
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </IconButton>

        <IconButton
          ref={nextRef}
          className={`${styles.navBtn} ${styles.next}`}
          aria-label="next"
        >
          <ArrowForwardIosRoundedIcon fontSize="small" />
        </IconButton>

        <Swiper
          dir="ltr"
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 2800, disableOnInteraction: false }}
          spaceBetween={22}
          slidesPerView={1}
          breakpoints={{
            700: { slidesPerView: 2 },
            1050: { slidesPerView: 3 },
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          className={styles.swiper}
        >
          {reviews.map((rev) => {
            const id = rev._id || rev.id;
            const product = rev.productId;

            const bg =
              product?.mainImage?.secure_url ||
              product?.mainImage?.url ||
              product?.image?.secure_url ||
              product?.image?.url ||
              product?.images?.[0]?.secure_url ||
              product?.images?.[0]?.url ||
              "";

            const userName =
              rev.createdBy?.userName || t("common.anonymous", "Anonymous");
            const rating = Math.max(0, Math.min(5, Number(rev.rating || 0)));
            const comment = rev.comment || "";
            const productId = product?._id || product?.id;
            const roleText = product?.name ? product.name : t("reviews.customer", "Customer");

            return (
              <SwiperSlide key={id} className={styles.slide}>
                <Box className={styles.card}>
                  <Box
                    className={styles.bg}
                    style={{
                      backgroundImage: bg ? `url("${bg}")` : "none",
                      backgroundColor: bg ? "transparent" : "#f3f4f6",
                    }}
                  />
                  <Box className={styles.bgShade} />

                  <Box className={styles.overlay}>
                    <Box className={styles.avatarWrap}>
                      <Avatar className={styles.avatar}>
                        {userName?.[0]?.toUpperCase?.() || "U"}
                      </Avatar>
                    </Box>

                    <Typography className={styles.name}>{userName}</Typography>
                    <Typography className={styles.role}>{roleText}</Typography>

                    <Typography className={styles.comment}>{comment}</Typography>

                    <Typography className={styles.stars}>
                      {"★".repeat(rating)}
                      <span className={styles.starsEmpty}>
                        {"★".repeat(5 - rating)}
                      </span>
                    </Typography>

                    <Box className={styles.footer}>
                      <span
                        className={styles.link}
                        onClick={() =>
                          productId && navigate(`/product-details/${productId}`)
                        }
                      >
                        {t("reviews.viewProduct", "View Product Details")}
                      </span>

                      <span className={styles.date}>{formatDate(rev.createdAt)}</span>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>
    </Box>
  );
}
