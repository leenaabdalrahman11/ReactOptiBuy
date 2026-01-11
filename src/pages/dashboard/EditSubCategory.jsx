import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  MenuItem,
  Switch,
  FormControlLabel,
  Avatar,
  Stack,
} from "@mui/material";

export default function EditSubCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    isActive: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchSub = async () => {
    const { data } = await AxiosUserInstance.get(`/subcategory/${id}`);
    return data.subCategory || data;
  };

  const fetchCategories = async () => {
    const { data } = await AxiosUserInstance.get("/categories");
    return data.categories || data;
  };

  const { data: subCategory, isLoading: loadingSub } = useQuery({
    queryKey: ["subCategory", id],
    queryFn: fetchSub,
    enabled: !!id,
  });

  const { data: categories, isLoading: loadingCats } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (subCategory) {
      setForm({
        name: subCategory.name || "",
        categoryId: subCategory.category || "",
        isActive: !!subCategory.isActive,
      });
      if (subCategory.image?.secure_url) setPreview(subCategory.image.secure_url);
    }
  }, [subCategory]);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleToggle = (e) => {
    setForm((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const body = new FormData();
      body.append("name", form.name);

      if (form.categoryId) {
        body.append("category", form.categoryId);
      }
      body.append("isActive", String(form.isActive));
      if (imageFile) body.append("image", imageFile);

      const { data } = await AxiosUserInstance.put(`/subcategory/${id}`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("update response:", data);
      navigate(`/dashboard/subcategory`);
    } catch (err) {
      const serverData = err.response?.data;
      let message = null;

      if (serverData) {
        if (typeof serverData === "object" && serverData.message) {
          message = serverData.message;
        } else if (typeof serverData === "string") {
          const preMatch = serverData.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
          if (preMatch && preMatch[1]) {
            message = preMatch[1]
              .replace(/<br\s*\/?>/gi, "\n")
              .replace(/&nbsp;/gi, " ");
            message = message.trim();
          } else {
            const tmp = serverData.replace(/<[^>]+>/g, "");
            message = tmp.trim().slice(0, 800);
          }
        }
      }

      if (!message) {
        message =
          err.response?.statusText ||
          err.message ||
          "Failed to update subcategory";
      }

      console.error("update failed:", err.response || err.message);
      alert(message);
    } finally {
      setSaving(false);
    }
  };

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

  const switchSx = {
    "& .MuiSwitch-switchBase.Mui-checked": { color: accent },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "rgba(34,211,238,0.55)",
    },
    "& .MuiSwitch-track": { backgroundColor: "rgba(148,163,184,0.25)" },
  };

  if (loadingSub || loadingCats)
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
              Edit SubCategory
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: "rgba(226,232,240,0.7)" }}>
              Update subcategory details and image.
            </Typography>
          </Box>

          <Button variant="outlined" onClick={() => navigate(-1)} sx={outlineBtnSx}>
            Back
          </Button>
        </Box>

        <Card sx={glassCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={fieldSx}
                />

                <TextField
                  select
                  label="Category"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  helperText={
                    form.categoryId ? "" : "SubCategory not linked to a category"
                  }
                  fullWidth
                  sx={fieldSx}
                  SelectProps={{
                    MenuProps: { PaperProps: { sx: menuPaperSx } },
                  }}
                >
                  <MenuItem value="">-- No Category --</MenuItem>
                  {Array.isArray(categories) &&
                    categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                </TextField>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "rgba(226,232,240,0.75)",
                      fontWeight: 800,
                      letterSpacing: 0.2,
                      mb: 1,
                    }}
                  >
                    Image
                  </Typography>

                  <Stack direction="row" spacing={2} alignItems="center">
                    {preview ? (
                      <Avatar
                        src={preview}
                        alt="preview"
                        sx={{
                          width: 56,
                          height: 56,
                          border: "1px solid rgba(34,211,238,0.22)",
                          boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          background:
                            "linear-gradient(90deg, rgba(34,211,238,0.35), rgba(99,102,241,0.30))",
                          border: "1px solid rgba(34,211,238,0.22)",
                          color: "rgba(255,255,255,0.92)",
                          fontWeight: 900,
                        }}
                      >
                        {form.name?.[0]}
                      </Avatar>
                    )}

                    <Button variant="outlined" component="label" sx={outlineBtnSx}>
                      Choose Image
                      <input hidden accept="image/*" type="file" onChange={handleFile} />
                    </Button>
                  </Stack>
                </Box>

                <FormControlLabel
                  control={<Switch checked={form.isActive} onChange={handleToggle} sx={switchSx} />}
                  label={
                    <Typography sx={{ color: "rgba(226,232,240,0.8)", fontWeight: 800 }}>
                      {form.isActive ? "Active" : "Inactive"}
                    </Typography>
                  }
                />

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                  <Button type="submit" variant="contained" disabled={saving} sx={{ minWidth: 160, ...primaryBtnSx }}>
                    {saving ? (
                      <CircularProgress
                        size={20}
                        sx={{ color: "white", "& .MuiCircularProgress-circle": { strokeLinecap: "round" } }}
                      />
                    ) : (
                      "Save"
                    )}
                  </Button>

                  <Button onClick={() => navigate(-1)} variant="outlined" sx={{ minWidth: 140, ...outlineBtnSx }}>
                    Cancel
                  </Button>
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
