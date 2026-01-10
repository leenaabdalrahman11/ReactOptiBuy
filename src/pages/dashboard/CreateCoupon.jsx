import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  MenuItem,
} from "@mui/material";

export default function CreateCoupon() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    amount: "",       
    type: "percent",  
    expireDate: "",  
    minOrder: "",     
    maxDiscount: "",  
    usageLimit: "",   
  });

  const accent = "#22d3ee";
  const bg = "#070B12";
  const panel = "rgba(15, 23, 42, 0.55)";
  const border = "rgba(148, 163, 184, 0.12)";

  const glassCardSx = {
    background: `linear-gradient(180deg, ${panel}, rgba(15,23,42,0.35))`,
    border: `1px solid ${border}`,
    borderRadius: 3,
    boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
    backdropFilter: "blur(10px)",
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgba(2,6,23,0.35)",
      color: "white",
      borderRadius: 2,
      "& fieldset": { borderColor: border },
      "&:hover fieldset": { borderColor: "rgba(34,211,238,0.4)" },
      "&.Mui-focused fieldset": { borderColor: accent },
    },
    "& .MuiInputLabel-root": { color: "rgba(226,232,240,0.7)" },
    "& .MuiInputLabel-root.Mui-focused": { color: accent },
    "& .MuiFormHelperText-root": { color: "rgba(226,232,240,0.65)" },
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name?.trim(),
        type: formData.type,
        amount: Number(formData.amount),
        expireDate: formData.expireDate, 
      };

      if (formData.minOrder !== "") payload.minOrder = Number(formData.minOrder);
      if (formData.maxDiscount !== "")
        payload.maxDiscount = Number(formData.maxDiscount);
      if (formData.usageLimit !== "")
        payload.usageLimit = Number(formData.usageLimit);

      await AxiosUserInstance.post("/coupon", payload);

      alert("Coupon created successfully!");
      navigate("/dashboard/coupons");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
        <CircularProgress sx={{ color: accent }} />
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        px: 3,
        py: 3,
        background: `
          radial-gradient(900px 500px at 20% 10%, rgba(34,211,238,0.12), transparent 60%),
          linear-gradient(180deg, ${bg}, #05070D)
        `,
        color: "white",
      }}
    >
      <Box maxWidth={800} mx="auto">
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
          Create Coupon
        </Typography>

        <Card sx={glassCardSx}>
          <CardContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Coupon Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                sx={fieldSx}
                margin="normal"
                placeholder="e.g. WINTER2026"
              />

              <TextField
                select
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                fullWidth
                sx={fieldSx}
                margin="normal"
                helperText="Percent: 10 means 10% | Fixed: 10 means $10 off (or your currency)"
              >
                <MenuItem value="percent">Percent</MenuItem>
                <MenuItem value="fixed">Fixed</MenuItem>
              </TextField>

              <TextField
                label={formData.type === "percent" ? "Discount (%)" : "Discount Amount"}
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                sx={fieldSx}
                margin="normal"
                inputProps={{
                  min: 0,
                  ...(formData.type === "percent" ? { max: 100 } : {}),
                }}
              />

              <TextField
                label="Expire Date"
                name="expireDate"
                type="date"
                value={formData.expireDate}
                onChange={handleChange}
                fullWidth
                sx={fieldSx}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                helperText="Choose the last valid date for this coupon"
              />

              <TextField
                label="Minimum Order (optional)"
                name="minOrder"
                type="number"
                value={formData.minOrder}
                onChange={handleChange}
                fullWidth
                sx={fieldSx}
                margin="normal"
                inputProps={{ min: 0 }}
              />

              {formData.type === "percent" && (
                <TextField
                  label="Max Discount (optional)"
                  name="maxDiscount"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={handleChange}
                  fullWidth
                  sx={fieldSx}
                  margin="normal"
                  inputProps={{ min: 0 }}
                  helperText="Recommended for percent coupons to cap the discount"
                />
              )}

              <TextField
                label="Usage Limit (optional)"
                name="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={handleChange}
                fullWidth
                sx={fieldSx}
                margin="normal"
                inputProps={{ min: 1 }}
                helperText="How many times this coupon can be used"
              />

              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  fontWeight: 800,
                  background: `linear-gradient(90deg, ${accent}, #6366f1)`,
                }}
              >
                Create Coupon
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
