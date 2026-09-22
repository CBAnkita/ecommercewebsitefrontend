import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

import AdminTopbar from "../Component/AdminTopbar";

const API_BASE_URL = "http://localhost:8080/ecomapp";

interface Product {
  product_id: number;
  productName?: string;
  product_name?: string;
  price: number;
}

interface OrderItem {
  order_item_id: number;
  product: Product;
  quantity: number;
  price: number;
}

interface Order {
  order_id: number;
  status: string;
  total_amount: number;
  address: string;
  city: string;
  pincode: string;
  orderItems: OrderItem[];
  created_at: string;
  updated_at?: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [openDialog, setOpenDialog] =
    useState(false);

  const [status, setStatus] = useState("");
  const [updating, setUpdating] =
    useState(false);

  const [message, setMessage] = useState("");

  // ==============================
  // FETCH ALL ORDERS
  // ==============================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/order/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error: any) {
      console.error(
        "Error fetching orders:",
        error
      );

      setError(
        error.response?.data ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==============================
  // SEARCH + FILTER
  // ==============================

  useEffect(() => {
    let result = [...orders];

    if (search.trim() !== "") {
      const searchValue =
        search.toLowerCase();

      result = result.filter((order) => {
        return (
          order.order_id
            .toString()
            .includes(searchValue) ||
          order.city
            ?.toLowerCase()
            .includes(searchValue) ||
          order.address
            ?.toLowerCase()
            .includes(searchValue)
        );
      });
    }

    if (statusFilter !== "ALL") {
      result = result.filter(
        (order) =>
          order.status === statusFilter
      );
    }

    setFilteredOrders(result);
  }, [search, statusFilter, orders]);

  // ==============================
  // VIEW ORDER
  // ==============================

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (updating) return;

    setOpenDialog(false);
    setSelectedOrder(null);
  };

  // ==============================
  // STATUS CHANGE
  // ==============================

