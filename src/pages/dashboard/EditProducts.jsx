import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import ProductReviewsList from "./ProductReviewsList";

export default function EditProducts() {
  const { id } = useParams();
  const navigate = useNavigate();

  const subImageInputRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryId, setSubCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [serverMainImage, setServerMainImage] = useState(null);
  const [serverSubImages, setServerSubImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [subImages, setSubImages] = useState([]);

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [subImagesPreview, setSubImagesPreview] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discount: "",
    stock: "",
    tags: [],
    categoryId: "",
    description: "",
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
  };

  const dangerChipSx = {
    backgroundColor: "rgba(239,68,68,0.14)",
    border: "1px solid rgba(239,68,68,0.28)",
    color: "rgba(255,255,255,0.92)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.35)",
  };

  const imageFrameSx = {
    borderRadius: 2,
    overflow: "hidden",
    border: `1px solid rgba(148, 163, 184, 0.18)`,
    backgroundColor: "rgba(2, 6, 23, 0.25)",
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
    const fetchProduct = async () => {
      try {
        const { data } = await AxiosUserInstance.get(`/products/${id}`);
        const p = data.products;
        setProduct(p);

        setFormData({
          name: p.name || "",
          price: p.price ?? "",
          discount: p.discount ?? "",
          stock: p.stock ?? "",
          tags: p.tags || [],
          categoryId: p.categoryId || "",
          description: p.description || "",
        });

        setSubCategoryId(p.subCategoryId || "");

        setServerMainImage(p.mainImage || null);
        setServerSubImages(Array.isArray(p.subImages) ? p.subImages : []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!formData.categoryId) {
      setSubCategories([]);
      setSubCategoryId("");
      return;
    }

    const fetchSubCategories = async () => {
      try {
        const { data } = await AxiosUserInstance.get(
          `/subcategory/byCategory/${formData.categoryId}`
        );
        setSubCategories(data.subCategories || []);
      } catch (err) {
        console.error(err);
        setSubCategories([]);
      }
    };

    fetchSubCategories();
  }, [formData.categoryId]);

  useEffect(() => {
    return () => {
      if (mainImagePreview?.startsWith("blob:"))
        URL.revokeObjectURL(mainImagePreview);
      subImagesPreview.forEach((url) => {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [mainImagePreview, subImagesPreview]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMainImage(file);

    if (mainImagePreview?.startsWith("blob:"))
      URL.revokeObjectURL(mainImagePreview);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setSubImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setSubImagesPreview((prev) => [...prev, ...previews]);

    e.target.value = "";
  };

  const removeNewMainImage = () => {
    if (mainImagePreview?.startsWith("blob:"))
      URL.revokeObjectURL(mainImagePreview);
    setMainImage(null);
    setMainImagePreview(null);
  };

  const removeNewSubImage = (index) => {
    setSubImages((prev) => prev.filter((_, i) => i !== index));
    setSubImagesPreview((prev) => {
      const removed = prev[index];
      if (removed?.startsWith("blob:")) URL.revokeObjectURL(removed);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeServerSubImage = async (public_id) => {
    if (!public_id) return;
    try {
      setIsDeleting(true);
      await AxiosUserInstance.patch(`/products/${id}/remove-subimage`, {
        public_id,
      });

      setServerSubImages((prev) =>
        prev.filter((img) => img.public_id !== public_id)
      );
    } catch (err) {
      console.error(err.response?.data || err);
      alert(
        err.response?.data?.message || "Failed to delete image from server"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("price", formData.price);
      dataToSend.append("discount", formData.discount);
      dataToSend.append("stock", formData.stock);
      dataToSend.append("categoryId", formData.categoryId);
      dataToSend.append("description", formData.description); 

      formData.tags.forEach((tag) => dataToSend.append("tags[]", tag));
      if (subCategoryId) dataToSend.append("subCategoryId", subCategoryId);

      if (mainImage) dataToSend.append("mainImage", mainImage);
      if (subImages.length > 0)
        subImages.forEach((file) => dataToSend.append("subImages", file));

      await AxiosUserInstance.put(
        `/dashboard/products/update/${id}`,
        dataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Product updated successfully!");
      navigate("/dashboard/products");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "Failed to update product");
    }
  };

  if (loading || categories.length === 0)
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
              Edit Product
            </Typography>
            <Typography
              sx={{ mt: 0.5, fontSize: 13, color: "rgba(226,232,240,0.7)" }}
            >
              Update product info, images, and tags.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard/products")}
            sx={{
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
            }}
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

            <input
              ref={subImageInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleSubImagesChange}
            />

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  margin="none"
                  sx={fieldSx}
                />

                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  fullWidth
                  margin="none"
                  sx={fieldSx}
                />

                <TextField
                  label="Discount (%)"
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleChange}
                  fullWidth
                  margin="none"
                  sx={fieldSx}
                />

                <TextField
                  label="Stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  fullWidth
                  margin="none"
                  sx={fieldSx}
                />
              </Box>

              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={formData.tags}
                onChange={(e, newValue) =>
                  setFormData((prev) => ({ ...prev, tags: newValue }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Add tags"
                    margin="normal"
                    fullWidth
                    sx={fieldSx}
                  />
                )}
              />

              <TextField
                select
                label="Category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={fieldSx}
                SelectProps={{
                  MenuProps: { PaperProps: { sx: menuPaperSx } },
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                minRows={4}
                sx={fieldSx}
              />

              {subCategories.length > 0 && (
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <TextField
                    select
                    label="SubCategory (optional)"
                    name="subCategoryId"
                    value={subCategoryId}
                    onChange={(e) => setSubCategoryId(e.target.value)}
                    fullWidth
                    sx={fieldSx}
                    SelectProps={{
                      MenuProps: { PaperProps: { sx: menuPaperSx } },
                    }}
                  >
                    <MenuItem value="">None</MenuItem>
                    {subCategories.map((sub) => (
                      <MenuItem key={sub._id} value={sub._id}>
                        {sub.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}

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
                  Main Image
                </Typography>

                <Box
                  sx={{
                    ...glassCardSx,
                    borderRadius: 2,
                    p: 2,
                    background: "rgba(2, 6, 23, 0.25)",
                  }}
                >
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
                    <Typography
                      sx={{ fontSize: 13, color: "rgba(255,255,255,0.88)" }}
                    >
                      {mainImage ? mainImage.name : "Choose an image…"}
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
                      accept="image/*"
                      onChange={handleMainImageChange}
                      style={{ display: "none" }}
                    />
                  </Box>

                  {serverMainImage?.secure_url && !mainImagePreview && (
                    <Box
                      mt={1}
                      sx={{ width: 120, height: 120, ...imageFrameSx }}
                    >
                      <img
                        src={serverMainImage.secure_url}
                        alt="Server Main"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )}

                  {mainImagePreview && (
                    <Box
                      mt={1}
                      sx={{
                        position: "relative",
                        width: 120,
                        height: 120,
                        ...imageFrameSx,
                      }}
                    >
                      <img
                        src={mainImagePreview}
                        alt="New Main Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        onClick={removeNewMainImage}
                        sx={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          cursor: "pointer",
                          ...dangerChipSx,
                        }}
                      >
                        ✕
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>

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
                  Sub Images
                </Typography>

                <Box
                  mt={1}
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    alignItems: "center",
                    opacity: isDeleting ? 0.6 : 1,
                    pointerEvents: isDeleting ? "none" : "auto",
                  }}
                >
                  {serverSubImages.map((img) => (
                    <Box
                      key={img.public_id}
                      sx={{
                        position: "relative",
                        width: 90,
                        height: 90,
                        ...imageFrameSx,
                      }}
                    >
                      <img
                        src={img.secure_url}
                        alt="Server Sub"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        onClick={() => removeServerSubImage(img.public_id)}
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          cursor: "pointer",
                          lineHeight: 1,
                          ...dangerChipSx,
                        }}
                      >
                        ✕
                      </Box>
                    </Box>
                  ))}

                  {subImagesPreview.map((src, idx) => (
                    <Box
                      key={`new-${idx}`}
                      sx={{
                        position: "relative",
                        width: 90,
                        height: 90,
                        ...imageFrameSx,
                      }}
                    >
                      <img
                        src={src}
                        alt={`New Sub ${idx}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        onClick={() => removeNewSubImage(idx)}
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          cursor: "pointer",
                          lineHeight: 1,
                          ...dangerChipSx,
                        }}
                      >
                        ✕
                      </Box>
                    </Box>
                  ))}

                  <Box
                    onClick={() => subImageInputRef.current?.click()}
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: 2,
                      border: `2px dashed ${border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "rgba(226,232,240,0.7)",
                      fontSize: 32,
                      backgroundColor: "rgba(2, 6, 23, 0.18)",
                      "&:hover": {
                        borderColor: "rgba(34,211,238,0.55)",
                        color: accent,
                        backgroundColor: "rgba(34,211,238,0.06)",
                      },
                    }}
                  >
                    +
                  </Box>
                </Box>
              </Box>

              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, ...primaryBtnSx }}
              >
                Update Product
              </Button>
            </form>
          </CardContent>
        </Card>

        <Box mt={4} sx={{color:"white"}}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>
            Product Reviews
          </Typography>

          <Card sx={{ ...glassCardSx, mt: 1 ,color:"white" }}>
            <CardContent sx={{ p: { xs: 2, md: 3,color:"white" } }}>
              {product?._id && <ProductReviewsList productId={product._id} />}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
