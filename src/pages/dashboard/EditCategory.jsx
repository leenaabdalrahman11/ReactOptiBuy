import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import {
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

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

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    status: "active",
  });

  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);

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

  useEffect(() => {
    const fetchCategoryAndSubs = async () => {
      try {
        const { data } = await AxiosUserInstance.get(`/categories/${id}`);
        const selected = Array.isArray(data.subCategories)
          ? data.subCategories.map((sub) =>
              sub && sub._id ? String(sub._id) : String(sub)
            )
          : [];

        setFormData({
          name: data.category?.name || "",
          status: data.category?.status || "active",
        });
        setSelectedSubCategories(selected);

        const { data: allSubsData } = await AxiosUserInstance.get(`/subcategory`);
        setAllSubCategories(allSubsData.subCategories || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch category or subcategories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryAndSubs();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setSubmitting(true);
      const updatedData = {
        ...formData,
        subCategories: selectedSubCategories,
      };

      await AxiosUserInstance.put(`/categories/${id}`, updatedData);
showToast("Category updated ✅", "success");
setTimeout(() => navigate("/dashboard/categories"), 900);

    } catch (err) {
const msg = err?.response?.data?.message || "Failed to update category";
showToast(msg, "error");
setError(msg); 

    } finally {
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
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 980, mx: "auto", }}>
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
              Edit Category
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: "rgba(226,232,240,0.7)" }}>
              Update category details (consistent dashboard style).
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={openCancelConfirm}

            sx={outlineBtnSx}
          >
            Back
          </Button>
        </Box>
<Snackbar
  key={toast.msg + toast.severity}
  open={toast.open}
  autoHideDuration={2400}
  onClose={closeToast}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
  container={() => document.body + 1000000000}
    sx={{
    "&.MuiSnackbar-root": {
      position: "fixed",
      top: 100,                
      zIndex: 200200,      
    },
  }}
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

            <form onSubmit={handleSubmit} >
              <Grid container spacing={2} sx={{display:"flex",flexDirection:"column"}}>
                <Grid item xs={12} md={8} >
                  <TextField
                    label="Category Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
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
                    margin="normal"
                    sx={fieldSx}
                    SelectProps={{
                      MenuProps: { PaperProps: { sx: menuPaperSx } },
                    }}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="not_active">Not Active</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "rgba(226,232,240,0.75)",
                      fontWeight: 800,
                      letterSpacing: 0.2,
                      mb: 1,
                    }}
                  >
                    Subcategories
                  </Typography>

                  {selectedSubCategories.length > 0 ? (
                    <Box
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid rgba(148, 163, 184, 0.14)`,
                        backgroundColor: "rgba(2, 6, 23, 0.20)",
                      }}
                    >
                      {selectedSubCategories.map((sub, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{ color: "rgba(226,232,240,0.75)", fontSize: 13 }}
                        >
                          • {sub}
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ mb: 2, color: "rgba(226,232,240,0.6)" }}
                    >
                      No Subcategories yet.
                    </Typography>
                  )}

                  <Button
                    variant="outlined"
                    onClick={() =>
                      navigate(`/dashboard/create-subcategory?categoryId=${id}`)
                    }
                    sx={outlineBtnSx}
                  >
                    Create Subcategory
                  </Button>
                </Grid>

                <Grid item xs={12} display="flex"  gap={2} flexWrap="wrap">
                  <Button 
                    
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    sx={{ minWidth: 160, ...primaryBtnSx }}
                  >
                    {submitting ? (
                      <CircularProgress
                        size={20}
                        sx={{ color: "white", "& .MuiCircularProgress-circle": { strokeLinecap: "round" } }}
                      />
                    ) : (
                      "Update Category"
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
