import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Topbar from '../Component/Topbar';



const API_URL = "http://localhost:8080/ecomapp";

const IMAGE_BASE_URL =
  "http://localhost:8080/ecomapp/images";




interface Product {
  product_id: number;
  productName: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_ids: string | null;
}

interface Cart {
  id: string;
  merged: boolean;
}

interface CartItem {
  id: number;
  quantity: number;
  price_at_add: number;
  product: Product;
}


// =========================
// CART PAGE
// =========================

function CartPage() {

  const [cart, setCart] =
    useState<Cart | null>(null);

  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);

  const [loading, setLoading] =
    useState(true);


  // =========================
  // GET USER ID
  // =========================

  const getUserId = () => {

    return localStorage.getItem("userId");

  };


  // =========================
  // GET CART
  // =========================

  const getCart = async () => {

    try {

      const userId = getUserId();

      const token =
        localStorage.getItem("token");


      if (!userId) {

        alert("User ID not found");

        return;

      }


      const response = await axios.get(

        `${API_URL}/cart/user/${userId}`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }

      );


      const cartData =
        response.data;


      console.log(
        "Cart:",
        cartData
      );


      setCart(cartData);


      await getCartItems(
        cartData.id
      );


    } catch (error) {

      console.error(
        "Error fetching cart:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // GET CART ITEMS
  // =========================

  const getCartItems = async (
    cartId: string
  ) => {

    try {

      const token =
        localStorage.getItem("token");


      const response =
        await axios.get(

          `${API_URL}/cartitem/cart/${cartId}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }

        );


      console.log(
        "Cart Items:",
        response.data
      );


      setCartItems(
        response.data
      );


    } catch (error) {

      console.error(
        "Error fetching cart items:",
        error
      );

    }

  };


  // =========================
  // GET PRODUCT IMAGE
  // =========================

  const getImageUrl = (
    image_ids: string | null
  ) => {

    if (
      !image_ids ||
      image_ids.trim() === ""
    ) {

      return null;

    }


    const firstId =
      image_ids
        .split(",")[0]
        .trim();


    if (!firstId) {

      return null;

    }


    return `${IMAGE_BASE_URL}/${firstId}`;

  };


  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = async (
    itemId: number,
    quantity: number
  ) => {

    if (quantity < 1) {

      return;

    }


    try {

      const token =
        localStorage.getItem("token");


      await axios.put(

        `${API_URL}/cartitem/${itemId}`,

        {
          quantity: quantity,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }

      );


      if (cart) {

        await getCartItems(
          cart.id
        );

      }


    } catch (error) {

      console.error(
        "Error updating quantity:",
        error
      );

    }

  };


  // =========================
  // DELETE ITEM
  // =========================

  const deleteItem = async (
    itemId: number
  ) => {

    try {

      const token =
        localStorage.getItem("token");


      await axios.delete(

        `${API_URL}/cartitem/${itemId}`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }

      );


      if (cart) {

        await getCartItems(
          cart.id
        );

      }


    } catch (error) {

      console.error(
        "Error deleting item:",
        error
      );

    }

  };


  // =========================
  // CLEAR CART
  // =========================

  const clearCart = async () => {

    if (!cart) {

      return;

    }


    if (
      !window.confirm(
        "Are you sure you want to clear cart?"
      )
    ) {

      return;

    }


    try {

      const token =
        localStorage.getItem("token");


      await axios.delete(

        `${API_URL}/cart/${cart.id}/clear`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }

      );


      setCartItems([]);


    } catch (error) {

      console.error(
        "Error clearing cart:",
        error
      );

    }

  };


  // =========================
  // TOTAL
  // =========================

  const totalAmount =
    cartItems.reduce(

      (total, item) =>

        total +
        Number(
          item.price_at_add
        ) *
        item.quantity,

      0

    );


  // =========================
  // LOAD CART
  // =========================

  useEffect(() => {

    getCart();

  }, []);


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <Container sx={{ mt: 5 }}>

        <Typography>

          Loading cart...

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




  // =========================
  // UI
  // =========================

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
         pt: 12,
         pb: 4,
      
      }}
    >

      <Container maxWidth="lg">


        {/* ================= HEADER ================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >

            <ShoppingCartIcon />

            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
              }}
            >

              My Cart

            </Typography>

          </Box>


          {cartItems.length > 0 && (

            <Button
              variant="outlined"
              color="error"
              onClick={clearCart}
            >

              Clear Cart

            </Button>

          )}

        </Box>


        {/* ================= EMPTY CART ================= */}

        {cartItems.length === 0 ? (

          <Card>

            <CardContent
              sx={{
                textAlign: "center",
                py: 8,
              }}
            >

              <ShoppingCartIcon
                sx={{
                  fontSize: 70,
                  mb: 2,
                }}
              />


              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                }}
              >

                Your Cart is Empty

              </Typography>

            </CardContent>

          </Card>

        ) : (


          /* ================= CART + SUMMARY ================= */

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


            {/* ================= CART ITEMS ================= */}

            <Box
              sx={{
                flex: 1,
              }}
            >

              {cartItems.map(
                (item) => {


                  const product =
                    item.product;


                  const imageUrl =
                    getImageUrl(
                      product?.image_ids
                    );


                  return (

                    <Card
                      key={item.id}
                      sx={{
                        mb: 2,
                      }}
                    >

                      <CardContent>


                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",

                            flexDirection: {
                              xs: "column",
                              sm: "row",
                            },
                          }}
                        >


                          {/* ================= IMAGE ================= */}

                          <Box
                            sx={{
                              width: 140,
                              height: 140,

                              backgroundColor:
                                "#f5f5f5",

                              display: "flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              overflow: "hidden",

                              flexShrink: 0,
                            }}
                          >

                            {imageUrl ? (

                              <Box
                                component="img"

                                src={imageUrl}

                                alt={
                                  product?.productName
                                }

                                sx={{
                                  width:
                                    "100%",

                                  height:
                                    "100%",

                                  objectFit:
                                    "cover",
                                }}

                                onError={(e) => {

                                  e.currentTarget.style.display =
                                    "none";

                                }}
                              />

                            ) : (

                              <Typography
                                color="text.secondary"
                              >

                                No Image

                              </Typography>

                            )}

                          </Box>


                          {/* ================= PRODUCT DETAILS ================= */}

                          <Box
                            sx={{
                              flex: 1,
                              width: "100%",
                            }}
                          >

                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight:
                                  "bold",
                              }}
                            >

                              {
                                product?.productName ||
                                `Product ID: ${item.id}`
                              }

                            </Typography>


                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 1,
                              }}
                            >

                              {
                                product?.description
                              }

                            </Typography>


                            <Typography
                              sx={{
                                mt: 1,
                              }}
                            >

                              Price: ₹
                              {Number(
                                item.price_at_add
                              ).toFixed(2)}

                            </Typography>


                            {/* ================= QUANTITY ================= */}

                            <Box
                              sx={{
                                display: "flex",
                                alignItems:
                                  "center",
                                mt: 2,
                              }}
                            >

                              <IconButton
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.quantity -
                                      1
                                  )
                                }

                                disabled={
                                  item.quantity <= 1
                                }
                              >

                                <RemoveIcon />

                              </IconButton>


                              <Typography
                                sx={{
                                  mx: 2,
                                  fontWeight:
                                    "bold",
                                }}
                              >

                                {
                                  item.quantity
                                }

                              </Typography>


                              <IconButton
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.quantity +
                                      1
                                  )
                                }
                              >

                                <AddIcon />

                              </IconButton>

                            </Box>

                          </Box>


                          {/* ================= SUBTOTAL ================= */}

                          <Box
                            sx={{
                              textAlign:
                                "right",
                              minWidth: 100,
                            }}
                          >

                            <Typography
                              sx={{
                                fontWeight:
                                  "bold",
                                fontSize:
                                  "18px",
                              }}
                            >

                              ₹
                              {(
                                Number(
                                  item.price_at_add
                                ) *
                                item.quantity
                              ).toFixed(2)}

                            </Typography>


                            {/* DELETE */}

                            <IconButton
                              color="error"
                              onClick={() =>
                                deleteItem(
                                  item.id
                                )
                              }
                              sx={{
                                mt: 1,
                              }}
                            >

                              <DeleteIcon />

                            </IconButton>

                          </Box>


                        </Box>

                      </CardContent>

                    </Card>

                  );

                }

              )}

            </Box>


            {/* ================= ORDER SUMMARY ================= */}

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
                    fontWeight:
                      "bold",
                  }}
                >

                  Order Summary

                </Typography>


                <Divider
                  sx={{
                    my: 2,
                  }}
                />


                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    mb: 2,
                  }}
                >

                  <Typography>
                    Items
                  </Typography>

                  <Typography>
                    {cartItems.length}
                  </Typography>

                </Box>


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
                    variant="h5"
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


                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 3,
                  }}
                >

                  Proceed to Checkout

                </Button>

              </CardContent>

            </Card>

          </Box>

        )}

      </Container>
      

    </Box>
    </>

  );

}


export default CartPage;

