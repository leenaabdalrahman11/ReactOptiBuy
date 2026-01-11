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
  Chip,
  TableContainer,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UsersList() {
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const { data } = await AxiosUserInstance.get("/users");
    return data.users;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
  });

  const handleEdit = (id) => {
    navigate(`/dashboard/users/${id}`);
  };

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await AxiosUserInstance.delete(`/users/${id}`);
        refetch();
      } catch (error) {
        console.error(
          "Failed to delete user:",
          error.response?.data || error.message
        );
        alert(
          "Failed to delete user: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const cardSx = {
    borderRadius: 4,
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
    backdropFilter: "blur(10px)",
    color: "#e5e7eb",
    overflow: "hidden",
  };

  const headCellSx = {
    color: "rgba(229,231,235,0.75)",
    fontWeight: 900,
    borderColor: "rgba(255,255,255,0.08)",
    whiteSpace: "nowrap",
  };

  const bodyCellSx = {
    color: "#e5e7eb",
    borderColor: "rgba(255,255,255,0.06)",
    whiteSpace: "nowrap",
  };

  const getStatusChip = (status) => {
    const s = String(status || "").toLowerCase();

    const isActive =
      s.includes("active") || s.includes("enabled") || s.includes("online");
    const isBlocked =
      s.includes("blocked") || s.includes("banned") || s.includes("disabled");

    const label = status || "-";

    if (isBlocked) {
      return (
        <Chip
          size="small"
          label={label}
          sx={{
            bgcolor: "rgba(239,68,68,0.14)",
            border: "1px solid rgba(239,68,68,0.28)",
            color: "#fecaca",
            fontWeight: 900,
          }}
        />
      );
    }
    if (isActive) {
      return (
        <Chip
          size="small"
          label={label}
          sx={{
            bgcolor: "rgba(16,185,129,0.14)",
            border: "1px solid rgba(16,185,129,0.28)",
            color: "#bbf7d0",
            fontWeight: 900,
          }}
        />
      );
    }
    return (
      <Chip
        size="small"
        label={label}
        sx={{
          bgcolor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
          color: "rgba(229,231,235,0.9)",
          fontWeight: 900,
        }}
      />
    );
  };

  const getRoleChip = (role) => {
    const r = String(role || "").toLowerCase();
    const isAdmin = r.includes("admin");
    return (
      <Chip
        size="small"
        label={role || "-"}
        sx={{
          bgcolor: isAdmin ? "rgba(124,58,237,0.16)" : "rgba(34,211,238,0.12)",
          border: isAdmin
            ? "1px solid rgba(124,58,237,0.28)"
            : "1px solid rgba(34,211,238,0.22)",
          color: "#e5e7eb",
          fontWeight: 900,
        }}
      />
    );
  };

  return (
    <Box
  sx={{
    minHeight: "100vh",
    bgcolor: "#070b14", 
    color: "#e5e7eb",
    p: 3,
  }}
>
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 950, fontSize: 20 }}>
            Users List
          </Typography>
          <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
            Manage users, roles, and statuses
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/users/create")}
          sx={{
            textTransform: "none",
            fontWeight: 900,
            borderRadius: 2.5,
            px: 2.2,
            height: 40,
            background: "linear-gradient(90deg, #7c3aed, #22d3ee)",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
            },
          }}
        >
          Create User
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ minHeight: "35vh", display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {isError && (
        <Typography color="error">Failed to load users</Typography>
      )}

      {!isLoading && data && (
        <Card elevation={0} sx={cardSx}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 2.2 }}>
              <Typography sx={{ fontWeight: 950, fontSize: 14 }}>
                Users
              </Typography>
              <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
                Total: {data.length}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

            <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
              <Table sx={{ minWidth: 1050 }}>
                <TableHead>
                  <TableRow>
                    {[
                      "User Name",
                      "Email",
                      "Phone",
                      "Address",
                      "Gender",
                      "Role",
                      "Status",
                      "Edit",
                      "Remove",
                    ].map((h) => (
                      <TableCell key={h} sx={headCellSx}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.map((user) => (
                    <TableRow
                      key={user._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.03)",
                        },
                      }}
                    >
                      <TableCell sx={{ ...bodyCellSx, fontWeight: 900 }}>
                        {user.userName}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellSx, opacity: 0.9 }}>
                        {user.email}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>{user.phone || "-"}</TableCell>
                      <TableCell sx={bodyCellSx}>
                        {user.address || "-"}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        {user.gender || "-"}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        {getRoleChip(user.role)}
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        {getStatusChip(user.status)}
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Button
                          size="small"
                          onClick={() => handleEdit(user._id)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 900,
                            borderRadius: 2,
                            px: 1.6,
                            color: "#e5e7eb",
                            border: "1px solid rgba(34,211,238,0.30)",
                            bgcolor: "rgba(34,211,238,0.08)",
                            "&:hover": {
                              bgcolor: "rgba(34,211,238,0.14)",
                            },
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>

                      <TableCell sx={bodyCellSx}>
                        <Button
                          size="small"
                          onClick={() => handleRemove(user._id)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 900,
                            borderRadius: 2,
                            px: 1.6,
                            color: "#fecaca",
                            border: "1px solid rgba(239,68,68,0.30)",
                            bgcolor: "rgba(239,68,68,0.10)",
                            "&:hover": {
                              bgcolor: "rgba(239,68,68,0.16)",
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
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
