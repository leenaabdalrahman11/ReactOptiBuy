import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import "swiper/css";
import "swiper/css/pagination";
import style from "./Review.module.css";
import { Mousewheel, Pagination, Autoplay } from "swiper/modules";
import AxiosInstance from "../../api/AxiosInstance";
import { Box, Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Review() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const fetchReviews = async () => {
    try {
      const response = await AxiosInstance.get("/reviews/latest");
      return response.data.reviews || [];
    } catch (err) {
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    }
  };

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["review"],
    queryFn: fetchReviews,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
  console.log("bbbbbbbbbb", data);

  return (
    <Box
      style={{
        height: "260px",
        width: "100%",
        maxWidth: "400px",
        margin: "40px auto",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h5"
        component={"h2"}
        sx={{
          fontSize: {
            xs: "0.95rem",
            sm: "1.1rem",
            md: "1.10rem",
          },
        }}
      >
        Comments
      </Typography>
      <Swiper
        direction="vertical"
        slidesPerView={1}
        spaceBetween={20}
        mousewheel={{
          forceToAxis: true,
          releaseOnEdges: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={false}
        modules={[Mousewheel, Pagination, Autoplay]}
        className={style.mySwiper}
        style={{ height: "100%", marginTop: "20px" }}
      >
        {data.map((rev) => (
          <SwiperSlide key={rev._id || rev.id}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
              <Box display={"flex"} sx={{ justifyContent: "space-between" }}>
                <Typography variant="span" fontWeight={200}>
                  {rev.createdBy?.userName} :
                </Typography>

                <Typography sx={{ color: "#f5b400", mb: 1 }}>
                  {"⭐".repeat(rev.rating)}
                </Typography>
              </Box>

              <Box
                height={"100px"}
                width={"100%"}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                  fontSize: "13px",
                  backgroundColor: "#844f70bf",
                  borderRadius: "12px",
                  mb: 2,
                  color: "text.secondary",
                }}
              >
                <Typography variant="body2">{rev.comment}</Typography>
              </Box>
              <Box>
                <Box
                  display={"flex"}
                  width={"90%"}
                  sx={{
                    px: 3,
                    justifyContent: "space-between",
                    alignContent: "space-between",
                  }}
                >
                  <span
                    onClick={() =>
                      navigate(`/product-details/${rev.productId?._id}`)
                    }
                    style={{
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.textDecoration = "none")
                    }
                  >
                    View Product Details
                  </span>

                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </Box>
              </Box>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
