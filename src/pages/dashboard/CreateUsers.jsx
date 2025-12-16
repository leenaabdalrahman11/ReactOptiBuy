import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import AxiosUserInstance from "../../api/AxiosUserInstance";

export default function CreateUsers() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    gender: "",
    role: "user",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    if (!form.userName || !form.email || !form.password) {
      setError("userName, email and password are required");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("userName", form.userName);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("gender", form.gender);
      formData.append("role", form.role);

      if (image) formData.append("image", image);

      const { data } = await AxiosUserInstance.post("/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(data.message || "User created");
      navigate("/dashboard/users");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Create User
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
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              type="email"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              type="password"
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
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
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
                {loading ? <CircularProgress size={20} /> : "Create"}
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
