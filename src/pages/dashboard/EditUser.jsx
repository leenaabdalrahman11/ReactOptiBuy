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
    "& .MuiFormHelperText-root": { color: "rgba(226,232,240,0.6)" },
  };

  const selectSx = {
    ...fieldSx,
    "& .MuiSelect-icon": { color: "rgba(226,232,240,0.75)" },
  };

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
        <CircularProgress
          sx={{
            color: accent,
            "& .MuiCircularProgress-circle": { strokeLinecap: "round" },
          }}
        />
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
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 920, mx: "auto" }}>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                letterSpacing: 0.2,
                lineHeight: 1.1,
              }}
            >
              Edit User
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 13,
                color: "rgba(226,232,240,0.7)",
              }}
            >
              Update user profile details (same logic, dashboard theme styling).
            </Typography>
          </Box>

          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: accent,
              boxShadow: "0 0 0 6px rgba(34,211,238,0.10), 0 0 22px rgba(34,211,238,0.35)",
              flex: "0 0 auto",
              mt: 1,
              display: { xs: "none", sm: "block" },
            }}
          />
        </Box>

        <Card sx={glassCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            {(error || success) && (
              <Box sx={{ mb: 2, display: "grid", gap: 1.2 }}>
                {error && (
                  <Alert
                    severity="error"
                    sx={{
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
                {success && (
                  <Alert
                    severity="success"
                    sx={{
                      borderRadius: 2,
                      backgroundColor: "rgba(34,197,94,0.10)",
                      border: "1px solid rgba(34,197,94,0.25)",
                      color: "rgba(255,255,255,0.9)",
                      "& .MuiAlert-icon": { color: "rgb(34,197,94)" },
                    }}
                  >
                    {success}
                  </Alert>
                )}
              </Box>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextField
                  fullWidth
                  label="User Name"
                  name="userName"
                  value={form.userName}
                  onChange={handleChange}
                  margin="none"
                  sx={fieldSx}
                />

                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  margin="none"
                  sx={fieldSx}
                />

                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  margin="none"
                  sx={{ ...fieldSx, gridColumn: { xs: "auto", md: "1 / -1" } }}
                />

                <FormControl fullWidth sx={selectSx}>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    label="Gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          mt: 1,
                          backgroundColor: "rgba(2,6,23,0.95)",
                          border: `1px solid ${border}`,
                          color: "rgba(255,255,255,0.9)",
                          "& .MuiMenuItem-root": {
                            fontSize: 14,
                            "&.Mui-selected": {
                              backgroundColor: "rgba(34,211,238,0.18)",
                            },
                            "&.Mui-selected:hover": {
                              backgroundColor: "rgba(34,211,238,0.24)",
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={selectSx}>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    label="Role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          mt: 1,
                          backgroundColor: "rgba(2,6,23,0.95)",
                          border: `1px solid ${border}`,
                          color: "rgba(255,255,255,0.9)",
                          "& .MuiMenuItem-root": {
                            fontSize: 14,
                            "&.Mui-selected": {
                              backgroundColor: "rgba(34,211,238,0.18)",
                            },
                            "&.Mui-selected:hover": {
                              backgroundColor: "rgba(34,211,238,0.24)",
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={selectSx}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          mt: 1,
                          backgroundColor: "rgba(2,6,23,0.95)",
                          border: `1px solid ${border}`,
                          color: "rgba(255,255,255,0.9)",
                          "& .MuiMenuItem-root": {
                            fontSize: 14,
                            "&.Mui-selected": {
                              backgroundColor: "rgba(34,211,238,0.18)",
                            },
                            "&.Mui-selected:hover": {
                              backgroundColor: "rgba(34,211,238,0.24)",
                            },
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="blocked">Blocked</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box
                mt={2}
                sx={{
                  ...glassCardSx,
                  borderRadius: 2,
                  p: 2,
                  background: "rgba(2, 6, 23, 0.25)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    mb: 1,
                    color: "rgba(226,232,240,0.75)",
                    fontWeight: 700,
                    letterSpacing: 0.2,
                  }}
                >
                  Profile Image
                </Typography>

                <Box
                  component="label"
                  htmlFor="image"
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
                  <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.88)" }}>
                    {image ? image.name : "Choose an image…"}
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
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    style={{ display: "none" }}
                  />
                </Box>
              </Box>

              <Box mt={3} display="flex" gap={2} flexWrap="wrap">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    minWidth: 140,
                    borderRadius: 2,
                    fontWeight: 800,
                    textTransform: "none",
                    background: `linear-gradient(90deg, ${accent} 0%, rgba(99,102,241,0.95) 100%)`,
                    boxShadow: "0 12px 30px rgba(34,211,238,0.18)",
                    "&:hover": {
                      background: `linear-gradient(90deg, rgba(34,211,238,0.95) 0%, rgba(99,102,241,0.9) 100%)`,
                    },
                    "&.Mui-disabled": {
                      background: "rgba(148,163,184,0.20)",
                      color: "rgba(255,255,255,0.55)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={20}
                      sx={{
                        color: "white",
                        "& .MuiCircularProgress-circle": { strokeLinecap: "round" },
                      }}
                    />
                  ) : (
                    "Update"
                  )}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate("/dashboard/users")}
                  sx={{
                    minWidth: 140,
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
                  Cancel
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
