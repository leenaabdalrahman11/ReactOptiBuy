import React from "react";
import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "../../api/AxiosInstance";

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom"; 

function ProductCard({ product }) {
  const productId = product._id || product.id;

  const fetchReviews = async () => {
    const { data } = await AxiosInstance.get(
      `/products/${productId}/reviews`
    );
    return data.reviews; 
  };

  const {
    data: reviews = [],
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: fetchReviews,
  });

  const avgRating =
    reviews && reviews.length
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : null;

  return (
    <Card
      sx={{
        backgroundColor: "#928b80",
        
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        transition: "0.3s",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
      }}
    >
      <Link to={`/product-details/${product._id || product.id}`}>
        <CardHeader
          title={
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={1}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: {
                    xs: "0.95rem",
                    sm: "1.1rem",
                    md: "1.25rem",
                  },
                }}
                variant="body1"
              >
                {product.name}
              </Typography>

              {product.discount > 0 && (
                <Box
                  sx={{
                    backgroundColor: "rgba(255,0,0,0.9)",
                    color: "#fff",
                    fontSize: "0.5rem",
                    fontWeight: "bold",
                    px: 1,
                    py: "2px",
                    borderRadius: "4px",
                  }}
                >
                  -{product.discount}%
                </Box>
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
        <CardActions
          disableSpacing
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="body2" color="text.secondary">
            <span
              style={{
                textDecoration: "line-through",
                marginRight: 8,
              }}
            >
              ${product.price}
            </span>
            <span style={{ fontWeight: 700, marginRight: 8 }}>
              ${product.priceAfterDiscount}
            </span>
          </Typography>

          <Box sx={{ textAlign: "right" }}>
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
        </CardActions>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
