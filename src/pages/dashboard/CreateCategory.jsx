import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import { Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

export default function CreateCategory() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    status: "active",
    image: null,
    
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  const accent = "#22d3ee";
  const bg = "#070B12";
  const panel = "rgba(15, 23, 42, 0.55)";
  const border = "rgba(148, 163, 184, 0.12)";
  const grid = "rgba(148, 163, 184, 0.08)";
const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });

const showToast = (msg, severity = "success") => {
  setToast((t) => ({ ...t, open: false }));
  setTimeout(() => setToast({ open: true, msg, severity }), 0);
};

const closeToast = (_, reason) => {
  if (reason === "clickaway") return;
  setToast((t) => ({ ...t, open: false }));
};

const [confirmOpen, setConfirmOpen] = useState(false);
const openCancelConfirm = () => setConfirmOpen(true);
const closeCancelConfirm = () => setConfirmOpen(false);
const confirmCancel = () => {
  setConfirmOpen(false);
  navigate("/dashboard/categories");
};

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
    "& .MuiFormHelperText-root": { color: "rgba(226,232,240,0.6)" },
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

  useEffect(() => {
    const fetchAllSubs = async () => {
      try {
        const { data } = await AxiosUserInstance.get(`/subcategory`);
        setAllSubCategories(data.subCategories || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load subcategories");
      } finally {
        setLoading(false);
      }
    };
    fetchAllSubs();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append("name", formData.name.trim());
    dataToSend.append("status", formData.status);
    if (formData.image) dataToSend.append("image", formData.image);
    selectedSubCategories.forEach((id) =>
      dataToSend.append("subCategories[]", id)
    );

    try {
      setSubmitting(true);
      await AxiosUserInstance.post(`/categories`, dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
showToast("Category created ✅", "success");
setTimeout(() => navigate("/dashboard/categories"), 900);

    } catch (err) {
  console.error(err.response?.data || err);
  const msg = err?.response?.data?.message || "Failed to create category";
  showToast(msg, "error");
}
 finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "grid",
          placeItems: "center",
          background: `radial-gradient(900px 500px at 20% 10%, rgba(34,211,238,0.12) 0%, transparent 60%),
                       radial-gradient(900px 500px at 80% 20%, rgba(99,102,241,0.10) 0%, transparent 55%),
                       linear-gradient(180deg, ${bg} 0%, #05070D 100%)`,
        }}
      >
        <CircularProgress sx={{ color: accent }} />
      </Box>
    );

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
      <Snackbar
  key={toast.msg + toast.severity}
  open={toast.open}
  autoHideDuration={2400}
  onClose={closeToast}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
  container={() => document.body}
  sx={{ zIndex: 9999999 }}
>
  <Alert
    onClose={closeToast}
    severity={toast.severity}
    variant="filled"
    sx={{
      borderRadius: 2,
      fontWeight: 800,
      boxShadow: "0 12px 30px rgba(0,0,0,0.14)",
      minWidth: { xs: "92vw", sm: 460 },
    }}
  >
    {toast.msg}
  </Alert>
</Snackbar>
<Dialog
  open={confirmOpen}
  onClose={closeCancelConfirm}
  PaperProps={{
    sx: {
      borderRadius: 3,
      background: "rgba(15, 23, 42, 0.9)",
      border: `1px solid ${border}`,
      boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
      backdropFilter: "blur(10px)",
      color: "rgba(255,255,255,0.9)",
      minWidth: { xs: "92vw", sm: 460 },
    },
  }}
>
  <DialogTitle sx={{ fontWeight: 900, pb: 1 }}>Discard changes?</DialogTitle>
  <DialogContent sx={{ color: "rgba(226,232,240,0.75)" }}>
    Are you sure you want to cancel? Your changes will be lost.
  </DialogContent>
  <DialogActions sx={{ p: 2, gap: 1 }}>
    <Button onClick={closeCancelConfirm} variant="outlined" sx={outlineBtnSx}>
      Stay
    </Button>
    <Button onClick={confirmCancel} variant="contained" sx={primaryBtnSx}>
      Yes, Cancel
    </Button>
  </DialogActions>
</Dialog>

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
              Create Category
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: "rgba(226,232,240,0.7)" }}>
              Add a new product category.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard/categories")}
            sx={outlineBtnSx}
          >
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
              <Grid container spacing={2} sx={{display:"flex",flexDirection:"column"}}>
                <Grid item xs={12} md={8}>
                  <TextField
                    label="Category Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                    placeholder="e.g. Electronics"
                    helperText="Choose a clear, short name for the category"
                    sx={fieldSx}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    fullWidth
                    sx={fieldSx}
                    SelectProps={{
                      MenuProps: { PaperProps: { sx: menuPaperSx } },
                    }}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="not_active">Not Active</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "rgba(226,232,240,0.75)",
                      fontWeight: 800,
                      letterSpacing: 0.2,
                      mb: 1,
                    }}
                  >
                    Category Image
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
                      accept="image/*"
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                  </Box>

                  {imagePreview && (
                    <Box
                      mt={2}
                      sx={{
                        width: "100%",
                        maxWidth: 360,
                        borderRadius: 2,
                        overflow: "hidden",
                        border: `1px solid rgba(148,163,184,0.18)`,
                        backgroundColor: "rgba(2, 6, 23, 0.25)",
                      }}
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: 200,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} display="flex" gap={2} flexWrap="wrap">
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    sx={{ minWidth: 170, ...primaryBtnSx }}
                  >
                    {submitting ? (
                      <CircularProgress
                        size={20}
                        sx={{ color: "white", "& .MuiCircularProgress-circle": { strokeLinecap: "round" } }}
                      />
                    ) : (
                      "Create Category"
                    )}
                  </Button>

<Button
  variant="outlined"
  onClick={openCancelConfirm}
  sx={{ minWidth: 140, ...outlineBtnSx }}
>
  Cancel
</Button>


                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
