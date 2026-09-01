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

interface Cart {
  id: string;
  merged: boolean;
}

interface CartItem {
  id: number;
  quantity: number;
  price_at_add: number;
}

const API_URL = "http://localhost:8080/ecomapp";

function CartPage() {

  const [cart, setCart] = useState<Cart | null>(null);

  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);

  const [loading, setLoading] =
    useState(true);




  const getUserId = () => {

    return localStorage.getItem("userId");

  };


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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const cartData = response.data;

      setCart(cartData);

      await getCartItems(cartData.id);

    } catch (error) {

      console.error(
        "Error fetching cart:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  

  const getCartItems = async (
    cartId: string
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/cartitem/cart/${cartId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(response.data);

    } catch (error) {

      console.error(
        "Error fetching cart items:",
        error
      );

    }

  };




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
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (cart) {

        await getCartItems(cart.id);

      }

    } catch (error) {

      console.error(
        "Error updating quantity:",
        error
      );

    }

  };



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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (cart) {

        await getCartItems(cart.id);

      }

    } catch (error) {

      console.error(
        "Error deleting item:",
        error
      );

    }

  };



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
            Authorization: `Bearer ${token}`,
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




  const totalAmount =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price_at_add) *
        item.quantity,
      0
    );




  useEffect(() => {

    getCart();

  }, []);




  if (loading) {

    return (
      <Container sx={{ mt: 5 }}>

        <Typography>
          Loading cart...
        </Typography>

      </Container>
    );

  }

  return (

    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        py: 4,
      }}
    >

      <Container sx={{maxWidth:'lg'}}>

        {/* HEADER */}

        <Box
        sx={{display:'flex',justifyContent:'space-around',alignItems:'center',mb:'3'}}
           
        >

          <Box
          sx={{   display:'flex',
            alignItems:'center',
            gap:'1'}}
           >
           
            <ShoppingCartIcon
              sx={{fieldSizing:'revert-layer'}}
            />

            <Typography
            component={'h4'}
              sx={{fontWeight:'bold'}}
              
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


        {/* EMPTY CART */}

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
                component={'h4'}
                sx={{fontWeight:'bold'}}
              
              >
                Your Cart is Empty
              </Typography>

            </CardContent>

          </Card>

        ) : (

          <Box
            sx={{display:'flex',
            gap:'3',
            flexDirection :'columns',medium:'row'
            
            }}
          >

            {/* CART ITEMS */}

            <Box sx={{flex:'1'}}>

              {cartItems.map((item) => (

                <Card
                  key={item.id}
                  sx={{ mb: 2 }}
                >

                  <CardContent>

                    <Box
                      sx={{display:'flex',justifyContent:'space-around',alignItems:'center',mb:'3'}}
                    >

                      {/* PRODUCT */}

                      <Box sx={{flex:'1'}}>

                        <Typography
                           component={'h4'}
                           sx={{fontWeight:'bold'}}
                        >
                          Product ID: {item.id}
                        </Typography>

                        <Typography
                          sx={{ mt: 1 }}
                        >
                          Price: ₹
                          {Number(
                            item.price_at_add
                          ).toFixed(2)}
                        </Typography>

                      </Box>


                      {/* QUANTITY */}

                      <Box
                        sx={{display:'flex',justifyContent:'space-around'}}
                      >

                        <IconButton
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          }
                        >
                          <RemoveIcon />
                        </IconButton>

                        <Typography
                          sx={{
                            mx: 1,
                            fontWeight: "bold",
                          }}
                        >
                          {item.quantity}
                        </Typography>

                        <IconButton
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                        >
                          <AddIcon />
                        </IconButton>

                      </Box>


                      {/* SUBTOTAL */}

                      <Typography
                      sx={{fontWeight:'bold'}}
                        
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
                          deleteItem(item.id)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>

                    </Box>

                  </CardContent>

                </Card>

              ))}

            </Box>


            {/* ORDER SUMMARY */}

            <Card
              sx={{
                width: {
                  xs: "100%",
                  md: 350,
                },
                height: "fit-content",
              }}
            >

              <CardContent>

                <Typography
                  component={'h4'}
                           sx={{fontWeight:'bold'}}
                >
                  Order Summary
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{display:'flex',justifyContent:'space-around',alignItems:'center',mb:'3'}}
                >

                  <Typography>
                    Items
                  </Typography>

                  <Typography>
                    {cartItems.length}
                  </Typography>

                </Box>

                <Box
                  sx={{display:'flex',justifyContent:'space-around',alignItems:'center',mb:'3'}}
                >

                  <Typography>
                    Total
                  </Typography>

                  <Typography
                     component={'h4'}
                           sx={{fontWeight:'bold'}}
                  >
                    ₹{totalAmount.toFixed(2)}
                  </Typography>

                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 3 }}
                >
                  Proceed to Checkout
                </Button>

              </CardContent>

            </Card>

          </Box>

        )}

      </Container>

    </Box>

  );
}

export default CartPage;

