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

import styles from "./ProductCard.module.css";

function ProductCard({ product }) {
  const productId = product._id || product.id;

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
  });

  const avgRating = reviews.length
    ? (
        reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      ).toFixed(1)
    : null;
  const addToCartHandler = () => {
    addToCartService(product);
  };
  return (
    <Card className={styles.card}>
      <Link to={`/product-details/${productId}`}>
        <CardHeader
          title={
            <Box className={styles.headerTitleBox}>
              <Typography variant="body1" className={styles.productName}>
                {product.name}
              </Typography>
              {product.discount > 0 && (
                <Box className={styles.discountBadge}>-{product.discount}%</Box>
              )}
            </Box>
          }
          subheader={product.createdAt?.slice(0, 10)}
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
        />
        <CardMedia
          component="img"
          height="194"
          image={product.mainImage.secure_url}
          alt={product.name}
        />
      </Link>

      <CardContent>
        <CardActions disableSpacing className={styles.cardActions}>
          <Typography variant="body2" color="text.secondary">
            <span className={styles.oldPrice}>${product.price}</span>
            <span className={styles.newPrice}>
              ${product.priceAfterDiscount}
            </span>
          </Typography>

          <Box className={styles.reviewsBox}>
            {isReviewsLoading && (
              <Typography variant="caption">Loading reviews...</Typography>
            )}
            {isReviewsError && (
              <Typography variant="caption" color="error">
                Error loading reviews
              </Typography>
            )}
            {!isReviewsLoading && !isReviewsError && (
              <>
                {avgRating ? (
                  <Typography variant="caption">
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
                    <span className={styles.avgRatingValue}>({avgRating})</span>
                  </Typography>
                ) : (
                  <Typography variant="caption">No reviews yet</Typography>
                )}
              </>
            )}

            <Button onClick={() => addToCartHandler(product)}>🛒</Button>
          </Box>
        </CardActions>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
