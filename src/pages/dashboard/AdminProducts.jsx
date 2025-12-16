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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const { data } = await AxiosUserInstance.get("/products");
    return data.products;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchProducts,
  });

  const handleEdit = (id) => {
    navigate(`/dashboard/products/update/${id}`);
  };
  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await AxiosUserInstance.delete(`/products/${id}`);
        console.log("Server response:", response.data);
        refetch();
      } catch (error) {
        console.error(
          "Failed to delete product:",
          error.response?.data || error.message
        );
        alert(
          "Failed to delete product: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Products List
      </Typography>

      {isLoading && <CircularProgress />}
      {isError && (
        <Typography color="error">Failed to load products</Typography>
      )}

      {!isLoading && data && (
        <Card className="mt-4">
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>SubCategory</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell>Edit</TableCell>

                  <TableCell>Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.CategoryId?.name}</TableCell>
                    <TableCell>{product.subCategoryId?.name || "-"}</TableCell>
                    <TableCell>{product.priceAfterDiscount} ₪</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.tags.join(", ")}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(product._id)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleRemove(product._id)}
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
        onClick={() => navigate("/dashboard/products/create")}
        sx={{ mb: 2 }}
      >
        Create Product
      </Button>
    </Box>
  );
}
