import React from "react";
import { useQuery } from "@tanstack/react-query";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import { TextField, MenuItem } from "@mui/material";
import { useMemo, useState } from "react";

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
const [search, setSearch] = useState("");


  const fetchProducts = async () => {
    const { data } = await AxiosUserInstance.get("/products");
    return data.products;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchProducts,
  });
const filteredProducts = useMemo(() => {
  if (!data) return [];

  return data.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
}, [data, search]);
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

  const tableSx = {
    "& .MuiTableCell-root": {
      borderBottom: `1px solid rgba(148, 163, 184, 0.10)`,
      color: "rgba(255,255,255,0.86)",
      fontSize: 13,
      py: 1.2,
    },
    "& .MuiTableHead-root .MuiTableCell-root": {
      color: "rgba(226,232,240,0.8)",
      fontWeight: 800,
      fontSize: 12,
      letterSpacing: 0.25,
      textTransform: "uppercase",
      backgroundColor: "rgba(2, 6, 23, 0.35)",
    },
    "& .MuiTableRow-root:hover .MuiTableCell-root": {
      backgroundColor: "rgba(34, 211, 238, 0.06)",
    },
  };

  const primaryBtnSx = {
    borderRadius: 2,
    fontWeight: 800,
    textTransform: "none",
    background: `linear-gradient(90deg, ${accent} 0%, rgba(99,102,241,0.95) 100%)`,
    boxShadow: "0 12px 30px rgba(34,211,238,0.18)",
    "&:hover": {
      background: `linear-gradient(90deg, rgba(34,211,238,0.95) 0%, rgba(99,102,241,0.9) 100%)`,
    },
  };

  const outlineBtnSx = {
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
  };

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
      
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 1200, mx: "auto" }}>
<Box
  sx={{
    mb: 2,
    p: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    flexWrap: "wrap",
    borderRadius: 2,
    background: "rgba(2,6,23,0.35)",
    border: "1px solid rgba(148,163,184,0.12)",
    backdropFilter: "blur(8px)",
  }}
>
  <TextField
    size="small"
    placeholder="Search product..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    sx={{
      minWidth: 260,
      "& .MuiInputBase-root": {
        color: "white",
        background: "rgba(15,23,42,0.6)",
        borderRadius: 2,
      },
    }}
  />

  <Box sx={{ display: "flex", gap: 1 }}>
    <Button
      variant="outlined"
      onClick={() => setSearch("")}
      sx={outlineBtnSx}
    >
      Clear
    </Button>

    <Button
      variant="contained"
      onClick={() => navigate("/dashboard/products/create")}
      sx={primaryBtnSx}
    >
      Create Product
    </Button>
  </Box>
</Box>



        {isLoading && (
          <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
            <CircularProgress
              sx={{
                color: accent,
                "& .MuiCircularProgress-circle": { strokeLinecap: "round" },
              }}
            />
          </Box>
        )}

        {isError && (
          <Typography sx={{ color: "rgb(239,68,68)", mt: 2 }}>
            Failed to load products
          </Typography>
        )}

        {!isLoading && data && (
          <Card sx={glassCardSx}>
            <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
              <Box sx={{ overflowX: "auto" }}>
                <Table sx={tableSx}>
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
                    {filteredProducts.map((product) => (

                      <TableRow key={product._id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.CategoryId?.name}</TableCell>
                        <TableCell>{product.subCategoryId?.name || "-"}</TableCell>
                        <TableCell>{product.priceAfterDiscount} ₪</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          {Array.isArray(product.tags) ? product.tags.join(", ") : ""}
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleEdit(product._id)}
                            sx={{
                              ...primaryBtnSx,
                              minWidth: 88,
                              py: 0.6,
                              fontSize: 12,
                              boxShadow: "none",
                            }}
                          >
                            Edit
                          </Button>
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleRemove(product._id)}
                            sx={{
                              ...outlineBtnSx,
                              minWidth: 88,
                              py: 0.6,
                              fontSize: 12,
                              borderColor: "rgba(239,68,68,0.35)",
                              "&:hover": {
                                borderColor: "rgba(239,68,68,0.55)",
                                backgroundColor: "rgba(239,68,68,0.10)",
                              },
                            }}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  pt: 2,
                  borderTop: `1px solid rgba(148, 163, 184, 0.10)`,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => refetch()}
                  sx={outlineBtnSx}
                >
                  Refresh
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}
