import React, { useMemo, useState } from "react";
import AxiosInstance from "../../api/AxiosInstance";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Box,
  Card,
  CircularProgress,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative } from "swiper/modules";
import { Mousewheel, Autoplay } from "swiper/modules";
import style from "../reviews/Review.module.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import styles from "./ProductsDetails.module.css";

export default function ProductsDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [formError, setFormError] = useState("");

  const fetchReviews = async () => {
    const { data } = await AxiosInstance.get(`/products/${id}/reviews`);
    return data.reviews || [];
  };

  const {
    data: reviews = [],
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useQuery({
    queryKey: ["reviews", id],
    queryFn: fetchReviews,
  });

  const avgRating = useMemo(() => {
    if (!reviews?.length) return null;
    const avg =
      reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
    return avg.toFixed(1);
  }, [reviews]);

  const fetchProductDetails = async () => {
    const { data } = await AxiosInstance.get(`products/${id}`);
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

  const addReviewMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await AxiosUserInstance.post(
        `/products/${id}/reviews`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      setComment("");
      setRating(5);
      setFormError("");
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to add review";
      setFormError(msg);
    },
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setFormError("Please write a comment.");
      return;
    }
    if (rating < 1 || rating > 5) {
      setFormError("Rating must be between 1 and 5.");
      return;
    }

    addReviewMutation.mutate({ comment: comment.trim(), rating });
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <p>Error: {error.message}</p>;

  const StarsInput = () => (
    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
          style={{
            cursor: "pointer",
            fontSize: 20,
            lineHeight: 1,
            userSelect: "none",
          }}
          className={`${styles.reviewRatingStar} ${
            star <= rating
              ? styles.reviewRatingStarFilled
              : styles.reviewRatingStarEmpty
          }`}
          aria-label={`rate ${star}`}
        >
          ★
        </span>
      ))}
      <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
        {rating}/5
      </Typography>
    </Box>
  );

  return (
    <Box display="flex" alignItems="center" className={styles.wrapper}>
      <Box className={styles.subImages}>
        <Swiper
          grabCursor={true}
          effect="creative"
          centeredSlides={true}
          slidesPerView={"auto"}
          spaceBetween={20}
          creativeEffect={{
            prev: { shadow: false, translate: ["-20%", 0, -200] },
            next: { shadow: false, translate: ["20%", 0, -200] },
          }}
          modules={[EffectCreative]}
          className={`mySwiper ${styles.productSwiper}`}
        >
          {product?.subImages?.map((img) => (
            <SwiperSlide
              key={img._id || img.public_id}
              className={styles.productSlide}
            >
              <img
                src={img.secure_url}
                alt={product.name}
                className={styles.productImage}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      <Box className={styles.detailsContainer}>
        <Box>
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            className={styles.productTitle}
          >
            {product.name}
            <Typography variant="caption" className={styles.discountBadge}>
              -{product.discount}%
            </Typography>
          </Typography>
        </Box>

        <Box>
          <Typography
            component="p"
            variant="body1"
            className={styles.productShortDesc}
          >
            Explore our amazing {product.name} with premium quality and great
            design!
          </Typography>
        </Box>

        <Box>
          <Typography
            component="p"
            variant="body1"
            className={styles.productLongDesc}
          >
            {product.description}
          </Typography>
        </Box>

        {product.discount > 0 && (
          <Box className={styles.priceSection}>
            <Box className={styles.priceRow}>
              <Typography variant="body2" className={styles.oldPrice}>
                ${product.price}
              </Typography>
              <Typography variant="h6" className={styles.newPrice}>
                ${product.priceAfterDiscount}
              </Typography>
            </Box>

            {product.stock < 3 && (
              <Typography
                variant="body2"
                color="error"
                className={styles.lowStock}
              >
                Only {product.stock} left in stock!
              </Typography>
            )}

            {!isReviewsLoading && !isReviewsError && (
              <>
                {avgRating ? (
                  <Typography
                    variant="caption"
                    className={styles.avgRatingStars}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`${styles.ratingStar} ${
                          star <= avgRating
                            ? styles.ratingStarFilled
                            : styles.ratingStarEmpty
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className={styles.avgRatingValue}>{avgRating}</span>
                  </Typography>
                ) : (
                  <Typography variant="caption">No reviews yet</Typography>
                )}
              </>
            )}
          </Box>
        )}
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Add a comment
          </Typography>

          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <form onSubmit={handleSubmitReview}>
            <Box display="flex" flexDirection="column" maxWidth={400}>
              <TextField
                multiline
                minRows={2}
                size="small"
                label="Your comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                margin="dense"
              />

              <StarsInput />

              <Button
                type="submit"
                variant="contained"
                size="small"
                style={{ backgroundColor: "#844f70bf" }}
                sx={{ mt: 1 }}
                disabled={addReviewMutation.isPending}
              >
                {addReviewMutation.isPending ? "Sending..." : "Send"}
              </Button>
            </Box>
          </form>
        </Box>

        {reviews.length > 0 && (
          <Box className={styles.commentsContainer}>
            <Typography
              variant="h5"
              component={"h2"}
              className={styles.commentsTitle}
            >
              Comments
            </Typography>

            <Box className={styles.comments}>
              <Swiper
                direction="vertical"
                slidesPerView={1}
                spaceBetween={20}
                mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                style={{ background: "transparent" }}
                pagination={false}
                modules={[Mousewheel, Autoplay]}
                className={`${style.mySwiper} ${styles.reviewsSwiper}`}
              >
                {reviews.map((rev) => (
                  <SwiperSlide
                    key={rev._id || rev.id}
                    style={{ background: "transparent" }}
                  >
                    <Card className={styles.reviewCard}>
                      <Box className={styles.reviewHeader}>
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{ fontWeight: 500 }}
                        >
                          {rev.createdBy?.userName || "Anonymous"}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {rev.createdAt
                            ? new Date(rev.createdAt).toLocaleDateString()
                            : ""}
                        </Typography>
                      </Box>

                      <Box className={styles.reviewCommentBox}>
                        <Typography variant="body2">{rev.comment}</Typography>
                      </Box>

                      {rev.rating && (
                        <Box className={styles.reviewRatingRow}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`${styles.reviewRatingStar} ${
                                star <= rev.rating
                                  ? styles.reviewRatingStarFilled
                                  : styles.reviewRatingStarEmpty
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </Box>
                      )}
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </Box>
        )}
        <Box>
          <Button onClick={() => addToCartHandler(product)}>Add To Cart</Button>
        </Box>
      </Box>
    </Box>
  );
}
