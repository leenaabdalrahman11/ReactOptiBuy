import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosInstance from "../../api/AxiosInstance";
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
  });

  const user = data?.user;

  const [form, setForm] = useState({
    userName: "",
    phone: "",
    address: "",
    gender: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useMemo(() => {
    if (user) {
      setForm({
        userName: user.userName || "",
        phone: user.phone || "",
        address: user.address || "",
        gender: user.gender || "",
      });
      setImageFile(null);
    }
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

  if (isLoading) return <CircularProgress />;
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
    <Container sx={{ py: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={1} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={1.5}
              >
                <Box>
                  <Avatar
                    src={currentAvatar}
                    alt={user?.userName || "user"}
                    sx={{ width: 120, height: 120 }}
                  />
                  <Typography variant="h6">{user?.userName || "-"}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email || "-"}
                  </Typography>

                  <Divider sx={{ width: "100%", my: 2 }} />
                </Box>

                <Box width="100%">
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Phone: <b>{user?.phone || "-"}</b>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Address: <b>{user?.address || "-"}</b>
                  </Typography>
                  <Typography variant="body2">
                    Gender: <b>{user?.gender || "-"}</b>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card elevation={1} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Edit Profile
              </Typography>

              {isSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Profile updated successfully
                </Alert>
              )}

              {isUpdateError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {updateError?.response?.data?.message ||
                    updateError?.message ||
                    "Failed to update profile."}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="User Name"
                      name="userName"
                      value={form.userName}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Gender"
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      fullWidth
                      placeholder="male / female"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ height: "56px" }}
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) =>
                          setImageFile(e.target.files?.[0] || null)
                        }
                      />
                    </Button>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 0.5 }}
                    >
                      {imageFile ? imageFile.name : "No file selected"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isPending}
                      sx={{ borderRadius: 2 }}
                    >
                      {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
