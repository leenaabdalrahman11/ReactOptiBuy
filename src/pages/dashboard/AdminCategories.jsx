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
import { Snackbar, Alert } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function AdminCategories() {
  const navigate = useNavigate();
const [toast, setToast] = React.useState({
  open: false,
  msg: "",
  severity: "success",
});
const [confirmOpen, setConfirmOpen] = React.useState(false);
const [pendingId, setPendingId] = React.useState(null);

const openConfirm = (id) => {
  setPendingId(id);
  setConfirmOpen(true);
};

const closeConfirm = () => {
  setConfirmOpen(false);
  setPendingId(null);
};

const showToast = (msg, severity = "success") => {
  setToast((t) => ({ ...t, open: false }));
  setTimeout(() => {
    setToast({ open: true, msg, severity });
  }, 0);
};


const closeToast = (_, reason) => {
  if (reason === "clickaway") return;
  setToast((t) => ({ ...t, open: false }));
};

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
  try {
    const response = await AxiosUserInstance.delete(`/categories/${id}`);
    console.log("Server response:", response.data);
    refetch();
    showToast("Category deleted ✅", "success");
  } catch (error) {
    console.error("Failed to delete category:", error.response?.data || error.message);
    showToast(
      "Failed to delete category: " + (error.response?.data?.message || error.message),
      "error"
    );
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

  const statusChipSx = (status) => {
    const s = (status || "inactive").toLowerCase();
    const isActive = s === "active";
    const isBlocked = s === "blocked";
    const isInactive = !isActive && !isBlocked;

    let color = "rgba(148,163,184,0.75)";
    let bgc = "rgba(148,163,184,0.12)";
    let bdc = "rgba(148,163,184,0.22)";

    if (isActive) {
      color = "rgba(34,197,94,0.95)";
      bgc = "rgba(34,197,94,0.12)";
      bdc = "rgba(34,197,94,0.26)";
    } else if (isBlocked) {
      color = "rgba(239,68,68,0.95)";
      bgc = "rgba(239,68,68,0.12)";
      bdc = "rgba(239,68,68,0.26)";
    } else if (isInactive) {
      color = "rgba(234,179,8,0.95)";
      bgc = "rgba(234,179,8,0.12)";
      bdc = "rgba(234,179,8,0.26)";
    }

    return {
      borderRadius: 2,
      fontWeight: 800,
      textTransform: "capitalize",
      color,
      backgroundColor: bgc,
      border: `1px solid ${bdc}`,
    };
  };

  const subChipSx = {
    borderRadius: 2,
    fontSize: 12,
    fontWeight: 700,
    color: "rgba(255,255,255,0.88)",
    backgroundColor: "rgba(34,211,238,0.10)",
    border: "1px solid rgba(34,211,238,0.20)",
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
     <Dialog
  open={confirmOpen}
  onClose={closeConfirm}
  PaperProps={{
    sx: {
      borderRadius: 3,
      background: "rgba(15, 23, 42, 0.9)",
      border: "1px solid rgba(148, 163, 184, 0.18)",
      boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
      backdropFilter: "blur(10px)",
      color: "rgba(255,255,255,0.9)",
      minWidth: { xs: "92vw", sm: 460 },
    },
  }}
>
  <DialogTitle sx={{ fontWeight: 900, pb: 1 }}>
    Confirm delete
  </DialogTitle>

  <DialogContent sx={{ color: "rgba(226,232,240,0.75)" }}>
    Are you sure you want to delete this category?
  </DialogContent>

  <DialogActions sx={{ p: 2, gap: 1 }}>
    <Button
      onClick={closeConfirm}
      variant="outlined"
      sx={outlineBtnSx}
    >
      Cancel
    </Button>

    <Button
      onClick={() => {
        if (!pendingId) return;
        closeConfirm();
        handleRemove(pendingId);
      }}
      variant="contained"
      sx={{
        ...primaryBtnSx,
        background: "linear-gradient(90deg, rgba(239,68,68,0.95), rgba(244,63,94,0.9))",
        "&:hover": {
          background: "linear-gradient(90deg, rgba(239,68,68,0.9), rgba(244,63,94,0.85))",
        },
      }}
    >
      OK
    </Button>
  </DialogActions>
</Dialog>
 
<Snackbar
  open={toast.open}
  autoHideDuration={2400}
  onClose={closeToast}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
  disablePortal={false}
  container={() => document.body}
  sx={{ zIndex: 9999999 }}
>
  <Alert
    onClose={closeToast}
    severity={toast.severity}
    variant="filled"
    sx={{
      borderRadius: 2,
      fontWeight: 800,
      boxShadow: "0 12px 30px rgba(0,0,0,0.14)",
      minWidth: { xs: "92vw", sm: 460 },
    }}
  >
    {toast.msg}
  </Alert>
</Snackbar>

      
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
              Categories List
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: "rgba(226,232,240,0.7)" }}>
              Manage categories & subcategories (same logic, dashboard theme styling).
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate("/dashboard/categories/create")}
            sx={primaryBtnSx}
          >
            Create Category
          </Button>
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
            Failed to load categories
          </Typography>
        )}

        {!isLoading && data && (
          <Card sx={glassCardSx}>
            <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
              <Box sx={{ overflowX: "auto" }}>
                <Table sx={tableSx}>
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
                        <TableCell sx={{ width: 72 }}>
                          {category.image?.secure_url ? (
                            <Avatar
                              src={category.image.secure_url}
                              alt={category.name}
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
                              {category.name?.[0]}
                            </Avatar>
                          )}
                        </TableCell>

                        <TableCell sx={{ fontWeight: 800 }}>
                          {category.name}
                        </TableCell>

                        <TableCell sx={{ color: "rgba(226,232,240,0.65)" }}>
                          {category.slug}
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={category.status || "inactive"}
                            size="small"
                            sx={statusChipSx(category.status)}
                          />
                        </TableCell>

                        <TableCell sx={{ minWidth: 260 }}>
                          {Array.isArray(category.subCategoryDetails) &&
                          category.subCategoryDetails.length > 0 ? (
                            category.subCategoryDetails.map((sub) => (
                              <Chip
                                key={sub._id}
                                label={sub.name}
                                size="small"
                                sx={{ ...subChipSx, mr: 0.5, mb: 0.5 }}
                              />
                            ))
                          ) : (
                            <Typography sx={{ color: "rgba(226,232,240,0.55)" }}>
                              -
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleEdit(category._id)}
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
                            onClick={() => openConfirm(category._id)}
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
                
                <Button variant="outlined" onClick={() => refetch()} sx={outlineBtnSx}>
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
