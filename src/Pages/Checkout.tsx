import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import Topbar from '../Component/Topbar';

const API_URL = "http://localhost:8080/ecomapp";

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  price_at_add: number;
}

interface PaymentResponse {
  payment_id: number;
  amount: number;
  transactionId: string;
  status: string;
  payment_method: string;
  order?: {
    order_id: number;
  };
}

function Checkout() {

  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");


  // ==========================================
  // GET CART + CART ITEMS
  // ==========================================

  const getCheckoutData = async () => {

    try {

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {

        alert("Please login first");

        navigate("/");

        return;
      }


      // Get user's cart

      const cartResponse = await axios.get(
        `${API_URL}/cart/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const cartData = cartResponse.data;

      console.log("Cart:", cartData);

      setCartId(cartData.id);


      // Get cart items

      const itemResponse = await axios.get(
        `${API_URL}/cartitem/cart/${cartData.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      console.log(
        "Cart Items:",
        itemResponse.data
      );


      setCartItems(itemResponse.data);

    } catch (error: any) {

      console.log(
        "Checkout error:",
        error.response?.data || error
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    getCheckoutData();

  }, []);


  // ==========================================
  // TOTAL AMOUNT
  // ==========================================

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price_at_add) *
      item.quantity,
    0
  );


  // ==========================================
  // INITIATE PAYMENT
  // ==========================================

  const initiatePayment = async (
    orderId: number
  ) => {

    try {

      const token =
        localStorage.getItem("token");


      if (!token) {

        alert("Please login first");

        navigate("/");

        return;

      }


      console.log(
        "Initiating payment for order:",
        orderId
      );


      const response =
        await axios.post<PaymentResponse>(
          `${API_URL}/payments/initiate`,
          null,
          {
            params: {
              orderId: orderId,
              paymentMethod: "UPI",
            },

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      console.log(
        "Payment Response:",
        response.data
      );


      const payment =
        response.data;


      if (
        payment.status === "INITIATED"
      ) {

        alert(
          `Payment initiated successfully!\n\n` +
          `Order ID: ${orderId}\n` +
          `Amount: ₹${Number(
            payment.amount
          ).toFixed(2)}\n` +
          `Transaction ID: ${payment.transactionId}`
        );


        // Payment page वर जा
        navigate(
          `/payment/${orderId}`,
          {
            state: {
              orderId: orderId,
              amount: payment.amount,
              transactionId:
                payment.transactionId,
              paymentMethod:
                payment.payment_method,
            },
          }
        );

      } else {

        alert(
          "Payment initiation failed"
        );

      }

    } catch (error: any) {

      console.log(
        "Payment error:",
        error
      );


      console.log(
        "Payment response:",
        error.response?.data
      );


      if (
        error.response?.status === 401
      ) {

        alert(
          "Session expired. Please login again."
        );

        localStorage.removeItem("token");

        navigate("/");

      } else {

        alert(
          error.response?.data ||
          "Payment initiation failed"
        );

      }

    }

  };


  // ==========================================
  // PLACE ORDER
  // ==========================================

  const placeOrder = async () => {


    // Address validation

    if (!address.trim()) {

      alert(
        "Please enter delivery address"
      );

      return;

    }


    // City validation

    if (!city.trim()) {

      alert(
        "Please enter city"
      );

      return;

    }


    // Pincode validation

    if (!pincode.trim()) {

      alert(
        "Please enter pincode"
      );

      return;

    }


    if (pincode.length !== 6) {

      alert(
        "Please enter valid 6 digit pincode"
      );

      return;

    }


    // Cart validation

    if (cartItems.length === 0) {

      alert(
        "Cart is empty"
      );

      return;

    }


    const token =
      localStorage.getItem("token");

    const userId =
      localStorage.getItem("userId");


    if (!token || !userId) {

      alert(
        "Please login first"
      );

      navigate("/");

      return;

    }


    try {

      setPlacingOrder(true);


      // ==========================================
      // CREATE ORDER REQUEST
      // ==========================================

      const orderRequest = {

        items: cartItems.map(
          (item) => ({

            productId:
              item.productId,

            quantity:
              item.quantity,

          })
        ),

      };


      console.log(
        "Order Request:",
        orderRequest
      );


      // ==========================================
      // PLACE ORDER API
      // ==========================================

      const response =
        await axios.post(
          `${API_URL}/order/place/${userId}`,
          orderRequest,
          {
            headers: {

              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",

            },
          }
        );


      console.log(
        "Order Response:",
        response.data
      );


      const orderId =
        response.data.order_id;


      if (!orderId) {

        alert(
          "Order created but Order ID not received."
        );

        return;

      }


      console.log(
        "Created Order ID:",
        orderId
      );


      // ==========================================
      // PAYMENT INITIATE
      // ==========================================

      await initiatePayment(
        orderId
      );


      /*
       IMPORTANT:

       Cart आत्ता clear करू नको.

       Payment SUCCESS झाल्यानंतर
       cart clear करू.

       त्यामुळे user payment fail/cancel
       केल्यास cart मधील products राहतील.
      */


    } catch (error: any) {

      console.log(
        "Place order error:",
        error
      );


      console.log(
        "Response:",
        error.response?.data
      );


      if (
        error.response?.status === 401
      ) {

        alert(
          "Session expired. Please login again."
        );

        localStorage.removeItem(
          "token"
        );

        navigate("/");

      } else {

        alert(
          error.response?.data ||
          "Failed to place order"
        );

      }

    } finally {

      setPlacingOrder(false);

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
   

      <Container
        sx={{
          mt: 5,
          textAlign: "center",
        }}
      >

        <CircularProgress />

        <Typography
          sx={{ mt: 2 }}
        >
          Loading checkout...
        </Typography>

      </Container>

    );

  }

   const pages1 = [
            {
                menuItem:'Product',
                link:'/products'
            },
            {
                menuItem:'Categories',
                link:'/Categories'
            },
            
            
            {
                menuItem:'ContactUs',
                link:'/ContactUs'
            },
            
            ];



    const settings1 = [
            {
                settingitem:'Profile',
                settinglink:'/profile'

            }, 
            {
                settingitem:'Account',
                settinglink:'/Account'
            }, 
            {
                settingitem:'Dashboard',
                settinglink:'/Dashboard'
                
            }
            , 
            {
                settingitem:'Logout',
                settinglink:'/Logout'
                
            }
            ];




  // ==========================================
  // UI
  // ==========================================

  return (
    <>
    <Topbar
      pages={pages1}
      settings={settings1}
    />

    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        py: 4,
      }}
    >

      <Container maxWidth="lg">


        {/* PAGE TITLE */}

        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 3,
          }}
        >
          Checkout
        </Typography>


        <Box
          sx={{
            display: "flex",
            gap: 3,

            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >


          {/* ==================================
              DELIVERY ADDRESS
          =================================== */}

          <Card sx={{ flex: 1 }}>

            <CardContent>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 3,
                }}
              >
                Delivery Address
              </Typography>


              {/* Address */}

              <TextField
                label="Address"
                fullWidth
                multiline
                rows={4}
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                sx={{ mb: 2 }}
              />


              {/* City */}

              <TextField
                label="City"
                fullWidth
                value={city}
                onChange={(e) =>
                  setCity(
                    e.target.value
                  )
                }
                sx={{ mb: 2 }}
              />


              {/* Pincode */}

              <TextField
                    label="Pincode"
                    fullWidth
                    value={pincode}
                    slotProps={{
                        htmlInput: {
                        maxLength: 6,
                        inputMode: "numeric",
                        },
                    }}
                    onChange={(e) =>
                        setPincode(
                        e.target.value.replace(/\D/g, "")
                        )
                    }
                    />

            </CardContent>

          </Card>


          {/* ==================================
              ORDER SUMMARY
          =================================== */}

          <Card
            sx={{
              width: {
                xs: "100%",
                md: 350,
              },

              height:
                "fit-content",
            }}
          >

            <CardContent>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                }}
              >
                Order Summary
              </Typography>


              <Divider
                sx={{ my: 2 }}
              />


              {/* ITEMS */}

              {cartItems.map(
                (item) => (

                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      mb: 2,
                    }}
                  >

                    <Typography>

                      Product{" "}
                      {item.productId}

                      {" × "}

                      {item.quantity}

                    </Typography>


                    <Typography>

                      ₹
                      {(
                        Number(
                          item.price_at_add
                        ) *
                        item.quantity
                      ).toFixed(2)}

                    </Typography>

                  </Box>

                )
              )}


              <Divider
                sx={{ my: 2 }}
              />


              {/* TOTAL */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                }}
              >

                <Typography>
                  Total
                </Typography>


                <Typography
                  sx={{
                    fontWeight:
                      "bold",
                  }}
                >
                  ₹
                  {totalAmount.toFixed(
                    2
                  )}
                </Typography>

              </Box>


              {/* PLACE ORDER */}

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                }}
                onClick={
                  placeOrder
                }
                disabled={
                  cartItems.length ===
                    0 ||
                  placingOrder
                }
              >

                {placingOrder ? (

                  <CircularProgress
                    size={24}
                    color="inherit"
                  />

                ) : (

                  "Proceed to Payment"

                )}

              </Button>

            </CardContent>

          </Card>

        </Box>

      </Container>
      

    </Box>
    </>
   

  );
  

}


export default Checkout;

