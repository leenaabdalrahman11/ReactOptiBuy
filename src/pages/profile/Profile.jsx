import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosUserInstance from "../../api/AxiosUserInstance";

export default function Profile() {
  const queryClient = useQueryClient();

  const fetchProfile = async () => {
    const res = await AxiosUserInstance.get("/users/profile");
    return res.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const user = data?.user;

  const [form, setForm] = useState({
    userName: "",
    phone: "",
    address: "",
    gender: "",
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      userName: user.userName || "",
      phone: user.phone || "",
      address: user.address || "",
      gender: user.gender || "",
    });
    setImageFile(null);
  }, [user?._id]);

  const updateProfile = async () => {
    const fd = new FormData();
    fd.append("userName", form.userName);
    fd.append("phone", form.phone);
    fd.append("address", form.address);
    fd.append("gender", form.gender);
    if (imageFile) fd.append("image", imageFile);

    const res = await AxiosUserInstance.put("/users/profile", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  };

  const {
    mutate,
    isPending,
    isError: isUpdateError,
    error: updateError,
    isSuccess,
  } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          {error?.response?.data?.message ||
            error?.message ||
            "Failed to load profile."}
        </Alert>
      </Container>
    );
  }

  const currentAvatar =
    user?.image?.secure_url ||
    "https://dummyimage.com/200x200/eee/aaa.png&text=User";

  return (
    <Container sx={{ py: 8 }}>
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #eef0f3",
            boxShadow: "0 18px 50px rgba(0,0,0,0.06)",
          }}
        >
          <Box
            sx={{
              height: 84,
              background:
                "linear-gradient(90deg, rgba(152,197,255,0.55) 0%, rgba(255,233,190,0.55) 60%, rgba(255,245,214,0.55) 100%)",
            }}
          />

          <CardContent sx={{ pt: 0 }}>
            <Box
              sx={{
                mt: -5,
                px: { xs: 1, sm: 2 },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={currentAvatar}
                  alt={user?.userName || "user"}
                  sx={{
                    width: 66,
                    height: 66,
                    border: "4px solid #fff",
                    boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
                  }}
                />
                <Box>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 18, lineHeight: 1.1 }}
                  >
                    {user?.userName || "-"}
                  </Typography>
                  <Typography sx={{ color: "#6b7280", fontSize: 13 }}>
                    {user?.email || "-"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ px: { xs: 1, sm: 2 }, mt: 2 }}>
              {isSuccess && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                  Profile updated successfully
                </Alert>
              )}

              {isUpdateError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {updateError?.response?.data?.message ||
                    updateError?.message ||
                    "Failed to update profile."}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2.3}>
                  <Grid item xs={12} md={6}>
                    <Typography sx={{ fontSize: 12, color: "#6b7280", mb: 0.8 }}>
                      Full Name
                    </Typography>
                    <TextField
                      name="userName"
                      value={form.userName}
                      onChange={handleChange}
                      fullWidth
                      placeholder="Your name"
                      variant="outlined"
                      InputProps={{
                        sx: {
                          height: 46,
                          borderRadius: 2,
                          background: "#f5f7fb",
                          "& fieldset": { borderColor: "#eef0f3" },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography sx={{ fontSize: 12, color: "#6b7280", mb: 0.8 }}>
                      Phone
                    </Typography>
                    <TextField
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      fullWidth
                      placeholder="+970..."
                      variant="outlined"
                      InputProps={{
                        sx: {
                          height: 46,
                          borderRadius: 2,
                          background: "#f5f7fb",
                          "& fieldset": { borderColor: "#eef0f3" },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography sx={{ fontSize: 12, color: "#6b7280", mb: 0.8 }}>
                      Address
                    </Typography>
                    <TextField
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      fullWidth
                      placeholder="Your address"
                      variant="outlined"
                      InputProps={{
                        sx: {
                          height: 46,
                          borderRadius: 2,
                          background: "#f5f7fb",
                          "& fieldset": { borderColor: "#eef0f3" },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography sx={{ fontSize: 12, color: "#6b7280", mb: 0.8 }}>
                      Gender
                    </Typography>

                    <TextField
                      select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      fullWidth
                      placeholder="Gender"
                      variant="outlined"
                      InputProps={{
                        sx: {
                          height: 46,
                          borderRadius: 2,
                          background: "#f5f7fb",
                          "& fieldset": { borderColor: "#eef0f3" },
                        },
                      }}
                    >
                      <MenuItem value="">Not set</MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mt: 1 }}>
                      <Typography sx={{ fontWeight: 800, mb: 1.2, fontSize: 13 }}>
                        My email Address
                      </Typography>

                      <Box
                        sx={{
                          borderRadius: 2,
                          border: "1px solid #eef0f3",
                          background: "#fff",
                          p: 1.2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1.2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 999,
                            background: "#eef2ff",
                            display: "grid",
                            placeItems: "center",
                            fontWeight: 900,
                            color: "#4f46e5",
                            fontSize: 12,
                          }}
                        >
                          @
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 800, fontSize: 13 }}>
                            {user?.email || "-"}
                          </Typography>
                          <Typography sx={{ color: "#9ca3af", fontSize: 11 }}>
                            {user?.createdAt ? new Date(user.createdAt).toDateString() : ""}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.2,
                        alignItems: "flex-end",
                      }}
                    >
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          height: 40,
                          px: 2.4,
                          fontWeight: 800,
                          borderColor: "#eef0f3",
                          background: "#fff",
                        }}
                      >
                        Upload Image
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        />
                      </Button>

                      <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>
                        {imageFile ? imageFile.name : "No file selected"}
                      </Typography>

                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isPending}
                        sx={{
                          mt: 0.5,
                          textTransform: "none",
                          borderRadius: 2,
                          height: 42,
                          px: 3,
                          fontWeight: 900,
                          boxShadow: "none",
                        }}
                      >
                        {isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
