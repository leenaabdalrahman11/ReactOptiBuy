import React from "react";
import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "../../api/AxiosInstance.jsx";
import { AddToCart as addToCartService } from "../cart/AddToCart.jsx";

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

import styles from "./ProductCard.module.css";

function ProductCard({ product, avgRatingNumber, reviewsCount }) {
  const productId = product._id || product.id;
  const queryClient = useQueryClient();

  const [toast, setToast] = React.useState({
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

  const shouldFetch = avgRatingNumber == null || reviewsCount == null;

  const fetchReviews = async () => {
    const { data } = await AxiosInstance.get(`/products/${productId}/reviews`);
    return data.reviews;
  };

  const {
    data: reviews = [],
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: fetchReviews,
    staleTime: 1000 * 60 * 5,
    enabled: shouldFetch,
  });

  const computedAvg =
    avgRatingNumber != null
      ? avgRatingNumber
      : reviews.length
      ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
        reviews.length
      : 0;

  const computedCount = reviewsCount != null ? reviewsCount : reviews.length;

  const avgRating = computedCount ? computedAvg.toFixed(1) : null;

  const addToCartHandler = async (p) => {
    try {
      await addToCartService(p);

      queryClient.invalidateQueries(["cart"]);

      showToast("Added to cart ✅", "success");
    } catch (err) {
      showToast(
        err?.response?.data?.message || err?.message || "Failed to add to cart",
        "error"
      );
    }
  };

  return (
    <Card className={styles.card} elevation={0}>
      <Snackbar
        open={toast.open}
        autoHideDuration={2200}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 100 }}
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

      <Link to={`/product-details/${productId}`} className={styles.link}>
        <Box className={styles.mediaWrap}>
          <CardMedia
            component="img"
            height="210"
            image={product.mainImage.secure_url}
            alt={product.name}
            className={styles.media}
          />
          {product.discount > 0 && (
            <Box className={styles.discountBadge}>-{product.discount}%</Box>
          )}
        </Box>

        <CardHeader
          className={styles.header}
          title={
            <Typography className={styles.productName}>
              {product.name}
            </Typography>
          }
          subheader={
            <Typography className={styles.subheader}>
              {product.createdAt?.slice(0, 10)}
            </Typography>
          }
          action={
            <IconButton aria-label="settings" className={styles.moreBtn}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          }
        />
      </Link>

      <CardContent className={styles.content}>
        <CardActions disableSpacing className={styles.cardActions}>
          <Box className={styles.priceBox}>
            <Typography variant="body2" className={styles.oldPrice}>
              ${product.price}
            </Typography>
            <Typography variant="body1" className={styles.newPrice}>
              ${product.priceAfterDiscount}
            </Typography>
          </Box>

          <Box className={styles.rightSide}>
            <Box className={styles.reviewsBox}>
              {isReviewsLoading && (
                <Typography className={styles.metaText}>
                  Loading reviews...
                </Typography>
              )}

              {isReviewsError && (
                <Typography className={styles.errorText}>
                  Error loading reviews
                </Typography>
              )}

              {!isReviewsLoading && !isReviewsError && (
                <>
                  {avgRating ? (
                    <Box className={styles.ratingRow}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`${styles.ratingStar} ${
                            star <= Math.round(avgRatingNumber)
                              ? styles.ratingStarFilled
                              : styles.ratingStarEmpty
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className={styles.avgRatingValue}>{avgRating}</span>
                    </Box>
                  ) : (
                    <Typography className={styles.metaText}>
                      No reviews yet
                    </Typography>
                  )}
                </>
              )}
            </Box>

            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCartHandler(product);
              }}
              className={styles.cartBtn}
              variant="contained"
              disableElevation
            >
              🛒 Add
            </Button>
          </Box>
        </CardActions>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
