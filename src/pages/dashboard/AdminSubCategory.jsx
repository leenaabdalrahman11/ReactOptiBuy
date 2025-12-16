import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Button,
  Avatar,
  Chip,
  MenuItem,
  TextField,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AdminSubCategories() {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState("");

  const fetchSubCategories = async () => {
    const { data } = await AxiosUserInstance.get("/subcategory");
    return data.subCategories || data;
  };

  const fetchCategories = async () => {
    const { data } = await AxiosUserInstance.get("/categories");
    return data.categories || data;
  };

  const {
    data: subCategories,
    isLoading: loadingSubs,
    isError: errorSubs,
    refetch: refetchSubs,
  } = useQuery({
    queryKey: ["admin-subcategories"],
    queryFn: fetchSubCategories,
  });

  const {
    data: categories,
    isLoading: loadingCats,
    isError: errorCats,
  } = useQuery({ queryKey: ["admin-categories"], queryFn: fetchCategories });

  const handleEdit = (id) => {
    navigate(`/dashboard/subcategories/update/${id}`);
  };

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        const response = await AxiosUserInstance.delete(`/subcategory/${id}`);
        console.log("Server response:", response.data);
        refetchSubs();
      } catch (error) {
        console.error(
          "Failed to delete subcategory:",
          error.response?.data || error.message
        );
        alert(
          "Failed to delete subcategory: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const handleToggleActive = async (sub) => {
    try {
      const response = await AxiosUserInstance.put(`/subcategory/${sub._id}`, {
        ...sub,
        isActive: !sub.isActive,
      });
      console.log("toggle response:", response.data);
      refetchSubs();
    } catch (error) {
      console.error(
        "Failed to toggle active:",
        error.response?.data || error.message
      );
      alert(
        "Failed to toggle active: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const filtered = Array.isArray(subCategories)
    ? subCategories.filter((s) =>
        filterCategory ? s.category === filterCategory : true
      )
    : [];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        SubCategories List
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ my: 2 }}>
        <TextField
          select
          label="Filter by Category"
          size="small"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          sx={{ minWidth: 240 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {Array.isArray(categories) &&
            categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
        </TextField>

        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/adminsubcategory/create")}
        >
          Create SubCategory
        </Button>
      </Stack>

      {(loadingSubs || loadingCats) && <CircularProgress />}
      {(errorSubs || errorCats) && (
        <Typography color="error">Failed to load data</Typography>
      )}

      {!loadingSubs && Array.isArray(filtered) && (
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((sub) => (
                  <TableRow key={sub._id}>
                    <TableCell>
                      {sub.image?.secure_url ? (
                        <Avatar src={sub.image.secure_url} alt={sub.name} />
                      ) : (
                        <Avatar>{sub.name?.[0]}</Avatar>
                      )}
                    </TableCell>

                    <TableCell>{sub.name}</TableCell>
                    <TableCell>{sub.slug}</TableCell>

                    <TableCell>
                      {sub.category ? (
                        (Array.isArray(categories) &&
                          categories.find((c) => c._id === sub.category)
                            ?.name) ||
                        sub.category
                      ) : (
                        <Chip label="-" size="small" />
                      )}
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={sub.isActive ? "Active" : "Inactive"}
                          variant="outlined"
                          size="small"
                        />

                        <Tooltip
                          title={sub.isActive ? "Deactivate" : "Activate"}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleToggleActive(sub)}
                          >
                            {sub.isActive ? (
                              <ToggleOnIcon />
                            ) : (
                              <ToggleOffIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {sub.createdAt
                        ? new Date(sub.createdAt).toLocaleString()
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(sub._id)}
                      >
                        Edit
                      </Button>
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleRemove(sub._id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
