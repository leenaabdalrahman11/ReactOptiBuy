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

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = React.useState("pending");

  const fetchOrders = async () => {
    const { data } = await AxiosUserInstance.get(`/order/${statusFilter}`);
    return data.orders;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-orders", statusFilter],
    queryFn: fetchOrders,
  });

  const handleChangeStatus = async (orderId, newStatus) => {
    if (
      window.confirm(`Are you sure you want to change status to ${newStatus}?`)
    ) {
      try {
        await AxiosUserInstance.patch(`/order/changeStatus/${orderId}`, {
          status: newStatus,
        });
        refetch();
      } catch (error) {
        console.error(
          "Failed to change status:",
          error.response?.data || error.message
        );
        alert(
          "Failed to change status: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const STATUSES = ["pending", "processing", "confirmed", "delivered", "cancelled"];

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
    "&.Mui-disabled": {
      background: "rgba(148,163,184,0.20)",
      color: "rgba(255,255,255,0.55)",
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

  const selectedFilterBtnSx = {
    ...primaryBtnSx,
    boxShadow: "0 16px 40px rgba(34,211,238,0.20)",
  };

  const statusPillSx = (status) => {
    const map = {
      pending: { c: "rgba(234,179,8,0.95)", b: "rgba(234,179,8,0.24)", bg: "rgba(234,179,8,0.10)" },
      processing: { c: "rgba(59,130,246,0.95)", b: "rgba(59,130,246,0.24)", bg: "rgba(59,130,246,0.10)" },
      shipped: { c: "rgba(168,85,247,0.95)", b: "rgba(168,85,247,0.24)", bg: "rgba(168,85,247,0.10)" },
      delivered: { c: "rgba(34,197,94,0.95)", b: "rgba(34,197,94,0.24)", bg: "rgba(34,197,94,0.10)" },
      cancelled: { c: "rgba(239,68,68,0.95)", b: "rgba(239,68,68,0.24)", bg: "rgba(239,68,68,0.10)" },
    };
    const t = map[status] || { c: "rgba(226,232,240,0.8)", b: border, bg: "rgba(2,6,23,0.15)" };
    return {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      px: 1.2,
      py: 0.5,
      borderRadius: 999,
      border: `1px solid ${t.b}`,
      backgroundColor: t.bg,
      color: t.c,
      fontWeight: 900,
      fontSize: 12,
      textTransform: "capitalize",
      letterSpacing: 0.2,
    };
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
              Orders — Admin Status
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: "rgba(226,232,240,0.7)" }}>
              Filter orders by status and update them quickly.
            </Typography>
          </Box>

          <Button variant="contained" onClick={() => refetch()} sx={primaryBtnSx}>
            Refresh
          </Button>
        </Box>

        <Box
          sx={{
            mb: 2,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {STATUSES.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "contained" : "outlined"}
              onClick={() => setStatusFilter(s)}
              sx={statusFilter === s ? selectedFilterBtnSx : outlineBtnSx}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </Box>

        {isLoading && (
          <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
            <CircularProgress sx={{ color: accent }} />
          </Box>
        )}

        {isError && (
          <Typography sx={{ color: "rgb(239,68,68)", mt: 2 }}>
            Failed to load orders
          </Typography>
        )}

        {!isLoading && data && (
          <Card sx={glassCardSx}>
            <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
              <Box sx={{ overflowX: "auto" }}>
                <Table sx={tableSx}>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Change Status</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {data.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell sx={{ fontWeight: 800 }}>
                          {order.userId?.userName || "Unknown"}
                        </TableCell>

                        <TableCell sx={{ color: "rgba(226,232,240,0.85)", fontWeight: 800 }}>
                          {order.finalPrice} ₪
                        </TableCell>

                        <TableCell>
                          <Box sx={statusPillSx(order.status)}>
                            {order.status}
                          </Box>
                        </TableCell>

                        <TableCell>
                          {STATUSES.filter((s) => s !== order.status).map((s) => (
                            <Button
                              key={s}
                              size="small"
                              variant="outlined"
                              onClick={() => handleChangeStatus(order._id, s)}
                              sx={{
                                ...outlineBtnSx,
                                mr: 1,
                                mb: 1,
                                fontSize: 12,
                                py: 0.5,
                              }}
                            >
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </Button>
                          ))}
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
