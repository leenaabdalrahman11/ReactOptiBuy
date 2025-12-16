import React from "react";
import { useQuery } from "@tanstack/react-query";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  Divider,
} from "@mui/material";

export default function UserOrder() {
  const fetchOrders = async () => {
    const { data } = await AxiosUserInstance.get("/order");
    console.log("User orders response:", data);
    return data.orders;
  };

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["myOrders"],
    queryFn: fetchOrders,
  });

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">{error.message}</Typography>;

  if (orders.length === 0) {
    return <Typography>No orders yet</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {orders.map((order) => (
        <Card key={order._id} sx={{ mb: 3, p: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={600}>
              Order #{order._id.slice(-6)}
            </Typography>
            <Typography color="primary">{order.status}</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {new Date(order.createdAt).toLocaleDateString()}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {order.products.map((item) => (
            <Box
              key={item._id}
              display="flex"
              gap={2}
              alignItems="center"
              mb={2}
            >
              <img
                src={item.productId?.mainImage?.secure_url}
                alt={item.productId?.name}
                width={70}
                style={{ borderRadius: 8 }}
              />

              <Box flex={1}>
                <Typography fontWeight={500}>{item.productId?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {item.quantity}
                </Typography>
              </Box>

              <Typography fontWeight={600}>
                ${item.productId?.priceAfterDiscount ?? item.productId?.price}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="flex-end">
            <Typography fontWeight={700}>Total: ${order.finalPrice}</Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
