import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "http://localhost:3000";

const getSessionId = () => {
  let sid = localStorage.getItem("sessionId");
  if (!sid) {
    sid = "guest_" + Date.now() + "_" + Math.random().toString(36).substring(2);
    localStorage.setItem("sessionId", sid);
  }
  return sid;
};

export default function Order() {
  const navigate = useNavigate();

  const [couponName, setCouponName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const userToken = localStorage.getItem("userToken");
  const sessionId = localStorage.getItem("sessionId") || getSessionId();
  const isLoggedIn = !!userToken;

  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ["cartForOrder", userToken, sessionId],
    queryFn: async () => {
      const currentToken = localStorage.getItem("userToken");
      const currentSessionId =
        localStorage.getItem("sessionId") || getSessionId();

      if (currentToken) {
        const headers = {
          Authorization: `Leena ${currentToken}`,
          "x-session-id": currentSessionId,
        };
        const response = await axios.get(`${BACKEND_URL}/cart`, { headers });
        return response.data;
      }

      const response = await axios.get(`${BACKEND_URL}/cart`, {
        headers: { "x-session-id": currentSessionId },
      });
      return response.data;
    },
    retry: false,
    enabled: true,
  });

  useEffect(() => {
    if (isLoggedIn) refetchCart();
  }, [isLoggedIn, refetchCart]);

  const createOrderMutation = useMutation({
    mutationFn: async (payload) => {
      console.log("🛒 [createOrder] Starting...");

      const currentToken = localStorage.getItem("userToken");
      const currentSessionId =
        localStorage.getItem("sessionId") || getSessionId();

      if (!currentToken) {
        throw new Error(
          "Guest users cannot create orders. Please login first."
        );
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Leena ${currentToken}`,
        "x-session-id": currentSessionId,
      };

      try {
        const response = await axios.post(`${BACKEND_URL}/order`, payload, {
          headers,
        });
        return response.data;
      } catch (error) {
        console.error("❌ Order API error:");
        console.error("- Status:", error.response?.status);
        console.error("- Message:", error.response?.data?.message);
        console.error("- Full:", error.response?.data);
        throw error;
      }
    },
    onSuccess: () => {
      setOpenSnackbar(true);
      setTimeout(() => navigate("/cart"), 1500);
    },
    onError: (error) => {
      const msg = error.response?.data?.message || error.message;
      console.error("❌ Order creation failed:", msg);

      if (msg.includes("Guest users cannot")) {
        setLoginDialogOpen(true);
      }
    },
  });

  const handleSubmit = () => {
    if (!isLoggedIn) {
      setLoginDialogOpen(true);
      return;
    }

    if (!cartData || !cartData.products || cartData.products.length === 0) {
      alert("Your cart is empty! Add products first.");
      navigate("/cart");
      return;
    }

    if (!address.trim()) {
      alert("Please enter shipping address");
      return;
    }

    if (!phoneNumber.trim()) {
      alert("Please enter phone number");
      return;
    }

    createOrderMutation.mutate({
      couponName: couponName || "",
      address: address.trim(),
      phoneNumber: phoneNumber.trim(),
    });
  };

  const handleLoginRedirect = () => {
    if (cartData?.products?.length > 0) {
      localStorage.setItem(
        "pendingCart",
        JSON.stringify({
          products: cartData.products,
          couponName,
          address,
          phoneNumber,
        })
      );
    }

    navigate("/login", {
      state: {
        fromCheckout: true,
        message: "Please login to complete your order",
      },
    });
  };

  if (cartLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading cart...</Typography>
      </Box>
    );
  }

  if (cartError) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 3, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading cart:{" "}
          {cartError?.response?.data?.message || cartError.message}
        </Alert>
        <Button variant="contained" onClick={() => refetchCart()}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!cartData || !cartData.products || cartData.products.length === 0) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", p: 3, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Your cart is empty
        </Typography>
        <Typography sx={{ mb: 3, color: "text.secondary" }}>
          Add some products to your cart before placing an order.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
      </Box>
    );
  }

  const totalPrice =
    cartData.products.reduce((sum, item) => {
      const price =
        item.productId?.priceAfterDiscount || item.productId?.price || 0;
      return sum + price * item.quantity;
    }, 0) || 0;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Checkout
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6">
                {isLoggedIn
                  ? `👤 Welcome, ${localStorage.getItem("userName") || "User"}`
                  : "👤 Guest User"}
              </Typography>
              <Typography color="text.secondary">
                {isLoggedIn
                  ? "You can proceed with your order"
                  : "Please login to place your order"}
              </Typography>
            </Box>

            {!isLoggedIn && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleLoginRedirect}
              >
                Login / Register
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Order Summary
          </Typography>

          {cartData.products.map((item, index) => (
            <Box
              key={item.productId?._id || index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                pb: 2,
                borderBottom:
                  index < cartData.products.length - 1
                    ? "1px solid #eee"
                    : "none",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  component="img"
                  src={
                    item.productId?.mainImage?.secure_url ||
                    "https://via.placeholder.com/60"
                  }
                  alt={item.productId?.name}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    objectFit: "cover",
                    mr: 2,
                  }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    {item.productId?.name}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    $
                    {(
                      item.productId?.priceAfterDiscount ||
                      item.productId?.price ||
                      0
                    ).toFixed(2)}{" "}
                    × {item.quantity}
                  </Typography>
                </Box>
              </Box>

              <Typography sx={{ fontWeight: 600 }}>
                $
                {(
                  (item.productId?.priceAfterDiscount ||
                    item.productId?.price ||
                    0) * item.quantity
                ).toFixed(2)}
              </Typography>
            </Box>
          ))}

          <Box sx={{ mt: 3, pt: 2, borderTop: "2px solid #ddd" }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>Subtotal:</Typography>
              <Typography>${totalPrice.toFixed(2)}</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>Shipping:</Typography>
              <Typography>Free</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
                pt: 2,
                borderTop: "1px solid #ddd",
              }}
            >
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                ${totalPrice.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Shipping Information
          </Typography>

          <TextField
            label="Shipping Address *"
            variant="outlined"
            fullWidth
            margin="normal"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <TextField
            label="Phone Number *"
            variant="outlined"
            fullWidth
            margin="normal"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />

          <TextField
            label="Coupon Code (Optional)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={couponName}
            onChange={(e) => setCouponName(e.target.value)}
          />
        </CardContent>
      </Card>

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handleSubmit}
        disabled={createOrderMutation.isPending || !isLoggedIn}
        sx={{ py: 1.5, fontSize: "1.1rem" }}
      >
        {createOrderMutation.isPending ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          `Place Order - $${totalPrice.toFixed(2)}`
        )}
      </Button>

      {!isLoggedIn && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Guest users cannot place orders. Please login or create an account to
          complete your purchase.
        </Alert>
      )}

      {createOrderMutation.isError && isLoggedIn && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {createOrderMutation.error?.response?.data?.message ||
            createOrderMutation.error.message}
        </Alert>
      )}

      <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You need to login to place an order. Guest checkout is not
            available.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleLoginRedirect}
            variant="contained"
            color="primary"
          >
            Go to Login
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Order placed successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
