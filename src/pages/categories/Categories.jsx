import {
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import ButtonBase from "@mui/material/ButtonBase";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/virtual";
import { Link } from "react-router";
import AxiosInstance from "../../api/AxiosInstance";

import styles from "./Categories.module.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    const response = await AxiosInstance.get("categories/active");
    return response;
  };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });
  if (isError) return <p>error is {error.message}</p>;
  if (isLoading) return <CircularProgress />;
  console.log(data);

  return (
    <Box className={styles.wrapper}>
      <Typography variant="h5" component={"h2"} className={styles.title}>
        Categories
      </Typography>

      <Box className={styles.swiperContainer}>
        <Swiper
          modules={[Virtual, Autoplay]}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          spaceBetween={16}
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 },
            600: { slidesPerView: 3, spaceBetween: 15 },
            900: { slidesPerView: 5, spaceBetween: 18 },
            1200: { slidesPerView: 5, spaceBetween: 20 },
          }}
          className={styles.categoriesSwiper}
        >
          {data.data.categories.map((cat, index) => (
            <SwiperSlide key={cat._id} virtualIndex={index}>
              <Card elevation={0} className={styles.categoryCard}>
                <Link
                  to={`/category-details/${cat._id}`}
                  className={styles.categoryLink}
                >
                  <Avatar
                    className={styles.categoryAvatar}
                    alt={cat?.name || "category"}
                    src={cat?.image?.secure_url || ""}
                  />
                  <Typography variant="body1">{cat.name}</Typography>
                </Link>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
}
