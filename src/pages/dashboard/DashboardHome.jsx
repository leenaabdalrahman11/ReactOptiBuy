import React from "react";
import { useQuery } from "@tanstack/react-query";
import AxiosUserInstance from "../../api/AxiosUserInstance";
import { FormControlLabel, Checkbox } from "@mui/material";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Stack,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function DashboardHome() {
  const fetchSummary = async () => {
    const [usersRes, ordersRes, productsRes, revenueRes] = await Promise.all([
      AxiosUserInstance.get("/dashboard/users/count"),
      AxiosUserInstance.get("/dashboard/orders/count"),
      AxiosUserInstance.get("/dashboard/products/count"),
      AxiosUserInstance.get("/dashboard/orders/totalrevenue"),
    ]);

    console.log("totalrevenue response:", revenueRes.data);

    let revenueRaw =
      revenueRes.data?.totalRevenue ??
      revenueRes.data?.revenue ??
      revenueRes.data?.total ??
      revenueRes.data?.sum ??
      null;

    if (typeof revenueRaw === "object" && revenueRaw !== null) {
      const candidates = ["totalRevenue", "revenue", "total", "sum", "amount"];
      for (const key of candidates) {
        if (
          revenueRes.data[key] != null &&
          !isNaN(Number(revenueRes.data[key]))
        ) {
          revenueRaw = revenueRes.data[key];
          break;
        }
      }
    }

    let revenueNumber = 0;
    if (revenueRaw != null) {
      revenueNumber = Number(String(revenueRaw).replace(/[^0-9.-]+/g, "")) || 0;
    }

    if (revenueNumber === 0) {
      try {
        const { data: salesResp } = await AxiosUserInstance.get(
          "/dashboard/orders/sales"
        );
        const raw = Array.isArray(salesResp)
          ? salesResp
          : Array.isArray(salesResp.salesData)
          ? salesResp.salesData
          : Array.isArray(salesResp.data)
          ? salesResp.data
          : [];

        const sum = raw.reduce((acc, item) => {
          const v =
            Number(item?.sales ?? item?.amount ?? item?.total ?? 0) || 0;
          return acc + v;
        }, 0);

        if (sum > 0) {
          revenueNumber = sum;
          console.log(
            "Using fallback revenue sum from sales endpoint:",
            revenueNumber
          );
        }
      } catch (err) {
        console.warn(
          "Failed to fetch sales fallback:",
          err?.response?.data ?? err.message
        );
      }
    }

    return [
      {
        title: "Users",
        value: usersRes.data.count,
        icon: <PeopleIcon fontSize="large" />,
      },
      {
        title: "Orders",
        value: ordersRes.data.count,
        icon: <ShoppingCartIcon fontSize="large" />,
      },
      {
        title: "Products",
        value: productsRes.data.count,
        icon: <InventoryIcon fontSize="large" />,
      },
      {
        title: "Revenue",
        value: `$${revenueNumber}`,
        icon: <AttachMoneyIcon fontSize="large" />,
      },
    ];
  };

  const { data: summaryData = [], isLoading: summaryLoading } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: fetchSummary,
    refetchOnWindowFocus: false,
  });

  const fetchSalesData = async () => {
    const { data } = await AxiosUserInstance.get("/dashboard/orders/sales");
    console.log("kokoo", data);
    return data.salesData;
  };

  const { data: salesData = [], isLoading: salesLoading } = useQuery({
    queryKey: ["dashboardSales"],
    queryFn: fetchSalesData,
    refetchOnWindowFocus: false,
  });
  const fetchRecentOrders = async () => {
    const { data } = await AxiosUserInstance.get("/dashboard/orders/recent");
    return data.orders;
  };

  const { data: recentOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["dashboardRecentOrders"],
    queryFn: fetchRecentOrders,
    refetchOnWindowFocus: false,
  });

  if (summaryLoading || salesLoading || ordersLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} mb={3}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <Box sx={{ mr: 2 }}>{item.icon}</Box>
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="h5">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Sales Overview (This Week)
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#1976d2"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Orders
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{`$${order.amount}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}
