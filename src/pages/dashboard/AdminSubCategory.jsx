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
      verticalAlign: "top",
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
  };

  const menuPaperSx = {
    mt: 1,
    backgroundColor: "rgba(2,6,23,0.95)",
    border: `1px solid ${border}`,
    color: "rgba(255,255,255,0.9)",
    "& .MuiMenuItem-root": {
      fontSize: 14,
      "&.Mui-selected": { backgroundColor: "rgba(34,211,238,0.18)" },
      "&.Mui-selected:hover": { backgroundColor: "rgba(34,211,238,0.24)" },
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

  const statusChipSx = (isActive) => ({
    borderRadius: 2,
    fontWeight: 800,
    color: isActive ? "rgba(34,197,94,0.95)" : "rgba(234,179,8,0.95)",
    backgroundColor: isActive ? "rgba(34,197,94,0.12)" : "rgba(234,179,8,0.12)",
    border: `1px solid ${
      isActive ? "rgba(34,197,94,0.26)" : "rgba(234,179,8,0.26)"
    }`,
  });

  const iconBtnSx = (active) => ({
    borderRadius: 2,
    border: `1px solid ${active ? "rgba(34,197,94,0.25)" : "rgba(234,179,8,0.25)"}`,
    backgroundColor: "rgba(2,6,23,0.20)",
    color: active ? "rgba(34,197,94,0.95)" : "rgba(234,179,8,0.95)",
    "&:hover": {
      backgroundColor: active ? "rgba(34,197,94,0.10)" : "rgba(234,179,8,0.10)",
    },
  });

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
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, letterSpacing: 0.2, lineHeight: 1.1 }}
            >
              SubCategories List
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: "rgba(226,232,240,0.7)" }}>
              Filter, activate/deactivate, edit and remove subcategories.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate("/dashboard/adminsubcategory/create")}
            sx={primaryBtnSx}
          >
            Create SubCategory
          </Button>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ mb: 2 }}
        >
          <TextField
            select
            label="Filter by Category"
            size="small"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            sx={{ minWidth: { xs: "100%", sm: 260 }, ...fieldSx }}
            SelectProps={{
              MenuProps: { PaperProps: { sx: menuPaperSx } },
            }}
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
            variant="outlined"
            onClick={() => setFilterCategory("")}
            sx={{ ...outlineBtnSx, minWidth: 140 }}
          >
            Clear Filter
          </Button>
        </Stack>

        {(loadingSubs || loadingCats) && (
          <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
            <CircularProgress sx={{ color: accent }} />
          </Box>
        )}

        {(errorSubs || errorCats) && (
          <Typography sx={{ color: "rgb(239,68,68)", mt: 2 }}>
            Failed to load data
          </Typography>
        )}

        {!loadingSubs && Array.isArray(filtered) && (
          <Card sx={glassCardSx}>
            <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
              <Box sx={{ overflowX: "auto" }}>
                <Table sx={tableSx}>
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
                        <TableCell sx={{ width: 72 }}>
                          {sub.image?.secure_url ? (
                            <Avatar
                              src={sub.image.secure_url}
                              alt={sub.name}
                              sx={{
                                width: 40,
                                height: 40,
                                border: "1px solid rgba(34,211,238,0.22)",
                                boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
                              }}
                            />
                          ) : (
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                background:
                                  "linear-gradient(90deg, rgba(34,211,238,0.35), rgba(99,102,241,0.30))",
                                border: "1px solid rgba(34,211,238,0.22)",
                                color: "rgba(255,255,255,0.92)",
                                fontWeight: 900,
                              }}
                            >
                              {sub.name?.[0]}
                            </Avatar>
                          )}
                        </TableCell>

                        <TableCell sx={{ fontWeight: 800 }}>
                          {sub.name}
                        </TableCell>

                        <TableCell sx={{ color: "rgba(226,232,240,0.65)" }}>
                          {sub.slug}
                        </TableCell>

                        <TableCell sx={{ color: "rgba(226,232,240,0.75)" }}>
                          {sub.category ? (
                            (Array.isArray(categories) &&
                              categories.find((c) => c._id === sub.category)?.name) ||
                            sub.category
                          ) : (
                            <Chip label="-" size="small" sx={{ opacity: 0.8 }} />
                          )}
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              label={sub.isActive ? "Active" : "Inactive"}
                              size="small"
                              sx={statusChipSx(sub.isActive)}
                            />

                            <Tooltip title={sub.isActive ? "Deactivate" : "Activate"}>
                              <IconButton
                                size="small"
                                onClick={() => handleToggleActive(sub)}
                                sx={iconBtnSx(sub.isActive)}
                              >
                                {sub.isActive ? <ToggleOnIcon /> : <ToggleOffIcon />}
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>

                        <TableCell sx={{ color: "rgba(226,232,240,0.65)" }}>
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
                            sx={{
                              ...primaryBtnSx,
                              minWidth: 96,
                              py: 0.55,
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
                            startIcon={<DeleteIcon />}
                            onClick={() => handleRemove(sub._id)}
                            sx={{
                              ...outlineBtnSx,
                              minWidth: 106,
                              py: 0.55,
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
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}
