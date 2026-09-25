import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CategoryIcon from "@mui/icons-material/Category";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate } from "react-router-dom";

// ✅ AdminTopbar import
import AdminTopbar from "../Component/AdminTopbar";

const API_BASE_URL = "http://localhost:8080/ecomapp";

interface AdminOrder {
  order_id: number;
  status: string;
  total_amount: number | string;
  address?: string;
  city?: string;
  pincode?: string;
  created_at?: string;
}

interface DashboardData {
  users: number;
  products: number;
  orders: number;
  categories: number;
}

interface OrderSummary {
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] =
    useState<DashboardData>({
      users: 0,
      products: 0,
      orders: 0,
      categories: 0,
    });

  const [orderSummary, setOrderSummary] =
    useState<OrderSummary>({
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0,
    });

  const [recentOrders, setRecentOrders] =
    useState<AdminOrder[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // =========================
      // USERS
      // =========================

      let usersCount = 0;

      try {
        const userResponse = await axios.get(
          `${API_BASE_URL}/admin/users`,
          { headers }
        );

        if (Array.isArray(userResponse.data)) {
          usersCount = userResponse.data.length;
        }
      } catch (userError) {
        console.error("Users API Error:", userError);
      }

      // =========================
      // PRODUCTS
      // =========================

      let productsCount = 0;

      try {
        const productResponse = await axios.get(
          `${API_BASE_URL}/product/all`,
          { headers }
        );

        if (Array.isArray(productResponse.data)) {
          productsCount = productResponse.data.length;
        }
      } catch (productError) {
        console.error("Products API Error:", productError);
      }

      // =========================
      // CATEGORIES
      // =========================

      let categoriesCount = 0;

      try {
        const categoryResponse = await axios.get(
          `${API_BASE_URL}/category/all`,
          { headers }
        );

        if (Array.isArray(categoryResponse.data)) {
          categoriesCount = categoryResponse.data.length;
        }
      } catch (categoryError) {
        console.error("Categories API Error:", categoryError);
      }

      // =========================
      // ORDERS
      // =========================

      let ordersCount = 0;

      let pending = 0;
      let confirmed = 0;
      let shipped = 0;
      let delivered = 0;
      let cancelled = 0;
      let totalRevenue = 0;

      try {
        const orderResponse = await axios.get(
          `${API_BASE_URL}/order/admin/all`,
          { headers }
        );

        if (Array.isArray(orderResponse.data)) {
          const orders: AdminOrder[] = orderResponse.data;

          ordersCount = orders.length;

          // =========================
          // RECENT ORDERS
          // =========================

          const sortedOrders = [...orders].sort(
            (a, b) => {
              const dateA = a.created_at
                ? new Date(a.created_at).getTime()
                : 0;

              const dateB = b.created_at
                ? new Date(b.created_at).getTime()
                : 0;

              return dateB - dateA;
            }
          );

          setRecentOrders(
            sortedOrders.slice(0, 5)
          );

          // =========================
          // ORDER STATUS + REVENUE
          // =========================

          orders.forEach((order) => {
            switch (order.status) {
              case "PENDING":
                pending++;
                break;

              case "CONFIRMED":
                confirmed++;
                break;

              case "SHIPPED":
                shipped++;
                break;

              case "DELIVERED":
                delivered++;
                break;

              case "CANCELLED":
                cancelled++;
                break;

              default:
                break;
            }

            if (order.status !== "CANCELLED") {
              totalRevenue += Number(
                order.total_amount || 0
              );
            }
          });
        }
      } catch (orderError) {
        console.error("Orders API Error:", orderError);
      }

      // =========================
      // SET DASHBOARD DATA
      // =========================

      setDashboardData({
        users: usersCount,
        products: productsCount,
        orders: ordersCount,
        categories: categoriesCount,
      });

      setOrderSummary({
        pending,
        confirmed,
        shipped,
        delivered,
        cancelled,
        totalRevenue,
      });
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // STAT CARDS
  // =========================

  const statCards = [
    {
      title: "Total Users",
      value: dashboardData.users,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      action: () => navigate("/admin/users"),
    },
    {
      title: "Total Products",
      value: dashboardData.products,
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      action: () => navigate("/admin/products"),
    },
    {
      title: "Total Orders",
      value: dashboardData.orders,
      icon: <ShoppingBagIcon sx={{ fontSize: 40 }} />,
      action: () => navigate("/admin/orders"),
    },
    {
      title: "Total Categories",
      value: dashboardData.categories,
      icon: <CategoryIcon sx={{ fontSize: 40 }} />,
      action: () => navigate("/admin/categories"),
    },
  ];

  return (
    <>
      {/* ========================= */}
      {/* ADMIN TOPBAR */}
      {/* ========================= */}

      <AdminTopbar />

      {/* ========================= */}
      {/* MAIN CONTENT */}
      {/* ========================= */}

      <Container
        maxWidth="xl"
        sx={{
          pt: 12,
          pb: 5,
        }}
      >

        {/* ========================= */}
        {/* PAGE TITLE */}
        {/* ========================= */}

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              px: 1,
            }}
          >
            Admin Dashboard
          </Typography>

          <Typography color="text.secondary">
            Manage your e-commerce website from here.
          </Typography>
        </Box>

        {/* ========================= */}
        {/* ERROR */}
        {/* ========================= */}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* ========================= */}
        {/* STAT CARDS */}
        {/* ========================= */}

        <Grid container spacing={3}>

          {statCards.map((card) => (
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
              key={card.title}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  cursor: "pointer",
                  transition: "0.3s",

                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 5,
                  },
                }}
                onClick={card.action}
              >
                <CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >

                    <Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {card.title}
                      </Typography>

                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700 }}
                      >
                        {loading
                          ? "..."
                          : card.value}
                      </Typography>

                    </Box>

                    <Box>
                      {card.icon}
                    </Box>

                  </Box>

                </CardContent>
              </Card>
            </Grid>
          ))}

        </Grid>

        {/* ========================= */}
        {/* ORDER STATUS SUMMARY */}
        {/* ========================= */}

        <Card
          sx={{
            mt: 4,
            borderRadius: 3,
          }}
        >
          <CardContent>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Order Status Summary
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>

              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Pending
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "warning.main",
                  }}
                >
                  {loading
                    ? "..."
                    : orderSummary.pending}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Confirmed
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                  }}
                >
                  {loading
                    ? "..."
                    : orderSummary.confirmed}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Shipped
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "info.main",
                  }}
                >
                  {loading
                    ? "..."
                    : orderSummary.shipped}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Delivered
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "success.main",
                  }}
                >
                  {loading
                    ? "..."
                    : orderSummary.delivered}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Cancelled
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "error.main",
                  }}
                >
                  {loading
                    ? "..."
                    : orderSummary.cancelled}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Revenue
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  ₹{" "}
                  {loading
                    ? "..."
                    : orderSummary.totalRevenue.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                </Typography>
              </Grid>

            </Grid>

          </CardContent>
        </Card>

        {/* ========================= */}
        {/* RECENT ORDERS */}
        {/* ========================= */}

        <Card
          sx={{
            mt: 4,
            borderRadius: 3,
          }}
        >
          <CardContent>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >

              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                Recent Orders
              </Typography>

              <Button
                endIcon={<ArrowForwardIcon />}
                onClick={() =>
                  navigate("/admin/orders")
                }
              >
                View All
              </Button>

            </Box>

            <Divider sx={{ mb: 2 }} />

            {recentOrders.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{
                  py: 3,
                  textAlign: "center",
                }}
              >
                No orders available.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >

                {recentOrders.map((order) => (
                  <Box
                    key={order.order_id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >

                    {/* ORDER ID */}

                    <Box>
                      <Typography
                        sx={{ fontWeight: 600 }}
                      >
                        Order #{order.order_id}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {order.city ||
                          "City not available"}
                      </Typography>
                    </Box>

                    {/* AMOUNT */}

                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Amount
                      </Typography>

                      <Typography
                        sx={{ fontWeight: 600 }}
                      >
                        ₹{" "}
                        {Number(
                          order.total_amount || 0
                        ).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Typography>
                    </Box>

                    {/* STATUS */}

                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Status
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 600,
                          color:
                            order.status ===
                            "DELIVERED"
                              ? "success.main"
                              : order.status ===
                                "CANCELLED"
                              ? "error.main"
                              : order.status ===
                                "SHIPPED"
                              ? "info.main"
                              : order.status ===
                                "CONFIRMED"
                              ? "primary.main"
                              : "warning.main",
                        }}
                      >
                        {order.status}
                      </Typography>
                    </Box>

                    {/* DATE */}

                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Date
                      </Typography>

                      <Typography variant="body2">
                        {order.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "N/A"}
                      </Typography>
                    </Box>

                  </Box>
                ))}

              </Box>
            )}

          </CardContent>
        </Card>

        {/* ========================= */}
        {/* QUICK ACTIONS */}
        {/* ========================= */}

        <Card
          sx={{
            mt: 4,
            borderRadius: 3,
          }}
        >
          <CardContent>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Quick Actions
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >

              <Button
                variant="contained"
                startIcon={<AddBoxIcon />}
                onClick={() =>
                  navigate("/admin/products")
                }
              >
                Add Product
              </Button>

              <Button
                variant="outlined"
                startIcon={<CategoryIcon />}
                onClick={() =>
                  navigate("/admin/categories")
                }
              >
                Manage Categories
              </Button>

              <Button
                variant="outlined"
                startIcon={<ShoppingBagIcon />}
                onClick={() =>
                  navigate("/admin/orders")
                }
              >
                Manage Orders
              </Button>

              <Button
                variant="outlined"
                startIcon={<PeopleIcon />}
                onClick={() =>
                  navigate("/admin/users")
                }
              >
                Manage Users
              </Button>

            </Box>

          </CardContent>
        </Card>

        {/* ========================= */}
        {/* MANAGEMENT */}
        {/* ========================= */}

        <Card
          sx={{
            mt: 4,
            borderRadius: 3,
          }}
        >
          <CardContent>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Management
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() =>
                    navigate("/admin/users")
                  }
                >
                  Users
                </Button>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() =>
                    navigate("/admin/products")
                  }
                >
                  Products
                </Button>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() =>
                    navigate("/admin/categories")
                  }
                >
                  Categories
                </Button>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() =>
                    navigate("/admin/orders")
                  }
                >
                  Orders
                </Button>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() =>
                    navigate("/admin/contacts")
                  }
                >
                  Contacts
                </Button>
              </Grid>

            </Grid>

          </CardContent>
        </Card>

      </Container>
    </>
  );
};

export default AdminDashboard;

