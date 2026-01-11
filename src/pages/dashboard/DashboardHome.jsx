import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AxiosUserInstance from "../../api/AxiosUserInstance";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Select,
  MenuItem,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
  Divider,
  Chip,
  TableContainer,
} from "@mui/material";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { TextField, IconButton } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useMutation, useQueryClient } from "@tanstack/react-query";
function KpiCard({ title, value, hint, icon, accent = "#7c3aed" }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid rgba(255,255,255,0.08)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
        backdropFilter: "blur(10px)",
        color: "#e5e7eb",
        overflow: "hidden",
        position: "relative",
        minHeight: 118,
      }}
    >
      <CardContent sx={{ p: 2.2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.6,
              display: "grid",
              placeItems: "center",
              background: `linear-gradient(135deg, ${accent}, rgba(255,255,255,0.12))`,
            }}
          >
            {icon}
          </Box>

          {hint ? (
            <Chip
              size="small"
              label={hint}
              sx={{
                bgcolor: "rgba(255,255,255,0.08)",
                color: "#e5e7eb",
                fontWeight: 800,
              }}
            />
          ) : null}
        </Box>

        <Typography sx={{ fontSize: 12, opacity: 0.9, fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 26, fontWeight: 950, mt: 0.3 }}>
          {value}
        </Typography>
      </CardContent>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(260px 120px at 20% 0%, rgba(124,58,237,0.22), transparent 60%)," +
            "radial-gradient(260px 120px at 80% 100%, rgba(34,211,238,0.12), transparent 60%)",
        }}
      />
    </Card>
  );
}

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: "#0b1220",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#e5e7eb",
        px: 1.3,
        py: 1,
        borderRadius: 2,
        boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
        minWidth: 140,
      }}
    >
      <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
        {payload[0].name}: {Number(payload[0].value ?? 0).toLocaleString()}
      </Typography>
      <Typography sx={{ fontSize: 11, opacity: 0.8 }}>{label}</Typography>
    </Box>
  );
}

