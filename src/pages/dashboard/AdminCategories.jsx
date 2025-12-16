import React from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminCategories() {
  const navigate = useNavigate();

  const fetchCategories = async () => {
    const { data } = await AxiosUserInstance.get("/categories");
    return data.categories;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
  });

  const handleEdit = (id) => {
    navigate(`/dashboard/categories/update/${id}`);
  };

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await AxiosUserInstance.delete(`/categories/${id}`);
        console.log("Server response:", response.data);
        refetch();
      } catch (error) {
        console.error(
          "Failed to delete category:",
          error.response?.data || error.message
        );
        alert(
          "Failed to delete category: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Categories List
      </Typography>

      {isLoading && <CircularProgress />}
      {isError && (
        <Typography color="error">Failed to load categories</Typography>
      )}

      {!isLoading && data && (
        <Card className="mt-4">
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>SubCategories</TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>
                      {category.image?.secure_url ? (
                        <Avatar
                          src={category.image.secure_url}
                          alt={category.name}
                        />
                      ) : (
                        <Avatar>{category.name?.[0]}</Avatar>
                      )}
                    </TableCell>

                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>

                    <TableCell>
                      <Chip
                        label={category.status || "inactive"}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      {Array.isArray(category.subCategoryDetails) &&
                      category.subCategoryDetails.length > 0
                        ? category.subCategoryDetails.map((sub) => (
                            <Chip
                              key={sub._id}
                              label={sub.name}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(category._id)}
                      >
                        Edit
                      </Button>
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleRemove(category._id)}
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

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/dashboard/categories/create")}
        sx={{ mt: 2 }}
      >
        Create Category
      </Button>
    </Box>
  );
}
