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
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Snackbar, Alert } from "@mui/material";

import AxiosSessionInstance from "../../api/AxiosSessionInstance";
export default function Cart() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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

  const fetchCart = async () => {
    console.log("🛒 [fetchCart] via AxiosSessionInstance");
    const { data } = await AxiosSessionInstance.get("/cart");
    console.log("datttaaaaaaaaa",data);
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

  try {
    await AxiosSessionInstance.patch(endpoint);
    queryClient.invalidateQueries(["cart"]);
    showToast(type === "inc" ? "Quantity increased ✅" : "Quantity decreased ✅", "success");
  } catch (err) {
    showToast(err?.response?.data?.message || "Failed to update quantity", "error");
  }
};


const deleteItem = async (id) => {
  try {
    await AxiosSessionInstance.delete(`/cart/${id}`);
    queryClient.invalidateQueries(["cart"]);
    showToast("Item removed from cart 🗑️", "success");
  } catch (err) {
    showToast(err?.response?.data?.message || "Failed to remove item", "error");
  }
};


const clearAll = async () => {
  try {
    await AxiosSessionInstance.delete("/cart");
    queryClient.invalidateQueries(["cart"]);
    showToast("Cart cleared successfully ✅", "success");
  } catch (err) {
    showToast(err?.response?.data?.message || "Failed to clear cart", "error");
  }
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
        <Button sx={{ ml: 2 }} onClick={() => navigate("/home")}>
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
<Box
  sx={{
    maxWidth: 420,
    mx: "auto",
    mt: { xs: 6, md: 10 },
    px: 3,
    py: 4,
    textAlign: "center",
    borderRadius: 4,
    bgcolor: "background.paper",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  }}
>
  
  <Box
    sx={{
      width: 64,
      height: 64,
      mx: "auto",
      mb: 2,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "rgba(25, 118, 210, 0.1)",
    }}
  >
    
    <ShoppingCartOutlinedIcon sx={{ fontSize: 34, color: "primary.main" }} />
  </Box>

  <Typography variant="h6" sx={{ fontWeight: 800 }}>
    Your cart is empty
  </Typography>

  <Typography
    sx={{
      mt: 1,
      mb: 3,
      fontSize: 14,
      color: "text.secondary",
    }}
  >
    Looks like you haven’t added anything to your cart yet.
  </Typography>

  <Button
    variant="contained"
    size="large"
    onClick={() => navigate("/")}
    sx={{
      px: 4,
      borderRadius: 999,
      textTransform: "none",
      fontWeight: 700,
    }}
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
  <Box sx={{ maxWidth: 1100,mt:5, mx: "auto", px: 2, py: 3 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
      <Button
        onClick={() => navigate("/home")}
        sx={{
          textTransform: "none",
          color: "#111",
          fontWeight: 600,
          px: 0,
          zIndex:"99999999999999999999999999999",
          "&:hover": { background: "transparent" },
        }}
      >
        ← Shopping Continue
      </Button>
    </Box>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.6fr 0.9fr" },
        gap: 3,
        alignItems: "start",
      }}
    >
      
      <Box>
        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Shopping cart</Typography>
        <Typography sx={{ color: "#6b7280", mb: 2, fontSize: 13 }}>
          You have {totalItems} item in your cart
        </Typography>

        <List sx={{ p: 0, display: "flex", flexDirection: "column", gap: 1.6 }}>
          {data.map((item) => {
            const price =
              item.productId?.priceAfterDiscount || item.productId?.price || 0;

            return (
              <ListItem
                key={item.productId?._id}
                disableGutters
                sx={{
                  p: 1.2,
                  borderRadius: 2.5,
                  background: "#fff",
                  border: "1px solid #eef0f3",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
                  display: "grid",
                  gridTemplateColumns: "56px 1fr auto auto",
                  alignItems: "center",
                  gap: 1.4,
                }}
              >
                
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: "#f3f4f6",
                    overflow: "hidden",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  
                  <Box
                    component="img"
                    src={item.productId?.mainImage.secure_url || item.productId?.img || ""}
                    alt={item.productId?.name || "product"}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#111827",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.productId?.name}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      borderRadius: 2,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      display: "grid",
                      gridTemplateRows: "1fr 1fr 1fr",
                      overflow: "hidden",
                    }}
                  >
                    <Button
                      onClick={() => updateQty(item.productId?._id, "inc")}
                      sx={{
                        minWidth: 0,
                        p: 0,
                        height: 26,
                        fontSize: 16,
                        lineHeight: 1,
                        color: "#111",
                        "&:hover": { background: "#f3f4f6" },
                      }}
                    >
                      +
                    </Button>

                    <Box
                      sx={{
                        height: 26,
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#111827",
                        borderTop: "1px solid #e5e7eb",
                        borderBottom: "1px solid #e5e7eb",
                        background: "#fafafa",
                      }}
                    >
                      {item.quantity}
                    </Box>

                    <Button
                      onClick={() => updateQty(item.productId?._id, "dec")}
                      sx={{
                        minWidth: 0,
                        p: 0,
                        height: 26,
                        fontSize: 18,
                        lineHeight: 1,
                        color: "#111",
                        "&:hover": { background: "#f3f4f6" },
                      }}
                    >
                      −
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: "#111827",
                      fontSize: 13,
                      minWidth: 70,
                      textAlign: "right",
                    }}
                  >
                    ${price.toFixed(2)}
                  </Typography>

                  <IconButton
                    onClick={() => deleteItem(item.productId?._id)}
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 2,
                      border: "1px solid #eef0f3",
                      background: "#fff",
                      "&:hover": { background: "#f9fafb" },
                    }}
                  >
                    <DeleteOutlineIcon sx={{ color: "#9ca3af" }} />
                  </IconButton>
                </Box>
              </ListItem>
            );
          })}
        </List>

        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
