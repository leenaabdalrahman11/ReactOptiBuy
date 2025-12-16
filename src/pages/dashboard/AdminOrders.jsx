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

  const STATUSES = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Orders — Admin Status
      </Typography>

      <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
        {STATUSES.map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "contained" : "outlined"}
            onClick={() => setStatusFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Button>
        ))}
        <Button variant="contained" onClick={() => refetch()}>
          Refresh
        </Button>
      </Box>

      {isLoading && <CircularProgress />}
      {isError && <Typography color="error">Failed to load orders</Typography>}

      {!isLoading && data && (
        <Card>
          <CardContent>
            <Table>
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
                    <TableCell>{order.userId?.userName || "Unknown"}</TableCell>
                    <TableCell>{order.finalPrice} ₪</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      {STATUSES.filter((s) => s !== order.status).map((s) => (
                        <Button
                          key={s}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                          variant="outlined"
                          onClick={() => handleChangeStatus(order._id, s)}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </Button>
                      ))}
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
