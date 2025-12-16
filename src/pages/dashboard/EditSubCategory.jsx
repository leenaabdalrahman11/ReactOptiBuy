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
      if (subCategory.image?.secure_url)
        setPreview(subCategory.image.secure_url);
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

  if (loadingSub || loadingCats) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Edit SubCategory
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Stack spacing={2}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
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
                <Typography variant="subtitle2">Image</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  {preview ? (
                    <Avatar
                      src={preview}
                      alt="preview"
                      sx={{ width: 56, height: 56 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 56, height: 56 }}>
                      {form.name?.[0]}
                    </Avatar>
                  )}
                  <Button variant="outlined" component="label">
                    Choose Image
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleFile}
                    />
                  </Button>
                </Stack>
              </Box>

              <FormControlLabel
                control={
                  <Switch checked={form.isActive} onChange={handleToggle} />
                }
                label={form.isActive ? "Active" : "Inactive"}
              />

              <Box>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? <CircularProgress size={20} /> : "Save"}
                </Button>
                <Button sx={{ ml: 2 }} onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