<Snackbar
  open={toast.open}
  autoHideDuration={2500}
  onClose={closeToast}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
  sx={{
    zIndex: (theme) => theme.zIndex.modal + 1000000,
  }}
>
  <Alert
    onClose={closeToast}
    severity={toast.severity}
    variant="filled"
    sx={{
      
      borderRadius: 2,
      fontWeight: 700,
      boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
      minWidth: { xs: "92vw", sm: 420 },
    }}
  >
    {toast.msg}
  </Alert>
</Snackbar>

          <Typography sx={{ fontWeight: 700, color: "#111827" }}>
            Total: ${totalPrice.toFixed(2)}
          </Typography>

          <Button
            color="error"
            variant="outlined"
            onClick={clearAll}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          borderRadius: 3,
          background: "#fff",
          border: "1px solid #eef0f3",
          boxShadow: "0 12px 28px rgba(0,0,0,0.05)",
          p: 2.2,
          position: { md: "sticky" },
          top: { md: 18 },
        }}
      >
        <Typography sx={{ fontWeight: 800, mb: 2 }}>Order Summary</Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
          <Row label="Order" value={`$${totalPrice.toFixed(2)}`} />
          <Box sx={{ height: 1, background: "#eef0f3", my: 0.6 }} />
          <Row label="Total" value={`$${(totalPrice).toFixed(2)}`} bold />
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={handleCheckout}
          sx={{
            mt: 2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 800,
            background: "#22c55e",
            "&:hover": { background: "#16a34a" },
          }}
        >
          Check Out
        </Button>
      </Box>
    </Box>
  </Box>
);

function Row({ label, value, bold }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography sx={{ color: "#6b7280", fontWeight: bold ? 800 : 600 }}>
        {label}
      </Typography>
      <Typography sx={{ color: "#111827", fontWeight: bold ? 900 : 700 }}>
        {value}
      </Typography>
    </Box>
  );
}

}
