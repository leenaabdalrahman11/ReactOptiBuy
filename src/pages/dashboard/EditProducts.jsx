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
  });

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

  if (loading || categories.length === 0) return <CircularProgress />;

  return (
    <Box maxWidth="600px" mx="auto">
      <Typography variant="h5" gutterBottom>
        Edit Product
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
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
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Discount (%)"
          name="discount"
          type="number"
          value={formData.discount}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

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
        >
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        {subCategories.length > 0 && (
          <Box display="flex" alignItems="center" gap={1} mt={2}>
            <TextField
              select
              label="SubCategory (optional)"
              name="subCategoryId"
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
              fullWidth
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
          <Typography>Main Image</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
          />

          {serverMainImage?.secure_url && !mainImagePreview && (
            <Box mt={1} sx={{ width: 120, height: 120 }}>
              <img
                src={serverMainImage.secure_url}
                alt="Server Main"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid #ddd",
                }}
              />
            </Box>
          )}

          {mainImagePreview && (
            <Box mt={1} sx={{ position: "relative", width: 120, height: 120 }}>
              <img
                src={mainImagePreview}
                alt="New Main Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid #ddd",
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
                  bgcolor: "error.main",
                  color: "#fff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow: 2,
                }}
              >
                ✕
              </Box>
            </Box>
          )}
        </Box>

        <Box mt={2}>
          <Typography>Sub Images</Typography>

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
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #ddd",
                }}
              >
                <img
                  src={img.secure_url}
                  alt="Server Sub"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <Box
                  onClick={() => removeServerSubImage(img.public_id)}
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 20,
                    height: 20,
                    bgcolor: "error.main",
                    color: "#fff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    cursor: "pointer",
                    boxShadow: 2,
                    lineHeight: 1,
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
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #ddd",
                }}
              >
                <img
                  src={src}
                  alt={`New Sub ${idx}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <Box
                  onClick={() => removeNewSubImage(idx)}
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 20,
                    height: 20,
                    bgcolor: "error.main",
                    color: "#fff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    cursor: "pointer",
                    boxShadow: 2,
                    lineHeight: 1,
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
                border: "2px dashed #aaa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "text.secondary",
                fontSize: 32,
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
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
          color="primary"
          sx={{ mt: 2 }}
        >
          Update Product
        </Button>
      </form>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Product Reviews
        </Typography>
        {product?._id && <ProductReviewsList productId={product._id} />}
      </Box>
    </Box>
  );
}
