import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

export default function CreateSubcategory() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const categoryIdFromQuery = searchParams.get("categoryId") || "";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: categoryIdFromQuery,
    isActive: "true",
    image: null,
  });

  const accent = "#22d3ee";
  const bg = "#070B12";
  const panel = "rgba(15, 23, 42, 0.55)";
  const border = "rgba(148, 163, 184, 0.12)";
  const grid = "rgba(148, 163, 184, 0.08)";

  const glassCardSx = {
    background: `linear-gradient(180deg, ${panel} 0%, rgba(15, 23, 42, 0.35) 100%)`,
    border: `1px solid ${border}`,
    boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
    borderRadius: 3,
    backdropFilter: "blur(10px)",
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "rgba(255,255,255,0.92)",
      borderRadius: 2,
      backgroundColor: "rgba(2, 6, 23, 0.35)",
      "& fieldset": { borderColor: border },
      "&:hover fieldset": { borderColor: "rgba(34, 211, 238, 0.35)" },
      "&.Mui-focused fieldset": { borderColor: accent },
    },
    "& .MuiInputLabel-root": { color: "rgba(226,232,240,0.72)" },
    "& .MuiInputLabel-root.Mui-focused": { color: accent },
  };

  const menuPaperSx = {
    mt: 1,
    backgroundColor: "rgba(2,6,23,0.95)",
    border: `1px solid ${border}`,
    color: "rgba(255,255,255,0.9)",
    "& .MuiMenuItem-root": {
      fontSize: 14,
      "&.Mui-selected": { backgroundColor: "rgba(34,211,238,0.18)" },
      "&.Mui-selected:hover": { backgroundColor: "rgba(34,211,238,0.24)" },
    },
  };

  const primaryBtnSx = {
    borderRadius: 2,
    fontWeight: 800,
    textTransform: "none",
    background: `linear-gradient(90deg, ${accent} 0%, rgba(99,102,241,0.95) 100%)`,
    boxShadow: "0 12px 30px rgba(34,211,238,0.18)",
    "&:hover": {
      background: `linear-gradient(90deg, rgba(34,211,238,0.95) 0%, rgba(99,102,241,0.9) 100%)`,
    },
    "&.Mui-disabled": {
      background: "rgba(148,163,184,0.20)",
      color: "rgba(255,255,255,0.55)",
    },
  };

  const outlineBtnSx = {
    borderRadius: 2,
    fontWeight: 800,
    textTransform: "none",
    color: "rgba(255,255,255,0.86)",
    borderColor: "rgba(148, 163, 184, 0.25)",
    backgroundColor: "rgba(2, 6, 23, 0.10)",
    "&:hover": {
      borderColor: "rgba(34,211,238,0.45)",
      backgroundColor: "rgba(34,211,238,0.06)",
    },
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name.trim()) {
      setError("Subcategory name is required");
      setLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("categoryId", formData.categoryId);
      fd.append("isActive", formData.isActive);
      if (formData.image) fd.append("image", formData.image);

      await AxiosUserInstance.post("/subcategory", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Subcategory created successfully!");
      navigate(-1);
    } catch (err) {
      console.log(err.response?.data || err);
      setError("Failed to create subcategory");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
        color: "white",
        background: `radial-gradient(900px 500px at 20% 10%, rgba(34,211,238,0.12) 0%, transparent 60%),
                     radial-gradient(900px 500px at 80% 20%, rgba(99,102,241,0.10) 0%, transparent 55%),
                     linear-gradient(180deg, ${bg} 0%, #05070D 100%)`,
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${grid} 1px, transparent 1px),
            linear-gradient(90deg, ${grid} 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          opacity: 0.5,
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 980, mx: "auto" }}>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, letterSpacing: 0.2, lineHeight: 1.1 }}
            >
              Create Subcategory
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: "rgba(226,232,240,0.7)" }}>
              Add a new subcategory under the selected category.
            </Typography>
          </Box>

          <Button variant="outlined" onClick={() => navigate(-1)} sx={outlineBtnSx}>
            Back
          </Button>
        </Box>

        <Card sx={glassCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(239,68,68,0.10)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "rgba(255,255,255,0.9)",
                  "& .MuiAlert-icon": { color: "rgb(239,68,68)" },
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Subcategory Name"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
                sx={fieldSx}
              />

              <TextField
                name="categoryId"
                value={formData.categoryId}
                type="hidden"
                InputProps={{ readOnly: true }}
              />

              <TextField
                select
                label="Status"
                name="isActive"
                fullWidth
                value={formData.isActive}
                onChange={handleChange}
                margin="normal"
                sx={fieldSx}
                SelectProps={{
                  MenuProps: { PaperProps: { sx: menuPaperSx } },
                }}
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Not Active</MenuItem>
              </TextField>

              <Box mt={2}>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "rgba(226,232,240,0.75)",
                    fontWeight: 800,
                    letterSpacing: 0.2,
                    mb: 1,
                  }}
                >
                  Upload Image
                </Typography>

                <Box
                  component="label"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    p: 1.5,
                    borderRadius: 2,
                    border: `1px dashed ${border}`,
                    backgroundColor: "rgba(2, 6, 23, 0.25)",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "rgba(34,211,238,0.35)",
                      backgroundColor: "rgba(34,211,238,0.06)",
                    },
                  }}
                >
                  <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.88)" }}>
                    {formData.image ? formData.image.name : "Choose an image…"}
                  </Typography>

                  <Box
                    sx={{
                      px: 1.2,
                      py: 0.6,
                      borderRadius: 2,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.92)",
                      background: `linear-gradient(90deg, rgba(34,211,238,0.28), rgba(99,102,241,0.22))`,
                      border: "1px solid rgba(34,211,238,0.25)",
                    }}
                  >
                    Browse
                  </Box>

                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ ...primaryBtnSx }}
                  disabled={loading}
                >
                  {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
                      <CircularProgress
                        size={18}
                        sx={{
                          color: "white",
                          "& .MuiCircularProgress-circle": { strokeLinecap: "round" },
                        }}
                      />
                      Creating...
                    </Box>
                  ) : (
                    "Create Subcategory"
                  )}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{ ...outlineBtnSx, width: "100%" }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