  const handleStatusChange = (
    event: SelectChangeEvent
  ) => {
    setStatus(event.target.value);
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;

    try {
      setUpdating(true);

      const token = localStorage.getItem("token");

      await axios.put(
        `${API_BASE_URL}/order/updatestatus/${selectedOrder.order_id}`,
        null,
        {
          params: {
            status: status,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        "Order status updated successfully!"
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.order_id ===
          selectedOrder.order_id
            ? {
                ...order,
                status: status,
              }
            : order
        )
      );

      setSelectedOrder({
        ...selectedOrder,
        status: status,
      });
    } catch (error: any) {
      console.error(
        "Status update error:",
        error
      );

      setMessage(
        error.response?.data ||
          "Failed to update order status."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==============================
  // STATUS COLOR
  // ==============================

  const getStatusColor = (
    orderStatus: string
  ):
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info" => {
    switch (orderStatus) {
      case "PENDING":
        return "warning";

      case "CONFIRMED":
        return "info";

      case "SHIPPED":
        return "primary";

      case "DELIVERED":
        return "success";

      case "CANCELLED":
        return "error";

      default:
        return "default";
    }
  };

  // ==============================
  // PRODUCT NAME
  // ==============================

  const getProductName = (
    product: Product
  ) => {
    return (
      product.productName ||
      product.product_name ||
      "Product"
    );
  };

  return (
    <>
      <AdminTopbar />

      <Container
        maxWidth="xl"
        sx={{
          pt: 12,
          pb: 5,
        }}
      >
        {/* HEADER */}

        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700 }}
            >
              Manage Orders
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              View and manage all customer orders
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchOrders}
          >
            Refresh
          </Button>
        </Stack>

        {/* SEARCH + FILTER */}

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={2}
            >
              <TextField
                fullWidth
                label="Search Orders"
                placeholder="Search by Order ID, city or address"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <SearchIcon
                        sx={{
                          mr: 1,
                          color:
                            "text.secondary",
                        }}
                      />
                    ),
                  },
                }}
              />

              <FormControl
                sx={{ minWidth: 220 }}
              >
                <InputLabel>
                  Order Status
                </InputLabel>

                <Select
                  value={statusFilter}
                  label="Order Status"
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="ALL">
                    All Orders
                  </MenuItem>

                  <MenuItem value="PENDING">
                    Pending
                  </MenuItem>

                  <MenuItem value="CONFIRMED">
                    Confirmed
                  </MenuItem>

                  <MenuItem value="SHIPPED">
                    Shipped
                  </MenuItem>

                  <MenuItem value="DELIVERED">
                    Delivered
                  </MenuItem>

                  <MenuItem value="CANCELLED">
                    Cancelled
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {/* LOADING */}

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* ERROR */}

        {!loading && error && (
          <Card>
            <CardContent>
              <Typography
                color="error"
                sx={{ textAlign: "center" }}
              >
                {error}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* NO ORDERS */}

        {!loading &&
          !error &&
          filteredOrders.length === 0 && (
            <Card>
              <CardContent>
                <Typography
                  color="error"
                  sx={{ textAlign: "center" }}
                >
                  No orders found.
                </Typography>
              </CardContent>
            </Card>
          )}

        {/* ORDERS */}

        {!loading &&
          !error &&
          filteredOrders.length > 0 && (
            <Stack spacing={2}>
              {filteredOrders.map((order) => (
                <Card
                  key={order.order_id}
                  sx={{
                    borderRadius: 3,
                    boxShadow: 2,
                  }}
                >
                  <CardContent>
                    <Stack
                      direction={{
                        xs: "column",
                        md: "row",
                      }}
                      sx={{
                        justifyContent:
                          "space-between",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          Order #{order.order_id}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {order.created_at
                            ? new Date(
                                order.created_at
                              ).toLocaleString()
                            : "Date unavailable"}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ mt: 1 }}
                        >
                          {order.city},{" "}
                          {order.pincode}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          textAlign: {
                            xs: "left",
                            md: "right",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          ₹
                          {Number(
                            order.total_amount
                          ).toFixed(2)}
                        </Typography>

                        <Chip
                          label={order.status}
                          color={getStatusColor(
                            order.status
                          )}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </Stack>

                    <Stack
                      direction={{
                        xs: "column",
                        sm: "row",
                      }}
                      sx={{
                        justifyContent:
                          "space-between",
                        alignItems: {
                          xs: "stretch",
                          sm: "center",
                        },
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {order.orderItems
                          ?.length || 0}{" "}
                        item(s)
                      </Typography>

                      <Button
                        variant="contained"
                        startIcon={
                          <VisibilityIcon />
                        }
                        onClick={() =>
                          handleViewOrder(order)
                        }
                      >
                        View Details
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
      </Container>

      {/* ORDER DETAILS */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Order Details
        </DialogTitle>

        <DialogContent dividers>
          {selectedOrder && (
            <Box>
              <Stack
                spacing={1}
                sx={{ mb: 3 }}
              >
                <Typography variant="h6">
                  Order #
                  {selectedOrder.order_id}
                </Typography>

                <Typography variant="body2">
                  Date:{" "}
                  {selectedOrder.created_at
                    ? new Date(
                        selectedOrder.created_at
                      ).toLocaleString()
                    : "N/A"}
                </Typography>

                <Typography variant="body2">
                  Delivery Address:{" "}
                  {selectedOrder.address}
                </Typography>

                <Typography variant="body2">
                  City: {selectedOrder.city}
                </Typography>

                <Typography variant="body2">
                  Pincode:{" "}
                  {selectedOrder.pincode}
                </Typography>
              </Stack>

              <Typography
                variant="h6"
                sx={{ mb: 2 }}
              >
                Order Items
              </Typography>

              <Stack spacing={1.5}>
                {selectedOrder.orderItems?.map(
                  (item) => (
                    <Card
                      key={
                        item.order_item_id
                      }
                      variant="outlined"
                    >
                      <CardContent>
                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                          }}
                          sx={{
                            justifyContent:
                              "space-between",
                            gap: 1,
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 700,
                              }}
                            >
                              {getProductName(
                                item.product
                              )}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              Quantity:{" "}
                              {item.quantity}
                            </Typography>
                          </Box>

                          <Typography
                            sx={{
                              fontWeight: 700,
                            }}
                          >
                            ₹
                            {Number(
                              item.price
                            ).toFixed(2)}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  )
                )}
              </Stack>

              {/* TOTAL */}

              <Box
                sx={{
                  mt: 3,
                  pt: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    justifyContent:
                      "space-between",
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 700 }}
                  >
                    Total Amount
                  </Typography>

                  <Typography
                    sx={{ fontWeight: 700 }}
                  >
                    ₹
                    {Number(
                      selectedOrder.total_amount
                    ).toFixed(2)}
                  </Typography>
                </Stack>
              </Box>

              {/* STATUS */}

              <FormControl
                fullWidth
                sx={{ mt: 3 }}
              >
                <InputLabel>
                  Update Order Status
                </InputLabel>

                <Select
                  value={status}
                  label="Update Order Status"
                  onChange={
                    handleStatusChange
                  }
                >
                  <MenuItem value="PENDING">
                    Pending
                  </MenuItem>

                  <MenuItem value="CONFIRMED">
                    Confirmed
                  </MenuItem>

                  <MenuItem value="SHIPPED">
                    Shipped
                  </MenuItem>

                  <MenuItem value="DELIVERED">
                    Delivered
                  </MenuItem>

                  <MenuItem value="CANCELLED">
                    Cancelled
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            disabled={updating}
          >
            Close
          </Button>

          <Button
            variant="contained"
            onClick={updateOrderStatus}
            disabled={
              updating ||
              !selectedOrder ||
              status === selectedOrder.status
            }
          >
            {updating
              ? "Updating..."
              : "Update Status"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* MESSAGE */}

      <Dialog
        open={message !== ""}
        onClose={() => setMessage("")}
      >
        <DialogTitle>
          Order Management
        </DialogTitle>

        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setMessage("")}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminOrders;