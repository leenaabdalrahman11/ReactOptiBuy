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
} from "@mui/material";

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
    mainImage: null,
    subImages: [],
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
    if (!formData.CategoryId) {
      setSubCategories([]);
      setFormData((prev) => ({ ...prev, subCategoryId: "" }));
      return;
    }

    const fetchSubCategories = async () => {
      try {
        const { data } = await AxiosUserInstance.get(
          `/subcategory/byCategory/${formData.CategoryId}`
        );
        setSubCategories(data.subCategories || []);
        setFormData((prev) => ({ ...prev, subCategoryId: "" }));
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
        setSubCategories([]);
        setFormData((prev) => ({ ...prev, subCategoryId: "" }));
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, tags: newValue }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, mainImage: file }));

    if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, subImages: files }));

    subImagesPreview.forEach((url) => URL.revokeObjectURL(url));
    const previews = files.map((file) => URL.createObjectURL(file));
    setSubImagesPreview(previews);
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
      dataToSend.append("CategoryId", formData.CategoryId);

      if (formData.subCategoryId) {
        dataToSend.append("subCategoryId", formData.subCategoryId);
      }

      formData.tags.forEach((tag) => dataToSend.append("tags[]", tag));

      if (formData.mainImage)
        dataToSend.append("mainImage", formData.mainImage);

      if (formData.subImages.length > 0) {
        formData.subImages.forEach((file) => {
          dataToSend.append("subImages", file);
        });
      }

      await AxiosUserInstance.post("/products", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product created successfully!");
      navigate("/dashboard/products");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box maxWidth="600px" mx="auto">
      <Typography variant="h5" gutterBottom>
        Create Product
      </Typography>

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
          onChange={handleTagsChange}
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
          name="CategoryId"
          value={formData.CategoryId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="">Select Category</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
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
            margin="normal"
          >
            <MenuItem value="">None</MenuItem>
            {subCategories.map((sub) => (
              <MenuItem key={sub._id} value={sub._id}>
                {sub.name}
              </MenuItem>
            ))}
          </TextField>
        )}

        <Box mt={2}>
          <Typography>Main Image</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
          />

          {mainImagePreview && (
            <Box mt={1}>
              <img
                src={mainImagePreview}
                alt="Main Preview"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid #ddd",
                }}
              />
            </Box>
          )}
        </Box>

        <Box mt={2}>
          <Typography>Sub Images</Typography>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleSubImagesChange}
          />

          {subImagesPreview.length > 0 && (
            <Box
              mt={1}
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              {subImagesPreview.map((src, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #ddd",
                  }}
                >
                  <img
                    src={src}
                    alt={`Sub ${idx}`}
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
          color="primary"
          sx={{ mt: 2 }}
        >
          Create Product
        </Button>
      </form>
    </Box>
  );
}
