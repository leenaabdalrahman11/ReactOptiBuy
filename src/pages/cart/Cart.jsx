import React from "react";
import {
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router";
import AxiosSessionInstance from "../../api/AxiosSessionInstance";
export default function Cart() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const fetchCart = async () => {
    console.log("🛒 [fetchCart] via AxiosSessionInstance");
    const { data } = await AxiosSessionInstance.get("/cart");
    return data.products || [];
  };

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    retry: false,
  });

  const updateQty = async (id, type) => {
    const endpoint =
      type === "inc" ? `/cart/increase/${id}` : `/cart/decrease/${id}`;

    await AxiosSessionInstance.patch(endpoint);
    queryClient.invalidateQueries(["cart"]);
  };

  const deleteItem = async (id) => {
    await AxiosSessionInstance.delete(`/cart/${id}`);
    queryClient.invalidateQueries(["cart"]);
  };

  const clearAll = async () => {
    await AxiosSessionInstance.delete("/cart");
    queryClient.invalidateQueries(["cart"]);
  };

  if (isError) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Failed to load cart
        </Typography>
        <Typography sx={{ mb: 2, color: "gray" }}>
          {error?.response?.data?.message || error?.message || "Unknown error"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => queryClient.invalidateQueries(["cart"])}
        >
          Retry
        </Button>
        <Button sx={{ ml: 2 }} onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, textAlign: "center" }}>
        <Typography variant="h6">Your cart is empty</Typography>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  const totalItems = data.reduce((s, i) => s + i.quantity, 0);

  const totalPrice = data.reduce((sum, item) => {
    const price =
      item.productId?.priceAfterDiscount || item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    const token = localStorage.getItem("userToken");
    if (!token) return navigate("/login");
    return navigate("/order");
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", px: 2 }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 700, textAlign: "center" }}
      >
        My Cart ({totalItems} items)
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ fontWeight: 600 }}>
          Total: ${totalPrice.toFixed(2)}
        </Typography>
        <Button color="error" variant="outlined" onClick={clearAll}>
          Clear All
        </Button>
      </Box>

      <List sx={{ background: "#f7f8fa", borderRadius: 3, p: 1 }}>
        {data.map((item) => (
          <ListItem
            key={item.productId?._id}
            sx={{
              my: 1,
              background: "#fff",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <ListItemText
              primary={item.productId?.name}
              secondary={`Qty: ${item.quantity}`}
            />

            <Button onClick={() => updateQty(item.productId?._id, "dec")}>
              −
            </Button>
            <Button onClick={() => updateQty(item.productId?._id, "inc")}>
              +
            </Button>

            <IconButton onClick={() => deleteItem(item.productId?._id)}>
              <DeleteOutlineIcon color="error" />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Button
        fullWidth
        sx={{ mt: 3 }}
        variant="contained"
        onClick={handleCheckout}
      >
        Proceed to Checkout
      </Button>
    </Box>
  );
}
