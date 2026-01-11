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
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@mui/material";

export default function UserOrder() {
  const navigate = useNavigate();

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
const queryClient = useQueryClient();

const confirmReceivedMutation = useMutation({
  mutationFn: async (orderId) => {
    try {
      console.log("confirm order:", orderId);

      const res = await AxiosUserInstance.patch(
        `/order/${orderId}/confirm-received`
      );

      console.log("confirm response status:", res.status);
      console.log("confirm response data:", res.data);

      return res.data;
    } catch (err) {
      console.log("confirm error:", err?.response?.status);
      console.log("confirm error data:", err?.response?.data);
      throw err;
    }
  },
  onSuccess: () => {
    console.log("confirm SUCCESS ✅");
    queryClient.invalidateQueries({ queryKey: ["myOrders"] });
    alert("Receipt Confirmed ✅");
  },
  onError: (err) => {
    alert(err?.response?.data?.message || "Confirm failed");
  },
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
              role="button"
              tabIndex={0}
              onClick={() => {
                const pid = item.productId?._id;
                if (pid) navigate(`/product-details/${pid}`); 
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const pid = item.productId?._id;
                  if (pid) navigate(`/product-details/${pid}`);
                }
              }}
              sx={{
                cursor: "pointer",
                borderRadius: 2,
                p: 1,
                transition: "0.2s",
                "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
              }}
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

<Box display="flex" justifyContent="space-between" alignItems="center">
  <Typography fontWeight={700}>Total: ${order.finalPrice}</Typography>

{order.receivedByUser ? (
  <Typography sx={{ fontWeight: 800, color: "green" }}>
    Received ✅
  </Typography>
) : (
  order.status === "delivered" && (
    <Button
      variant="contained"
      onClick={(e) => {
        e.stopPropagation();
        confirmReceivedMutation.mutate(order._id);
      }}
      disabled={confirmReceivedMutation.isPending}
      sx={{ fontWeight: 800, textTransform: "none" }}
    >
      {confirmReceivedMutation.isPending ? "..." : "Confirm Received"}
    </Button>
  )
)}


</Box>

        </Card>
      ))}
    </Box>
  );
}
