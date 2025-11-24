import React from "react";
import AxiosInstance from "../../api/AxiosInstance";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Box, CircularProgress, Typography } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

export default function ProductsDetails() {
  const { id } = useParams();
  const fetchReviews = async () => {
    const { data } = await AxiosInstance.get(`/products/${id}/reviews`);
    return data.reviews;
  };

  const {
    data: reviews = [],
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useQuery({
    queryKey: ["reviews", id],
    queryFn: fetchReviews,
  });

  const avgRating =
    reviews && reviews.length
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : null;

  const fetchProductDetails = async () => {
    const { data } = await AxiosInstance.get(`products/${id}`);
    console.log(data);
    return data.products;
  };

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: fetchProductDetails,
    staleTime: 1000 * 60 * 5,
  });
  if (isLoading) return <CircularProgress />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
      alignItems="center"
      py={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: 0.5,
          justifyContent: "space-around",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h3"
          gutterBottom
          sx={{
            display: "flex",
            width: 0.5,
            justifyContent: "space-around",
            alignContent: "space-around",
            alignItems: "center",
            mb: 3,
            bgcolor: "rgba(0,0,0,0.08)",
            borderRadius: 2,
          }}
        >
          {product.name}
          <Typography
            variant="caption"
            sx={{
              backgroundColor: "#FF1744",
              color: "#fff",
              borderRadius: "4px",
              px: 1,
              py: "2px",
              fontWeight: 700,
              display: "inline-block",
              mb: 0.5,
            }}
          >
            -{product.discount}%
          </Typography>
        </Typography>

        <Typography
          component="p"
          variant="body1"
          sx={{
            maxWidth: 600,
            mx: "auto",
            mb: 3,
            bgcolor: "rgba(0,0,0,0.08)",
            p: 2,
            borderRadius: 2,
          }}
        >
          Explore our amazing {product.name} with premium quality and great
          design!
        </Typography>
        <Typography
          component="p"
          variant="body1"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          {product.description}
        </Typography>

        {product.discount > 0 && (
          <Box
            textAlign="left"
            mb={1}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="body2"
                sx={{ textDecoration: "line-through", color: "text.secondary" }}
              >
                ${product.price}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ${product.priceAfterDiscount}
              </Typography>
            </Box>
            {product.stock < 3 && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 1, fontWeight: 500 }}
              >
                Only {product.stock} left in stock! 🔥
              </Typography>
            )}
            {!isReviewsLoading && !isReviewsError && (
              <>
                {avgRating ? (
                  <Typography variant="caption">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          color: star <= avgRating ? "#FFD700" : "#ccc",
                          fontSize: "1rem",
                          marginRight: "2px",
                        }}
                      >
                        ★
                      </span>
                    ))}
                    <span style={{ marginLeft: "4px" }}>({avgRating})</span>
                  </Typography>
                ) : (
                  <Typography variant="caption">No reviews yet</Typography>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
      <Box>
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          pagination
          modules={[EffectCoverflow, Pagination]}
          className="mySwiper"
          style={{ padding: "20px 0" }}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,

            slideShadows: false,
          }}
          breakpoints={{
            0: { spaceBetween: 8 },
            600: { spaceBetween: 12 },
            900: { spaceBetween: 16 },
            1200: { spaceBetween: 24 },
          }}
        >
          {product?.subImages?.map((img) => (
            <SwiperSlide
              key={img._id}
              style={{
                width: "min(70vw, 210px)",
                paddingBottom: "0.5rem",
                slideShadows: false,
              }}
            >
              <img
                src={img.secure_url}
                alt={product.name}
                style={{
                  display: "block",
                  width: "100%",
                  height: "clamp(250px, 30vw, 280px)",
                  objectFit: "cover",
                  borderRadius: 12,
                  slideShadows: false,
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
}
