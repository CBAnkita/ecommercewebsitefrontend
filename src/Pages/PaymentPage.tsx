import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate,useParams } from "react-router-dom";
import Topbar from '../Component/Topbar';

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";

const API_URL = "http://localhost:8080/ecomapp";

interface PaymentState {
  orderId: number;
  amount: number;
  transactionId: string;
  paymentMethod: string;
}

function PaymentPage() {

  const location = useLocation();
  const navigate = useNavigate();

  const paymentData =
    location.state as PaymentState | null;

  const [processing, setProcessing] =
    useState(false);




  if (!paymentData) {

    return (
      <Container sx={{ mt: 5 }}>

        <Card>

          <CardContent
            sx={{
              textAlign: "center",
              py: 5,
            }}
          >

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: 2,
              }}
            >
              Payment information not found
            </Typography>

            <Button
              variant="contained"
              onClick={() =>
                navigate("/checkout")
              }
            >
              Back to Checkout
            </Button>

          </CardContent>

        </Card>

      </Container>
    );
  }




  const handlePaymentSuccess =
    async () => {

      try {

        setProcessing(true);

        const token =
          localStorage.getItem("token");

        if (!token) {

          alert(
            "Session expired. Please login again."
          );

          navigate("/");

          return;
        }




        const response =
          await axios.post(
            `${API_URL}/payments/webhook`,
            null,
            {
              params: {

                transactionId:
                  paymentData.transactionId,

                status:
                  "SUCCESS",

              },

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        console.log(
          "Payment success response:",
          response.data
        );


 

        const userId =
          localStorage.getItem("userId");


        if (userId) {

          const cartResponse =
            await axios.get(
              `${API_URL}/cart/user/${userId}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );


          const cartId =
            cartResponse.data.id;


          // ====================================
          // CLEAR CART
          // ====================================

          await axios.delete(
            `${API_URL}/cart/${cartId}/clear`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        }


        alert(
          "Payment successful! Order confirmed."
        );



        navigate("/orders");


      } catch (error: any) {

        console.log(
          "Payment success error:",
          error
        );

        console.log(
          "Response:",
          error.response?.data
        );

        alert(
          error.response?.data ||
          "Payment failed"
        );

      } finally {

        setProcessing(false);

      }

    };




  const handlePaymentFailed =
    async () => {

      try {

        setProcessing(true);

        const token =
          localStorage.getItem("token");


        await axios.post(
          `${API_URL}/payments/webhook`,
          null,
          {
            params: {

              transactionId:
                paymentData.transactionId,

              status:
                "FAILED",

            },

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        alert(
          "Payment failed. Your order is not confirmed."
        );


        navigate(
          `/orders/${paymentData.orderId}`
        );


      } catch (error: any) {

        console.log(
          "Payment failed error:",
          error
        );

        alert(
          error.response?.data ||
          "Unable to update payment status"
        );

      } finally {

        setProcessing(false);

      }

    };
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




      
    const PaymentPage = () => {
      const { orderId } = useParams();

      console.log("Order ID:", orderId);

      return (
        <div>
          Payment for Order: {orderId}
        </div>
      );
    };


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
        py: 5,
      }}
    >

      <Container
        maxWidth="sm"
      >

        <Card
          elevation={5}
        >

          <CardContent
            sx={{
              p: 4,
            }}
          >

            {/* TITLE */}

            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                mb: 3,
              }}
            >
              Payment
            </Typography>


            <Divider
              sx={{ mb: 3 }}
            />


            {/* ORDER ID */}

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                mb: 2,
              }}
            >

              <Typography>
                Order ID
              </Typography>

              <Typography
                sx={{
                  fontWeight: "bold",
                }}
              >
                #{paymentData.orderId}
              </Typography>

            </Box>


            {/* PAYMENT METHOD */}

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                mb: 2,
              }}
            >

              <Typography>
                Payment Method
              </Typography>

              <Typography
                sx={{
                  fontWeight: "bold",
                }}
              >
                {paymentData.paymentMethod}
              </Typography>

            </Box>


            {/* TRANSACTION ID */}

            <Box
              sx={{
                mb: 2,
              }}
            >

              <Typography
                sx={{
                  mb: 1,
                }}
              >
                Transaction ID
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  wordBreak:
                    "break-all",
                  backgroundColor:
                    "#f5f5f5",
                  p: 1.5,
                  borderRadius: 1,
                }}
              >
                {paymentData.transactionId}
              </Typography>

            </Box>


            <Divider
              sx={{ my: 3 }}
            />


            {/* AMOUNT */}

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                mb: 3,
              }}
            >

              <Typography
                variant="h6"
              >
                Amount
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                }}
              >
                ₹
                {Number(
                  paymentData.amount
                ).toFixed(2)}
              </Typography>

            </Box>


            {/* INFO */}

            <Typography
              sx={{
                textAlign: "center",
                mb: 3,
                color: "text.secondary",
              }}
            >
              This is a demo payment screen.
              Choose payment result below.
            </Typography>


            {/* SUCCESS */}

            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={processing}
              onClick={
                handlePaymentSuccess
              }
              sx={{
                mb: 2,
                py: 1.5,
              }}
            >

              {processing ? (

                <CircularProgress
                  size={24}
                  color="inherit"
                />

              ) : (

                "Pay Now - Success"

              )}

            </Button>


            {/* FAILED */}

            <Button
              fullWidth
              variant="outlined"
              color="error"
              size="large"
              disabled={processing}
              onClick={
                handlePaymentFailed
              }
              sx={{
                py: 1.5,
              }}
            >
              Payment Failed
            </Button>

          </CardContent>

        </Card>

      </Container>
    

    </Box>
    </>

  );
}

export default PaymentPage;