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
  FormControl,
  FormHelperText,
  Paper,
  Grid,
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
      alert("Category created successfully!");
      navigate("/dashboard/categories");
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box maxWidth="720px" mx="auto" mt={4}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 } }}>
        <Typography variant="h5" gutterBottom>
          Create Category
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Add a new product category.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
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
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="not_active">Not Active</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" mb={1}>
                Upload Category Image
              </Typography>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                style={{ display: "block" }}
              />
              {imagePreview && (
                <Box mt={2}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12} display="flex" gap={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
              >
                {submitting ? (
                  <CircularProgress size={20} />
                ) : (
                  "Create Category"
                )}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/categories")}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
