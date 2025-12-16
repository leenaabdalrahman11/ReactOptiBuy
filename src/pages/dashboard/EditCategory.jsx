import React, { useState, useEffect } from "react";
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
  Paper,
  Grid,
} from "@mui/material";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    status: "active",
  });

  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);

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

        const { data: allSubsData } = await AxiosUserInstance.get(
          `/subcategory`
        );
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
      alert("Category updated successfully!");
      navigate("/dashboard/categories");
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Failed to update category");
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
          Edit Category
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
                margin="normal"
                required
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
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="not_active">Not Active</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" mb={1}>
                Subcategories
              </Typography>
              {selectedSubCategories.length > 0 ? (
                <Box mb={2}>
                  {selectedSubCategories.map((sub, index) => (
                    <Typography key={index} variant="body2">
                      - {sub}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" mb={2}>
                  No Subcategories yet.
                </Typography>
              )}

              <Button
                variant="outlined"
                onClick={() =>
                  navigate(`/dashboard/create-subcategory?categoryId=${id}`)
                }
                sx={{ mb: 2 }}
              >
                Create Subcategory
              </Button>
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
                  "Update Category"
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
