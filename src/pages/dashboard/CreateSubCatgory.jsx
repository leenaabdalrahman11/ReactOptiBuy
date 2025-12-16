import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  MenuItem,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AxiosUserInstance from "../../api/AxiosUserInstance";

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
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" mb={2}>
        Create Subcategory
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
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
        >
          <MenuItem value="true">Active</MenuItem>
          <MenuItem value="false">Not Active</MenuItem>
        </TextField>

        <Box mt={2}>
          <Typography variant="body2">Upload Image</Typography>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            style={{ marginTop: "8px" }}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Subcategory"}
        </Button>
      </form>
    </Paper>
  );
}
