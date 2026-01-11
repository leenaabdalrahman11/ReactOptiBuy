import React, { useMemo, useState } from "react";
import AxiosInstance from "../../api/AxiosInstance";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Snackbar } from "@mui/material";

import {
  Box,
  Card,
  CircularProgress,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative } from "swiper/modules";
import { Mousewheel, Autoplay } from "swiper/modules";
import style from "../reviews/Review.module.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import styles from "./ProductsDetails.module.css";
import { AddToCart } from "../cart/AddToCart";

export default function ProductsDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [formError, setFormError] = useState("");
  const [qty, setQty] = useState(1);
const [toast, setToast] = useState({
  open: false,
  msg: "",
  severity: "success",
});

const showToast = (msg, severity = "success") => {
  setToast({ open: true, msg, severity });
};

const closeToast = (_, reason) => {
  if (reason === "clickaway") return;
  setToast((t) => ({ ...t, open: false }));
};

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
    return Number(avg).toFixed(1);
  }, [reviews]);

  const fetchProductDetails = async () => {
    const { data } = await AxiosInstance.get(`products/${id}`);
    return data.products;
  };

  const { data: product, isLoading, isError, error } = useQuery({
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

const addToCartHandler = async () => {
  try {

    await AddToCart(product);

    queryClient.invalidateQueries(["cart"]);
    showToast("Added to cart ✅", "success");
  } catch (err) {
    showToast(
      err?.response?.data?.message || err?.message || "Failed to add to cart",
      "error"
    );
  }
};


  const maxQty = Math.max(1, Number(product?.stock || 1));
  const safeQty = Math.min(qty, maxQty);

  const oldPrice = product?.price;
  const newPrice = product?.priceAfterDiscount ?? product?.price;

  const stock = Number(product?.stock ?? 0);
  const stockCap = 20;
  const stockPct = Math.max(0, Math.min(100, (stock / stockCap) * 100));

  return (
    <Box className={styles.page}>
      <Snackbar
  open={toast.open}
  autoHideDuration={2200}
  onClose={closeToast}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
  sx={{ zIndex: (theme) => theme.zIndex.modal + 2000000000000000000 }}
>
  <Alert
    onClose={closeToast}
    severity={toast.severity}
    variant="filled"
    sx={{
      borderRadius: 2,
      fontWeight: 800,
      boxShadow: "0 12px 30px rgba(0,0,0,0.14)",
      minWidth: { xs: "92vw", sm: 420 },
    }}
  >
    {toast.msg}
  </Alert>
</Snackbar>

<Box
  className={styles.hero}
  sx={{
    backgroundImage: `url(${product?.mainImage?.secure_url || ""})`,
  }}
>
  <Box className={styles.heroOverlay} />
  <Box className={styles.heroContent}>

    {product?.brand && (
      <Typography className={styles.heroSub}>
        {product.brand}
      </Typography>
    )}
  </Box>
</Box>

      <Box className={styles.shell}>
        <Box className={styles.left}>
          <Box className={styles.imageStage}>
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
        </Box>

        <Box className={styles.right}>
          <Typography className={styles.title}>{product?.name}</Typography>

          <Typography className={styles.author}>
            {product?.brand || product?.createdBy?.userName || "—"}
          </Typography>

          <Box className={styles.priceRow}>
            {oldPrice && newPrice && oldPrice !== newPrice ? (
              <>
                <Typography className={styles.oldPrice}>${oldPrice}</Typography>
                <Typography className={styles.newPrice}>${newPrice}</Typography>
              </>
            ) : (
              <Typography className={styles.newPrice}>${newPrice}</Typography>
            )}
          </Box>

          <Box className={styles.stockBlock}>
            <Typography className={styles.stockText}>
              {stock > 0 ? `${stock} item left` : "Out of stock"}
            </Typography>
            <div className={styles.stockBar}>
              <div className={styles.stockFill} style={{ width: `${stockPct}%` }} />
            </div>
          </Box>

          <Divider className={styles.divider} />

          <Box className={styles.desc}>
            <Typography className={styles.descTitle}>Description</Typography>
            <Typography className={styles.descText}>
              {product?.description}
            </Typography>
          </Box>

          <Box className={styles.qtyCard}>
            <Typography className={styles.qtyLabel}>Quantity</Typography>

            <Box className={styles.qtyRow}>
              <IconButton
                size="small"
                className={styles.qtyBtn}
                onClick={() => setQty((p) => Math.max(1, p - 1))}
                disabled={safeQty <= 1}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>

              <Typography className={styles.qtyValue}>{safeQty}</Typography>

              <IconButton
                size="small"
                className={styles.qtyBtn}
                onClick={() => setQty((p) => Math.min(maxQty, p + 1))}
                disabled={safeQty >= maxQty}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography className={styles.qtyHint}>
              Maximum purchase: {maxQty}
            </Typography>

            <Button
              fullWidth
              variant="contained"
              className={styles.buyBtn}
              disabled={stock <= 0}
              onClick={addToCartHandler}
            >
              Buy Now
            </Button>

            <Box className={styles.actionsRow}>
              <Button
                variant="outlined"
                className={styles.actionBtn}
                disabled={stock <= 0}
                onClick={addToCartHandler}
              >
                Add To Cart
              </Button>

              <Button variant="outlined" className={styles.actionBtn}>
                Wishlist
              </Button>
            </Box>
          </Box>

          <Box className={styles.reviewSection}>
            <Typography className={styles.reviewTitle}>Add a comment</Typography>

            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}

            <form onSubmit={handleSubmitReview}>
              <Box className={styles.reviewForm}>
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
                  className={styles.sendBtn}
                  disabled={addReviewMutation.isPending}
                >
                  {addReviewMutation.isPending ? "Sending..." : "Send"}
                </Button>
              </Box>
            </form>

            {reviews.length > 0 && (
              <Box className={styles.commentsContainer}>
                <Box className={styles.commentsHead}>
                  <Typography className={styles.commentsTitle}>
                    Comments
                  </Typography>

                  {!isReviewsLoading && !isReviewsError && (
                    <Typography className={styles.avgWrap}>
                      {avgRating ? (
                        <>
                          <span className={styles.avgStars}>
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
                          </span>
                          <span className={styles.avgValue}>{avgRating}</span>
                        </>
                      ) : (
                        <span className={styles.noReviews}>No reviews yet</span>
                      )}
                    </Typography>
                  )}
                </Box>

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
                              sx={{ fontWeight: 700 }}
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
