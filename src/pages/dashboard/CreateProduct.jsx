import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  MenuItem,
  Autocomplete,
  Card,
  CardContent,
} from "@mui/material";
import { Chip } from "@mui/material";

export default function CreateProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [error, setError] = useState(null);

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [subImagesPreview, setSubImagesPreview] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discount: "",
    stock: "",
    tags: [],
    CategoryId: "",
    subCategoryId: "",
    description: "",
    mainImage: null,
    subImages: [],
  });

  const accent = "#22d3ee";
  const bg = "#070B12";
  const panel = "rgba(15, 23, 42, 0.55)";
  const border = "rgba(148, 163, 184, 0.12)";
  const grid = "rgba(148, 163, 184, 0.08)";

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
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await AxiosUserInstance.get("/categories");
        setCategories(data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!formData.CategoryId) {
      setSubCategories([]);
      setFormData((p) => ({ ...p, subCategoryId: "" }));
      return;
    }

    const fetchSubCategories = async () => {
      try {
        const { data } = await AxiosUserInstance.get(
          `/subcategory/byCategory/${formData.CategoryId}`
        );
        setSubCategories(data.subCategories || []);
        setFormData((p) => ({ ...p, subCategoryId: "" }));
      } catch {
        setSubCategories([]);
        setFormData((p) => ({ ...p, subCategoryId: "" }));
      }
    };

    fetchSubCategories();
  }, [formData.CategoryId]);

  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
      subImagesPreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mainImagePreview, subImagesPreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleTagsChange = (_, newValue) => {
    const unique = Array.from(
      new Set(newValue.map((t) => String(t).trim()))
    ).filter(Boolean);
    setFormData((p) => ({ ...p, tags: unique }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((p) => ({ ...p, mainImage: file }));
    if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((p) => ({ ...p, subImages: files }));

    subImagesPreview.forEach((url) => URL.revokeObjectURL(url));
    setSubImagesPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("price", formData.price);
      dataToSend.append("discount", formData.discount);
      dataToSend.append("stock", formData.stock);
      dataToSend.append("description", formData.description);

      dataToSend.append("CategoryId", formData.CategoryId);

      if (formData.subCategoryId)
        dataToSend.append("subCategoryId", formData.subCategoryId);

      formData.tags.forEach((t) => dataToSend.append("tags[]", t));

      if (formData.mainImage)
        dataToSend.append("mainImage", formData.mainImage);

      formData.subImages.forEach((f) => dataToSend.append("subImages", f));

      await AxiosUserInstance.post("/products", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product created successfully!");
      navigate("/dashboard/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
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
          Create Product
        </Typography>

        <Card sx={glassCardSx}>
          <CardContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                sx={fieldSx}
                margin="normal"
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                sx={fieldSx}
                margin="normal"
              />
              <TextField
                label="Discount (%)"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleChange}
                fullWidth
                sx={fieldSx}
                margin="normal"
              />
              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                fullWidth
                sx={fieldSx}
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={4}
                sx={fieldSx}
                margin="normal"
                placeholder="Write product description..."
              />

              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={formData.tags}
                onChange={handleTagsChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.12)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.35)",
                        fontWeight: 700,
                        "& .MuiChip-deleteIcon": {
                          color: "rgba(255,255,255,0.75)",
                          "&:hover": { color: "#fff" },
                        },
                      }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    fullWidth
                    margin="normal"
                    placeholder="Type tag and press Enter"
                    sx={{
                      ...fieldSx,
                      "& .MuiOutlinedInput-root": {
                        ...fieldSx["& .MuiOutlinedInput-root"],
                        "& input": { color: "#fff" },
                      },
                    }}
                  />
                )}
              />

              <TextField
                select
                label="Category"
                name="CategoryId"
                value={formData.CategoryId}
                onChange={handleChange}
                fullWidth
                sx={fieldSx}
                margin="normal"
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>

              {subCategories.length > 0 && (
                <TextField
                  select
                  label="SubCategory (optional)"
                  name="subCategoryId"
                  value={formData.subCategoryId}
                  onChange={handleChange}
                  fullWidth
                  sx={fieldSx}
                  margin="normal"
                >
                  <MenuItem value="">None</MenuItem>
                  {subCategories.map((s) => (
                    <MenuItem key={s._id} value={s._id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              <Box mt={2} color={"white"}>
                <Typography fontSize={13} mb={1}>
                  Main Image
                </Typography>
                <Box mt={2} color={"white"}>
                  <Typography fontSize={13} mb={1}>
                    Main Image
                  </Typography>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                  />

                  {mainImagePreview && (
                    <Box
                      mt={2}
                      sx={{
                        width: 220,
                        height: 220,
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid rgba(148,163,184,0.18)",
                        backgroundColor: "rgba(2, 6, 23, 0.25)",
                      }}
                    >
                      <img
                        src={mainImagePreview}
                        alt="Main preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>

              <Box mt={2} color={"white"}>
                <Typography fontSize={13} mb={1}>
                  Sub Images
                </Typography>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleSubImagesChange}
                />

                {subImagesPreview?.length > 0 && (
                  <Box
                    mt={2}
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    {subImagesPreview.map((src, idx) => (
                      <Box
                        key={src + idx}
                        sx={{
                          width: 90,
                          height: 90,
                          borderRadius: 2,
                          overflow: "hidden",
                          border: "1px solid rgba(148,163,184,0.18)",
                          backgroundColor: "rgba(2, 6, 23, 0.25)",
                        }}
                      >
                        <img
                          src={src}
                          alt={`Sub preview ${idx + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  fontWeight: 800,
                  background: `linear-gradient(90deg, ${accent}, #6366f1)`,
                }}
              >
                Create Product
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
