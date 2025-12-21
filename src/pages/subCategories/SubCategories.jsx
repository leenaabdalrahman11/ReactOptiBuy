import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "../../api/AxiosInstance";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination } from "swiper/modules";

import styles from "./SubCategories.module.css";

import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  const products = data?.products || [];

  return (
    <Box sx={{ padding: "20px", mt: 4,display:"flex", flexDirection:"column", gap:"20px",justifyContent:"center", alignItems:"center" }}>
      Look what we have in this SubCategory!
<Swiper
  spaceBetween={20}
  centerInsufficientSlides={true}
  pagination={{ clickable: true }}
  loop={true}
  modules={[Pagination]}
  breakpoints={{
    0: { slidesPerView: 1 },
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  }}

  className={styles.swiperContainer}
>
  {products.map((prod, index) => (
    <SwiperSlide key={prod?._id || index}>
      <Card className={styles.productCard}>
        <img
          alt={prod?.name || "product"}
          src={prod?.mainImage?.secure_url || ""}
        />
        <Typography variant="body1">{prod?.name}</Typography>
      </Card>
    </SwiperSlide>
  ))}
</Swiper>
    </Box>


  );
}
