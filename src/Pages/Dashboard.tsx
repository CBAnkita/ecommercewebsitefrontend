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

import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate } from "react-router-dom";
import Topbar from "../Component/Topbar";

interface User {
  userId?: number;
  email: string;
  firstName: string;
  lastName: string;
  details: string;
}

interface Order {
  order_id?: number;
  orderId?: number;
  total_amount?: number;
  totalAmount?: number;
  created_at?: string;
  createdAt?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        navigate("/");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Get User
      const userResponse = await axios.get(
        `http://localhost:8080/ecomapp/pra?user_id=${userId}`,
        {
          headers,
        }
      );

      setUser(userResponse.data);

      // Get Orders
      try {
        const orderResponse = await axios.get(
          `http://localhost:8080/ecomapp/order/user/${userId}`,
          {
            headers,
          }
        );

        setOrders(orderResponse.data || []);
      } catch (orderError) {
        console.log("Orders could not be loaded:", orderError);
      }

      // Get Cart
      try {
        const cartResponse = await axios.get(
          `http://localhost:8080/ecomapp/cart/user/${userId}`,
          {
            headers,
          }
        );

        const cart = cartResponse.data;

        if (cart?.cartItems) {
          setCartCount(cart.cartItems.length);
        } else {
          setCartCount(0);
        }
      } catch (cartError) {
        console.log("Cart could not be loaded:", cartError);
      }
    } catch (error: any) {
      console.error("Dashboard error:", error);

      setError(
        error.response?.data ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const getOrderId = (order: Order) => {
    return order.order_id ?? order.orderId ?? 0;
  };

  const getOrderAmount = (order: Order) => {
    return order.total_amount ?? order.totalAmount ?? 0;
  };

  const getOrderDate = (order: Order) => {
    return order.created_at ?? order.createdAt ?? "";
  };

  const pages = [
    {
      menuItem: "Product",
      link: "/products",
    },
    {
      menuItem: "Categories",
      link: "/categories",
    },
    {
      menuItem: "Contact Us",
      link: "/ContactUs",
    },
  ];

  const settings = [
    {
      settingitem: "Profile",
      settinglink: "/profile",
    },
    {
      settingitem: "Account",
      settinglink: "/Account",
    },
    {
      settingitem: "Dashboard",
      settinglink: "/Dashboard",
    },
    {
      settingitem: "Logout",
      settinglink: "/Logout",
    },
  ];

  // Loading
  if (loading) {
    return (
      <>
        <Topbar pages={pages} settings={settings} />

        <Box
          sx={{
            minHeight: "100vh",
            pt: 12,
            textAlign: "center",
          }}
        >
          <Typography variant="h6">
            Loading Dashboard...
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Topbar pages={pages} settings={settings} />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          pt: 12,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">

          {/* Dashboard Header */}

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
              }}
            >
              Dashboard
            </Typography>

            {user && (
              <Typography
                variant="body1"
                color="text.secondary"
              >
                Welcome back,{" "}
                {user.firstName || user.email}!
              </Typography>
            )}
          </Box>

          {/* Error */}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Summary Cards */}

          <Grid container spacing={3}>

            {/* User Card */}

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                }}
              >
                <CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <PersonIcon
                      sx={{
                        fontSize: 45,
                        color: "primary.main",
                      }}
                    />

                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        User
                      </Typography>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        {user?.firstName}{" "}
                        {user?.lastName}
                      </Typography>
                    </Box>
                  </Box>

                </CardContent>
              </Card>
            </Grid>

            {/* Orders Card */}

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                }}
              >
                <CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <ShoppingBagIcon
                      sx={{
                        fontSize: 45,
                        color: "success.main",
                      }}
                    />

                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Total Orders
                      </Typography>

                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        {orders.length}
                      </Typography>
                    </Box>
                  </Box>

                </CardContent>
              </Card>
            </Grid>

            {/* Cart Card */}

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                }}
              >
                <CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <ShoppingCartIcon
                      sx={{
                        fontSize: 45,
                        color: "warning.main",
                      }}
                    />

                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Cart Items
                      </Typography>

                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        {cartCount}
                      </Typography>
                    </Box>
                  </Box>

                </CardContent>
              </Card>
            </Grid>

          </Grid>

          {/* Quick Actions */}

          <Card
            sx={{
              mt: 4,
              borderRadius: 3,
            }}
          >
            <CardContent>

              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 700,
                }}
              >
                Quick Actions
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<ShoppingBagIcon />}
                  onClick={() => navigate("/orders")}
                >
                  My Orders
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => navigate("/cartitem")}
                >
                  View Cart
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  onClick={() => navigate("/profile")}
                >
                  My Profile
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<AccountCircleIcon />}
                  onClick={() => navigate("/Account")}
                >
                  Account
                </Button>
              </Box>

            </CardContent>
          </Card>

          {/* Recent Orders */}

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
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Recent Orders
                </Typography>

                <Button
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/orders")}
                >
                  View All
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              {orders.length === 0 ? (

                <Box
                  sx={{
                    py: 4,
                    textAlign: "center",
                  }}
                >
                  <Typography color="text.secondary">
                    No orders found.
                  </Typography>

                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => navigate("/products")}
                  >
                    Start Shopping
                  </Button>
                </Box>

              ) : (

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {orders.slice(0, 5).map((order) => (

                    <Box
                      key={getOrderId(order)}
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >

                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 700,
                            }}
                          >
                            Order #{getOrderId(order)}
                          </Typography>

                          {getOrderDate(order) && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {new Date(
                                getOrderDate(order)
                              ).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>

                        <Typography
                          color="primary"
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          ₹{getOrderAmount(order)}
                        </Typography>

                      </Box>

                    </Box>

                  ))}
                </Box>

              )}

            </CardContent>
          </Card>

        </Container>
      </Box>
    </>
  );
};

export default Dashboard;