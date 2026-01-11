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
  Divider,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL;


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
const [phoneError, setPhoneError] = useState("");
const handlePhoneChange = (e) => {
  const value = e.target.value.replace(/\D/g, ""); 

  if (value.length > 10) return;

  setPhoneNumber(value);

  if (value.length === 0) {
    setPhoneError("Phone number is required");
  } else if (value.length < 10) {
    setPhoneError("Phone number must be exactly 10 digits");
  } else {
    setPhoneError("");
  }
};

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
          Authorization: `Bearer ${currentToken}`,
          "x-session-id": currentSessionId,
        };
        const response = await axios.get(`${BACKEND_URL}/cart`, { headers });
        return response.data;
      }

      const response = await AxiosUserInstance.get("/cart");
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
        Authorization: `Bearer ${currentToken}`,
        "x-session-id": currentSessionId,
      };

      try {
        const response = await AxiosUserInstance.post("/order", payload);
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
  if (!/^\d{10}$/.test(phoneNumber)) {
    setPhoneError("Phone number must be exactly 10 digits");
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
  <Box
    sx={{
      minHeight: "100vh",
      background: "#f3f4f6",
      py: { xs: 3, md: 6 },
      px: 2,
    }}
  >
    <Box
      sx={{
        maxWidth: 1150,
        mx: "auto",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
        gap: { xs: 3, md: 5 },
        alignItems: "start",
      }}
    >
      <Box sx={{ pt: { xs: 1, md: 4 },display:"flex",flexDirection:"column",justifyContent:"center",flexWrap:"wrap",alignContent:"center",textAlign:"center",alignItems:"center" }}>
        <Typography
          sx={{
            fontSize: { xs: 44, md: 64 },
            fontWeight: 900,
            lineHeight: 1.02,
            letterSpacing: -1.5,
            color: "#111827",
          }}
        >
          Payment
          <br />
          Checkout
          <br />
          Design.
        </Typography>

        <Typography
          sx={{
            mt: 2,
            maxWidth: 380,
            fontSize: 16,
            lineHeight: 1.7,
            color: "#9ca3af",
          }}
        >
          A simple and responsive payment checkout experience designed in Figma.
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          background: "#fff",
          border: "1px solid #e5e7eb",
          boxShadow: "0 18px 50px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Typography sx={{ fontWeight: 900, fontSize: 13, mb: 1 }}>
            Order Summary
          </Typography>

          <Box
            sx={{
              borderRadius: 3,
              border: "1px solid #eef0f3",
              p: 1.5,
              mb: 2.2,
            }}
          >
            {cartData.products.map((item, index) => (
              <Box
                key={item.productId?._id || index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                  py: 1.2,
                  borderBottom:
                    index < cartData.products.length - 1
                      ? "1px solid #f1f5f9"
                      : "none",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                  <Box
                    component="img"
                    src={
                      item.productId?.mainImage?.secure_url ||
                      "https://via.placeholder.com/52"
                    }
                    alt={item.productId?.name}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      objectFit: "cover",
                      border: "1px solid #eef0f3",
                      background: "#f3f4f6",
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: 13,
                        color: "#111827",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 200,
                      }}
                    >
                      {item.productId?.name}
                    </Typography>
                    <Typography sx={{ color: "#6b7280", fontSize: 12 }}>
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

                <Typography sx={{ fontWeight: 900, fontSize: 13 }}>
                  $
                  {(
                    (item.productId?.priceAfterDiscount ||
                      item.productId?.price ||
                      0) * item.quantity
                  ).toFixed(2)}
                </Typography>
              </Box>
            ))}

            <Box sx={{ mt: 1.4, pt: 1.4, borderTop: "1px solid #eef0f3" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography sx={{ color: "#6b7280", fontWeight: 700, fontSize: 13 }}>
                  Subtotal
                </Typography>
                <Typography sx={{ fontWeight: 900, fontSize: 13 }}>
                  ${totalPrice.toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography sx={{ color: "#6b7280", fontWeight: 700, fontSize: 13 }}>
                  Shipping
                </Typography>
                <Typography sx={{ fontWeight: 900, fontSize: 13 }}>Free</Typography>
              </Box>

              <Box sx={{ height: 1, background: "#eef0f3", my: 1.2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
                  Total
                </Typography>
                <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
                  ${totalPrice.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography sx={{ fontWeight: 900, fontSize: 13, mb: 1 }}>
            Shipping Information
          </Typography>

          <Box sx={{ display: "grid", gap: 1.6 }}>
            <TextField
              label="Shipping Address *"
              variant="outlined"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              InputProps={{
                sx: {
                  borderRadius: 2,
                  background: "#fff",
                },
              }}
            />

<Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.6 }}>
  <TextField
    label="Phone Number *"
    variant="outlined"
    fullWidth
    value={phoneNumber}
    onChange={handlePhoneChange}
    required
    error={Boolean(phoneError)}
    helperText={phoneError || " "}
    inputProps={{
      inputMode: "numeric",
      pattern: "[0-9]*",
      maxLength: 10,
    }}
    InputProps={{ sx: { borderRadius: 2, background: "#fff" } }}
  />

  <TextField
    label="Coupon Code (Optional)"
    variant="outlined"
    fullWidth
    value={couponName}
    onChange={(e) => setCouponName(e.target.value)}
    InputProps={{ sx: { borderRadius: 2, background: "#fff" } }}
  />
</Box>

          </Box>

          {!isLoggedIn && (
            <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
              Guest users cannot place orders. Please login or create an account to
              complete your purchase.
            </Alert>
          )}

          {createOrderMutation.isError && isLoggedIn && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {createOrderMutation.error?.response?.data?.message ||
                createOrderMutation.error.message}
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSubmit}
            disabled={createOrderMutation.isPending || !isLoggedIn}
            sx={{
              mt: 2.4,
              py: 1.6,
              borderRadius: 2.5,
              fontWeight: 900,
              textTransform: "none",
              boxShadow: "none",
              backgroundColor:"#766c6cf5"
            }}
          >
            {createOrderMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Place Order - $${totalPrice.toFixed(2)}`
            )}
          </Button>

          <Dialog
            open={loginDialogOpen}
            onClose={() => setLoginDialogOpen(false)}
          >
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
        </CardContent>
      </Card>
    </Box>
  </Box>
);

}
