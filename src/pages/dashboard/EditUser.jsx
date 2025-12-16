import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AxiosUserInstance from "../../api/AxiosUserInstance";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    userName: "",
    phone: "",
    address: "",
    gender: "",
    role: "user",
    status: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUser = async () => {
    try {
      const { data } = await AxiosUserInstance.get(`/users/${id}`);
      const user = data.user;
      setForm({
        userName: user.userName,
        phone: user.phone || "",
        address: user.address || "",
        gender: user.gender || "",
        role: user.role || "user",
        status: user.status || "",
      });
    } catch (err) {
      setError("Failed to load user");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImage = (e) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("userName", form.userName);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("gender", form.gender);
      formData.append("role", form.role);
      formData.append("status", form.status);

      if (image) formData.append("image", image);

      const { data } = await AxiosUserInstance.put(`/users/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(data.message || "User updated successfully");
      navigate("/dashboard/users");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <Box>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Edit User
      </Typography>

      <Card>
        <CardContent>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <TextField
              fullWidth
              label="User Name"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
              </Select>
            </FormControl>

            <Box mt={2}>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImage}
              />
            </Box>

            <Box mt={3} display="flex" gap={2}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={20} /> : "Update"}
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/users")}
                sx={{ minWidth: 120 }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
