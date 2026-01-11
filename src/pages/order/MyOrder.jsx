import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import AxiosUserInstance from "../../api/AxiosUserInstance";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,

  Divider,
  Stack,
  Button
} from "@mui/material";

export default function MyOrders() {
  const fetchUserOrders = async () => {
    const { data } = await AxiosUserInstance.get("/order");
    return data.orders || [];
  };

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userOrders"],
    queryFn: fetchUserOrders,
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

const confirmReceivedMutation = useMutation({
  mutationFn: async (orderId) => {
    const { data } = await AxiosUserInstance.patch(
      `/order/${orderId}/confirm-received`
    );
    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["userOrders"] });
  },
});


  if (isLoading)
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="error">Error: {error.message}</Typography>
      </Box>
    );

  if (!orders.length)
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          No orders yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          When you place an order, it will appear here.
        </Typography>
      </Box>
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "deliverd":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        My Orders
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Here you can see all your previous orders and their status.
      </Typography>

      <Stack spacing={2}>
        {orders.map((order) => (
          <Card
            key={order._id}
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow: 6,
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1,
                }}
              >
                <Box>
                  <Typography variant="h6">
                    Order #{order._id.slice(-6)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </Typography>
                </Box>

                <Chip
                  label={order.status}
                  color={getStatusColor(order.status)}
                  sx={{ textTransform: "capitalize" }}
                  size="small"
                />
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Shipping info
                  </Typography>
                  <Typography variant="body2">
                    <strong>Address:</strong> {order.address}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {order.phoneNumber}
                  </Typography>
                </Box>

                <Box textAlign={{ xs: "left", sm: "right" }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Order total
                  </Typography>
                  <Typography variant="h6">{order.finalPrice} $</Typography>
                  {order.couponName && (
                    <Typography variant="body2" color="text.secondary">
                      Coupon: {order.couponName}
                    </Typography>
                  )}
                </Box>
                {order.status === "deliverd" && (
  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
    <Button
      variant="contained"
      onClick={() => confirmReceivedMutation.mutate(order._id)}
      disabled={confirmReceivedMutation.isPending}
      sx={{ fontWeight: 800, textTransform: "none" }}
    >
      {confirmReceivedMutation.isPending ? "..." : "تم الاستلام"}
    </Button>
  </Box>
)}

              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Products
                </Typography>

                {order.products && order.products.length > 0 ? (
                  order.products.map((p, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 14,
                        color: "text.secondary",
                        mb: 0.5,
                      }}
                    >
                      <span>
                        • {p.productName} {p.quantity && `x ${p.quantity}`}
                      </span>
                      {p.finalPrice && <span>{p.finalPrice} $</span>}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No products found for this order.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
