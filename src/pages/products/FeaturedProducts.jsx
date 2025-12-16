import React from "react";
import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "../../api/AxiosInstance";
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router";

export default function FeaturedProducts() {
  const fetchFeatured = async () => {
    const { data } = await AxiosInstance.get("/products/featured");
    console.log("Featured products response:", data);
    return data.products || [];
  };
  const navigate = useNavigate();
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: fetchFeatured,
  });

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography>Error loading featured products</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                height="220"
                image={product.mainImage?.secure_url}
                alt={product.name}
              />
              <CardContent>
                <Typography fontWeight={600}>{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ${product.priceAfterDiscount ?? product.price}
                </Typography>
                <span
                  onClick={() => navigate(`/product-details/${product._id}`)}
                  style={{
                    color: "#1976d2",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                >
                  View Product Details
                </span>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
