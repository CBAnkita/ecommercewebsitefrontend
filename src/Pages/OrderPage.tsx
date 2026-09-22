import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import Topbar from "../Component/Topbar";

interface OrderItem {
  id?: number;
  productName?: string;
  product_name?: string;
  quantity?: number;
  price?: number;
  price_at_add?: number;
}

interface Order {
  order_id?: number;
  orderId?: number;

  total_amount?: number;
  totalAmount?: number;

  status?: string;

  created_at?: string;
  createdAt?: string;

  orderItems?: OrderItem[];
  items?: OrderItem[];
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // -----------------------------
  // Topbar Navigation
  // -----------------------------

  const pages1 = [
    {
      menuItem: "Product",
      link: "/products",
    },
    {
      menuItem: "Categories",
      link: "/Categories",
    },
    {
      menuItem: "ContactUs",
      link: "/ContactUs",
    },
  ];

  const settings1 = [
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

  // -----------------------------
  // Fetch Orders
  // -----------------------------

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      if (!userId) {
        setError("User is not logged in.");
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/ecomapp/order/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data);
    } catch (err: any) {
      console.error("Error fetching orders:", err);

      setError(
        err.response?.data ||
          "Unable to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Cancel Order
  // -----------------------------

  const cancelOrder = async (orderId: number) => {
    try {
      await axios.delete(
        `http://localhost:8080/ecomapp/order/cancel/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();
    } catch (err: any) {
      console.error("Cancel order error:", err);

      setError(
        err.response?.data ||
          "Unable to cancel order."
      );
    }
  };

  // -----------------------------
  // Status Color
  // -----------------------------

  const getStatusColor = (
    status: string
  ):
    | "success"
    | "error"
    | "warning"
    | "info"
    | "default" => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "success";

      case "CANCELLED":
        return "error";

      case "CONFIRMED":
        return "info";

      case "PENDING":
        return "warning";

      default:
        return "default";
    }
  };

  // -----------------------------
  // Loading
  // -----------------------------

  if (loading) {
    return (
      <>
        <Topbar
          pages={pages1}
          settings={settings1}
        />

        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            // Topbar fixed असल्यामुळे
            // वरची जागा
            pt: 10,
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  // -----------------------------
  // Return
  // -----------------------------

  return (
    <>
      {/* =========================
          TOPBAR
      ========================== */}

      <Topbar
        pages={pages1}
        settings={settings1}
      />

      {/* =========================
          MAIN PAGE
      ========================== */}

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",

          // IMPORTANT:
          // Topbar position="fixed" आहे.
          // म्हणून content खाली आणण्यासाठी pt.
          pt: 12,
          pb: 5,
        }}
      >
        <Box
          sx={{
            maxWidth: "1100px",
            mx: "auto",
            px: 2,
          }}
        >

          {/* =========================
              PAGE HEADER
          ========================== */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 4,
            }}
          >
            <ShoppingBagOutlinedIcon
              sx={{
                fontSize: 35,
              }}
            />

            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                }}
              >
                My Orders
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                View and manage all your orders
              </Typography>
            </Box>
          </Box>

          {/* =========================
              ERROR
          ========================== */}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
              }}
            >
              {typeof error === "string"
                ? error
                : "Something went wrong."}
            </Alert>
          )}

          {/* =========================
              NO ORDERS
          ========================== */}

          {!error && orders.length === 0 && (
            <Card
              sx={{
                borderRadius: 3,
                textAlign: "center",
                py: 7,
              }}
            >
              <CardContent>
                <ShoppingBagOutlinedIcon
                  sx={{
                    fontSize: 70,
                    color: "text.secondary",
                    mb: 2,
                  }}
                />

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  No Orders Yet
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 1,
                  }}
                >
                  You haven't placed any orders yet.
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* =========================
              ORDERS LIST
          ========================== */}

          {orders.length > 0 && (
            <Stack spacing={3}>
              {orders.map((order, index) => {
                const orderId =
                  order.order_id ??
                  order.orderId ??
                  index + 1;

                const totalAmount =
                  order.total_amount ??
                  order.totalAmount ??
                  0;

                const status =
                  order.status ?? "PENDING";

                const createdDate =
                  order.createdAt ??
                  order.created_at;

                const items =
                  order.orderItems ??
                  order.items ??
                  [];

                return (
                  <Card
                    key={orderId}
                    sx={{
                      borderRadius: 3,
                      boxShadow: 2,
                      overflow: "hidden",
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 3,
                      }}
                    >

                      {/* =========================
                          ORDER HEADER
                      ========================== */}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: {
                            xs: "flex-start",
                            sm: "center",
                          },
                          flexDirection: {
                            xs: "column",
                            sm: "row",
                          },
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                            }}
                          >
                            Order #{orderId}
                          </Typography>

                          {createdDate && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.7,
                                mt: 0.5,
                              }}
                            >
                              <CalendarMonthOutlinedIcon
                                sx={{
                                  fontSize: 18,
                                  color:
                                    "text.secondary",
                                }}
                              />

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {new Date(
                                  createdDate
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Chip
                          label={status}
                          color={getStatusColor(
                            status
                          )}
                          sx={{
                            fontWeight: "bold",
                          }}
                        />
                      </Box>

                      <Divider
                        sx={{
                          my: 2.5,
                        }}
                      />

                      {/* =========================
                          ORDER ITEMS
                      ========================== */}

                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          mb: 2,
                        }}
                      >
                        Order Items
                      </Typography>

                      {items.length > 0 ? (
                        <Stack spacing={1.5}>
                          {items.map(
                            (
                              item,
                              itemIndex
                            ) => {
                              const itemPrice =
                                item.price ??
                                item.price_at_add ??
                                0;

                              const productName =
                                item.productName ??
                                item.product_name ??
                                `Product ${
                                  itemIndex + 1
                                }`;

                              return (
                                <Box
                                  key={
                                    item.id ??
                                    itemIndex
                                  }
                                  sx={{
                                    display:
                                      "flex",
                                    justifyContent:
                                      "space-between",
                                    alignItems:
                                      "center",
                                    p: 1.5,
                                    borderRadius: 2,
                                    backgroundColor:
                                      "#fafafa",
                                  }}
                                >
                                  <Box>
                                    <Typography
                                      sx={{
                                        fontWeight: 500,
                                      }}
                                    >
                                      {productName}
                                    </Typography>

                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Quantity:{" "}
                                      {item.quantity ??
                                        1}
                                    </Typography>
                                  </Box>

                                  <Typography
                                    sx={{
                                      fontWeight:
                                        "bold",
                                    }}
                                  >
                                    ₹
                                    {Number(
                                      itemPrice
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </Typography>
                                </Box>
                              );
                            }
                          )}
                        </Stack>
                      ) : (
                        <Typography
                          color="text.secondary"
                        >
                          No item information
                          available.
                        </Typography>
                      )}

                      <Divider
                        sx={{
                          my: 2.5,
                        }}
                      />

                      {/* =========================
                          TOTAL + CANCEL
                      ========================== */}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: {
                            xs: "flex-start",
                            sm: "center",
                          },
                          flexDirection: {
                            xs: "column",
                            sm: "row",
                          },
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Total Amount
                          </Typography>

                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: "bold",
                            }}
                          >
                            ₹
                            {Number(
                              totalAmount
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </Typography>
                        </Box>

                        {/* Cancel button */}

                        {status.toUpperCase() !==
                          "CANCELLED" &&
                          status.toUpperCase() !==
                            "DELIVERED" && (
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={
                                <CancelOutlinedIcon />
                              }
                              onClick={() =>
                                cancelOrder(
                                  Number(
                                    orderId
                                  )
                                )
                              }
                            >
                              Cancel Order
                            </Button>
                          )}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
};

export default OrderPage;