export default function DashboardHomeV2() {
  const [range, setRange] = useState("year");
  const queryClient = useQueryClient();

  const fetchOverview = async () => {
    const { data } = await AxiosUserInstance.get(
      `/dashboard/overview?range=${range}`
    );
    return data;
  };

  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ["dash-overview", range],
    queryFn: fetchOverview,
    refetchOnWindowFocus: false,
  });

  const monthlyTarget = overview?.monthlyTarget ?? null;

  const monthKey = React.useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState("");

  React.useEffect(() => {
    if (monthlyTarget?.target != null) {
      setTargetInput(String(monthlyTarget.target));
    }
  }, [monthlyTarget?.target]);

  const updateTargetMutation = useMutation({
    mutationFn: async () => {
      const t = Number(targetInput);
      if (!Number.isFinite(t) || t < 0) throw new Error("Invalid target");

      const { data } = await AxiosUserInstance.put("/dashboard/target", {
        monthKey,
        target: t,
      });
      return data;
    },
    onSuccess: async () => {
      setIsEditingTarget(false);

      await queryClient.invalidateQueries({
        queryKey: ["dash-overview"],
        exact: false,
      });
    },
    onError: (err) => {
      console.log("UPDATE TARGET ERROR:", err);
      alert(err?.response?.data?.message || err.message);
    },
  });

  const fetchSales = async () => {
    const { data } = await AxiosUserInstance.get(
      `/dashboard/orders/sales?range=${range}`
    );
    return data.salesData ?? [];
  };
  const fetchTopFound = async () => {
    const { data } = await AxiosUserInstance.get(
      `/dashboard/analytics/top-found?limit=10`
    );
    return data.rows || [];
  };

  const fetchTopNotFound = async () => {
    const { data } = await AxiosUserInstance.get(
      `/dashboard/analytics/top-not-found?limit=10`
    );
    return data.rows || [];
  };

  const { data: topFound = [], isLoading: foundLoading } = useQuery({
    queryKey: ["dash-top-found"],
    queryFn: fetchTopFound,
    refetchOnWindowFocus: false,
  });

  const { data: topNotFound = [], isLoading: notFoundLoading } = useQuery({
    queryKey: ["dash-top-not-found"],
    queryFn: fetchTopNotFound,
    refetchOnWindowFocus: false,
  });

  const { data: salesData = [], isLoading: salesLoading } = useQuery({
    queryKey: ["dash-sales", range],
    queryFn: fetchSales,
    refetchOnWindowFocus: false,
  });

  const kpis = overview?.kpis ?? {};
  const recentOrders = overview?.recentOrders ?? [];

  const topCategories =
    (overview?.topCategories ?? []).map((x) => ({
      name: x.name,
      value: x.sales,
    })) ?? [];

  const xKey = range === "year" ? "month" : range === "month" ? "date" : "day";

  const statusData = useMemo(() => {
    const normalize = (s) =>
      String(s || "")
        .toLowerCase()
        .trim();
    let active = 0,
      complete = 0,
      hold = 0;

    for (const o of recentOrders) {
      const st = normalize(o.status);
      if (
        st.includes("complete") ||
        st.includes("delivered") ||
        st.includes("deliverd")
      )
        complete++;
      else if (st.includes("hold")) hold++;
      else active++;
    }

    return [
      { name: "Active", value: active },
      { name: "Complete", value: complete },
      { name: "On Hold", value: hold },
    ];
  }, [recentOrders]);

  if (overviewLoading || salesLoading) {
    return (
      <Box sx={{ minHeight: "65vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#070b14",
        color: "#e5e7eb",
        paddingTop: "1%",
        px: { xs: 2, md: 0 },
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            color: "white",
            flexDirection: "column",
            flexWrap: "wrap",
            alignContent: "center",
            alignItems: "center",
            gap: "2%",
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              width: { xs: "100%", md: "70%" },
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Grid item xs={12} sm={6} md={3} sx={{ width: { md: "20%" } }}>
              <KpiCard
                title="Total Sales"
                value={`$${Number(kpis?.revenue ?? 0).toLocaleString()}`}
                hint="+3.4%"
                accent="#22d3ee"
                icon={<PaymentsRoundedIcon />}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3} sx={{ width: { md: "20%" } }}>
              <KpiCard
                title="Total Orders"
                value={Number(kpis?.orders ?? 0).toLocaleString()}
                hint="-2.9%"
                accent="#7c3aed"
                icon={<ShoppingBagRoundedIcon />}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3} sx={{ width: { md: "20%" } }}>
              <KpiCard
                title="Total Visitors"
                value={Number(kpis?.visitors ?? 0).toLocaleString()}
                hint="+8.0%"
                accent="#10b981"
                icon={<VisibilityRoundedIcon />}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3} sx={{ width: { md: "20%" } }}>
              <KpiCard
                title="Active Users"
                value={Number(kpis?.users ?? 0).toLocaleString()}
                hint="+1.2%"
                accent="#f59e0b"
                icon={<PeopleAltRoundedIcon />}
              />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            sx={{
              width: { xs: "100%", md: "70%" },
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              paddingTop: "2%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: { xs: 2, md: "10%" },
                flexWrap: { xs: "wrap", md: "nowrap" },
              }}
            >
              <Grid
                item
                xs={12}
                lg={7}
                sx={{ width: { xs: "100%", md: "40%" } }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.08)",
                    bgcolor: "rgba(255,255,255,0.03)",
                  }}
                >
                  <CardContent sx={{ p: 2.4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        mb: 1.4,
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      <Box sx={{ fontWeight: 950, color: "white" }}>
                        <Typography>Revenue Analytics</Typography>
                        <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
                          Revenue trend for selected range
                        </Typography>
                      </Box>

                      <Chip
                        label={
                          range === "week"
                            ? "Last 7 Days"
                            : range === "month"
                            ? "Last 30 Days"
                            : "Last 12 Months"
                        }
                        sx={{
                          bgcolor: "rgba(124,58,237,0.16)",
                          border: "1px solid rgba(124,58,237,0.22)",
                          color: "#e5e7eb",
                          fontWeight: 850,
                        }}
                      />
                    </Box>

                    <Box sx={{ height: { xs: 260, sm: 320 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mb: 1,
                        }}
                      >
                        <Select
                          size="small"
                          value={range}
                          onChange={(e) => setRange(e.target.value)}
                          sx={{
                            color: "white",
                            ".MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(255,255,255,0.25)",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(255,255,255,0.45)",
                            },
                            ".MuiSvgIcon-root": { color: "white" },
                          }}
                        >
                          <MenuItem value="year">Last Year</MenuItem>
                          <MenuItem value="month">Last Month</MenuItem>
                          <MenuItem value="week">Last Week</MenuItem>
                        </Select>
                      </Box>

                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={salesData}
                          margin={{ top: 10, right: 12, left: -18, bottom: 40 }}
                        >
                          <defs>
                            <linearGradient
                              id="revFill"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#22d3ee"
                                stopOpacity={0.26}
                              />
                              <stop
                                offset="100%"
                                stopColor="#22d3ee"
                                stopOpacity={0.02}
                              />
                            </linearGradient>
                          </defs>

                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.08)"
                          />
                          <XAxis
                            dataKey={xKey}
                            stroke="rgba(229,231,235,0.7)"
                            tickMargin={10}
                            interval="preserveStartEnd"
                            minTickGap={18}
                          />
                          <YAxis stroke="rgba(229,231,235,0.7)" />
                          <Tooltip content={<DarkTooltip />} />

                          <Area
                            type="monotone"
                            dataKey="sales"
                            name="Revenue"
                            stroke="#22d3ee"
                            strokeWidth={2.5}
                            fill="url(#revFill)"
                            dot={false}
                            activeDot={{ r: 5 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid
                item
                xs={12}
                lg={5}
                sx={{
                  width: { xs: "100%", md: "40%" },
                  height: "80%",
                  color: "white",
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "center",
                }}
              >
                <Grid container spacing={2}>
                  {monthlyTarget && (
                    <Grid item xs={12}>
                      <Card
                        elevation={0}
                        sx={{
                          color: "white",
                          borderRadius: 4,
                          border: "1px solid rgba(255,255,255,0.08)",
                          bgcolor: "rgba(255,255,255,0.03)",
                        }}
                      >
                        <CardContent sx={{ p: 2.4 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 0.8,
                            }}
                          >
                            <Typography sx={{ fontWeight: 950 }}>
                              Monthly Target
                            </Typography>

                            {!isEditingTarget ? (
                              <IconButton
                                onClick={() => setIsEditingTarget(true)}
                                size="small"
                                sx={{ color: "rgba(255,255,255,0.8)" }}
                              >
                                <EditRoundedIcon fontSize="small" />
                              </IconButton>
                            ) : (
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                  onClick={() => updateTargetMutation.mutate()}
                                  disabled={updateTargetMutation.isPending}
                                >
                                  {updateTargetMutation.isPending
                                    ? "Saving..."
                                    : "Save"}
                                </Button>

                                <IconButton
                                  onClick={() => {
                                    setIsEditingTarget(false);
                                    setTargetInput(
                                      String(monthlyTarget?.target ?? "")
                                    );
                                  }}
                                  size="small"
                                  sx={{ color: "rgba(255,255,255,0.7)" }}
                                >
                                  <CloseRoundedIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Box>

                          <Typography
                            sx={{ fontSize: 12, opacity: 0.7, mb: 1.8 }}
                          >
                            Progress toward this month goal
                          </Typography>

                          <Typography
                            sx={{ fontSize: 30, fontWeight: 950, mb: 1 }}
                          >
                            {Math.round((monthlyTarget.progress ?? 0) * 100)}%
                          </Typography>

                          <LinearProgress
                            variant="determinate"
                            value={(monthlyTarget.progress ?? 0) * 100}
                            sx={{
                              height: 10,
                              borderRadius: 99,
                              bgcolor: "rgba(255,255,255,0.08)",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 99,
                                background:
                                  "linear-gradient(90deg, #7c3aed, #22d3ee)",
                              },
                            }}
                          />

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mt: 1.6,
                              gap: 2,
                              flexWrap: "wrap",
                            }}
                          >
                            <Box>
                              <Typography sx={{ fontSize: 11, opacity: 0.7 }}>
                                Target
                              </Typography>

                              {!isEditingTarget ? (
                                <Typography sx={{ fontWeight: 900 }}>
                                  $
                                  {Number(
                                    monthlyTarget.target ?? 0
                                  ).toLocaleString()}
                                </Typography>
                              ) : (
                                <TextField
                                  size="small"
                                  value={targetInput}
                                  onChange={(e) =>
                                    setTargetInput(e.target.value)
                                  }
                                  placeholder="Enter target"
                                  type="number"
                                  inputProps={{ min: 0 }}
                                  sx={{
                                    mt: 0.4,
                                    width: 160,
                                    "& .MuiOutlinedInput-root": {
                                      color: "white",
                                      "& fieldset": {
                                        borderColor: "rgba(255,255,255,0.25)",
                                      },
                                      "&:hover fieldset": {
                                        borderColor: "rgba(34,211,238,0.45)",
                                      },
                                    },
                                  }}
                                />
                              )}

                              {updateTargetMutation.isError && (
                                <Typography
                                  sx={{
                                    mt: 0.6,
                                    fontSize: 11,
                                    color: "rgb(239,68,68)",
                                  }}
                                >
                                  {updateTargetMutation.error?.message ||
                                    "Failed to update target"}
                                </Typography>
                              )}
                            </Box>

                            <Box>
                              <Typography sx={{ fontSize: 11, opacity: 0.7 }}>
                                Achieved
                              </Typography>
                              <Typography sx={{ fontWeight: 900 }}>
                                $
                                {Number(
                                  monthlyTarget.achieved ?? 0
                                ).toLocaleString()}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}

                  {topCategories.length > 0 && (
                    <Grid item xs={12}>
                      <Card
                        elevation={0}
                        sx={{
                          borderRadius: 4,
                          border: "1px solid rgba(255,255,255,0.08)",
                          bgcolor: "rgba(255,255,255,0.03)",
                        }}
                      >
                        <CardContent sx={{ p: 2.4 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography sx={{ fontWeight: 950 }}>
                              Top Categories
                            </Typography>
                            <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
                              See all
                            </Typography>
                          </Box>

                          <Box sx={{ height: 220 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={topCategories}
                                  dataKey="value"
                                  nameKey="name"
                                  innerRadius={62}
                                  outerRadius={92}
                                  paddingAngle={2}
                                >
                                  {[
                                    "#7c3aed",
                                    "#22d3ee",
                                    "#10b981",
                                    "#f59e0b",
                                  ].map((c, i) => (
                                    <Cell key={i} fill={c} />
                                  ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} />
                              </PieChart>
                            </ResponsiveContainer>
                          </Box>

                          <Divider
                            sx={{
                              borderColor: "rgba(255,255,255,0.08)",
                              my: 1.3,
                            }}
                          />

                          {topCategories.map((c) => (
                            <Box
                              key={c.name}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                py: 0.6,
                              }}
                            >
                              <Typography sx={{ fontSize: 13, opacity: 0.9 }}>
                                {c.name}
                              </Typography>
                              <Typography
                                sx={{ fontSize: 13, fontWeight: 900 }}
                              >
                                ${Number(c.value).toLocaleString()}
                              </Typography>
                            </Box>
                          ))}
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Box>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Card
                  elevation={0}
                  sx={{
                    flex: 1,
                    minWidth: 320,
                    color: "#ffff",
                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.08)",
                    bgcolor: "rgba(255,255,255,0.03)",
                  }}
                >
                  <CardContent sx={{ p: 2.4 }}>
                    <Typography sx={{ fontWeight: 950, mb: 0.6 }}>
                      Top Searches (Found)
                    </Typography>
                    <Typography sx={{ fontSize: 12, opacity: 0.7, mb: 1.6 }}>
                      Most searched queries that returned results
                    </Typography>

                    {foundLoading ? (
                      <LinearProgress
                        sx={{ bgcolor: "rgba(255,255,255,0.06)" }}
                      />
                    ) : (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  color: "rgba(229,231,235,0.75)",
                                  fontWeight: 900,
                                }}
                              >
                                Query
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "rgba(229,231,235,0.75)",
                                  fontWeight: 900,
                                }}
                              >
                                Count
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "rgba(229,231,235,0.75)",
                                  fontWeight: 900,
                                }}
                              >
                                Avg Results
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {topFound.map((r) => (
                              <TableRow key={r.qNorm} hover>
                                <TableCell
                                  sx={{ color: "#e5e7eb", fontWeight: 800 }}
                                >
                                  {r.examples?.[0] || r.qNorm}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    color: "rgba(229,231,235,0.85)",
                                    fontWeight: 900,
                                  }}
                                >
                                  {r.count}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    color: "rgba(229,231,235,0.85)",
                                    fontWeight: 900,
                                  }}
                                >
                                  {r.avgResults ?? "-"}
                                </TableCell>
                              </TableRow>
                            ))}
                            {topFound.length === 0 && (
                              <TableRow>
                                <TableCell
                                  colSpan={3}
                                  sx={{ color: "rgba(229,231,235,0.7)" }}
                                >
                                  No data yet
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </CardContent>
                </Card>

                <Card
                  elevation={0}
                  sx={{
                    flex: 1,
                    minWidth: 320,
                    color: "#ffff",

                    borderRadius: 4,
                    border: "1px solid rgba(255,255,255,0.08)",
                    bgcolor: "rgba(255,255,255,0.03)",
                  }}
                >
                  <CardContent sx={{ p: 2.4 }}>
                    <Typography sx={{ fontWeight: 950, mb: 0.6 }}>
                      Top Searches (Not Found)
                    </Typography>
                    <Typography sx={{ fontSize: 12, opacity: 0.7, mb: 1.6 }}>
                      Most searched queries with zero results (opportunities)
                    </Typography>

                    {notFoundLoading ? (
                      <LinearProgress
                        sx={{ bgcolor: "rgba(255,255,255,0.06)" }}
                      />
                    ) : (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                sx={{
                                  color: "rgba(229,231,235,0.75)",
                                  fontWeight: 900,
                                }}
                              >
                                Query
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "rgba(229,231,235,0.75)",
                                  fontWeight: 900,
                                }}
                              >
                                Count
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: "rgba(229,231,235,0.75)",
                                  fontWeight: 900,
                                }}
                              >
                                Last Seen
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {topNotFound.map((r) => (
                              <TableRow key={r.qNorm} hover>
                                <TableCell
                                  sx={{ color: "#e5e7eb", fontWeight: 800 }}
                                >
                                  {r.examples?.[0] || r.qNorm}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    color: "rgba(229,231,235,0.85)",
                                    fontWeight: 900,
                                  }}
                                >
                                  {r.count}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    color: "rgba(229,231,235,0.75)",
                                    fontWeight: 800,
                                  }}
                                >
                                  {r.lastAt
                                    ? new Date(r.lastAt).toLocaleDateString()
                                    : "-"}
                                </TableCell>
                              </TableRow>
                            ))}
                            {topNotFound.length === 0 && (
                              <TableRow>
                                <TableCell
                                  colSpan={3}
                                  sx={{ color: "rgba(229,231,235,0.7)" }}
                                >
                                  No data yet
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            <Grid item xs={12} sx={{ color: "white" }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid rgba(255,255,255,0.08)",
                  bgcolor: "rgba(255,255,255,0.03)",
                  color: "white",
                }}
              >
                <CardContent sx={{ p: 2.4 }}>
                  <Typography sx={{ fontWeight: 950, mb: 1.6 }}>
                    Recent Orders
                  </Typography>

                  <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                    <Table sx={{ minWidth: 760 }}>
                      <TableHead>
                        <TableRow>
                          {["ID", "Customer", "Date", "Amount", "Status"].map(
                            (h) => (
                              <TableCell
                                key={h}
                                sx={{
                                  color: "rgba(229,231,235,0.75)",
                                  fontWeight: 900,
                                }}
                              >
                                {h}
                              </TableCell>
                            )
                          )}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {recentOrders.map((o, idx) => {
                          const st = String(o.status || "").toLowerCase();
                          const dot =
                            st.includes("complete") ||
                            st.includes("delivered") ||
                            st.includes("deliverd")
                              ? "#10b981"
                              : st.includes("hold")
                              ? "#f59e0b"
                              : "#22d3ee";

                          return (
                            <TableRow key={o.id ?? idx} hover>
                              <TableCell
                                sx={{ fontWeight: 900, color: "#e5e7eb" }}
                              >
                                {o.id}
                              </TableCell>

                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.2,
                                  }}
                                >
                                  <Avatar
                                    src={o.image || undefined}
                                    sx={{
                                      width: 34,
                                      height: 34,
                                      bgcolor: "#7c3aed",
                                    }}
                                  >
                                    {(o.customer || "U")
                                      .slice(0, 1)
                                      .toUpperCase()}
                                  </Avatar>

                                  <Typography
                                    sx={{ fontWeight: 900, color: "#e5e7eb" }}
                                  >
                                    {o.customer}
                                  </Typography>
                                </Box>
                              </TableCell>

                              <TableCell
                                sx={{
                                  color: "rgba(229,231,235,0.75)",
                                  fontWeight: 700,
                                }}
                              >
                                {o.date || "-"}
                              </TableCell>

                              <TableCell
                                sx={{ fontWeight: 950, color: "#e5e7eb" }}
                              >
                                ${Number(o.amount || 0).toFixed(2)}
                              </TableCell>

                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 9,
                                      height: 9,
                                      borderRadius: "50%",
                                      bgcolor: dot,
                                    }}
                                  />
                                  <Typography
                                    sx={{ fontWeight: 850, color: "#e5e7eb" }}
                                  >
                                    {o.status}
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Divider
                    sx={{ borderColor: "rgba(255,255,255,0.08)", mt: 2 }}
                  />

                  <Box
                    sx={{ display: "flex", gap: 2, mt: 1.6, flexWrap: "wrap" }}
                  >
                    <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
                      Sale status (from recent orders):
                    </Typography>

                    {statusData.map((s) => (
                      <Chip
                        key={s.name}
                        label={`${s.name}: ${s.value}`}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#e5e7eb",
                          fontWeight: 850,
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
