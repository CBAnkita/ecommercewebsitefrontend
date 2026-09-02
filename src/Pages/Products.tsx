import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Topbar from '../Component/Topbar';

import axios from "axios";

const IMAGE_BASE_URL = "http://localhost:8080/ecomapp/images";

function Products() {

  const [products, setProducts] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    getProducts();
  }, []);




  const getProducts = async () => {

    try {

      const response = await axios.get(
        "http://localhost:8080/ecomapp/product/all"
      );

      console.log("Products:", response.data);

      setProducts(response.data);

    } catch (error) {

      console.log("Product error:", error);

    } finally {

      setLoading(false);

    }

  };



  const getFirstImageUrl = (
    image_ids: string | null | undefined
  ) => {

    if (!image_ids || image_ids.trim() === "") {
      return null;
    }

    const firstId = image_ids
      .split(",")[0]
      .trim();

    if (firstId === "") {
      return null;
    }

    return `${IMAGE_BASE_URL}/${firstId}`;

  };




  const addToCart = async (product: any) => {

    try {

      const userId = localStorage.getItem("userId");

      const token = localStorage.getItem("token");


      // Check login

      if (!userId || !token) {

        alert("Please login first");

        return;

      }


      console.log("User ID:", userId);

      console.log("Product ID:", product.product_id);


      // =========================
      // GET / CREATE CART
      // =========================

      const cartResponse = await axios.get(

        `http://localhost:8080/ecomapp/cart/user/${userId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );


      const cart = cartResponse.data;

      console.log("Cart:", cart);


      if (!cart || !cart.id) {

        alert("Cart not found");

        return;

      }


      // =========================
      // ADD PRODUCT TO CART
      // =========================

      const response = await axios.post(

        `http://localhost:8080/ecomapp/cart/${cart.id}/add`,

        null,

        {
          params: {
            productId: product.product_id,
            quantity: 1,
          },

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );


      console.log(
        "Add to cart response:",
        response.data
      );


      alert(
        `${product.productName} added to cart!`
      );


    } catch (error: any) {

      console.log(
        "Add to cart error:",
        error
      );


      if (error.response?.status === 401) {

        alert(
          "Session expired. Please login again."
        );

      } else if (error.response?.status === 403) {

        alert(
          "You are not authorized to access cart."
        );

      } else {

        alert(
          error.response?.data ||
          "Failed to add product to cart"
        );

      }

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


  return (
    <>
     <Topbar
      pages={pages1}
      settings={settings1}
    />

    <Container
      sx={{
        mt: 4,
        mb: 4,
      }}
    >

      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 3,
        }}
      >
        Products
      </Typography>


      {/* =========================
          LOADING
      ========================= */}

      {loading ? (

        <Typography>
          Loading products...
        </Typography>


      ) : products.length === 0 ? (

        <Typography>
          No products found.
        </Typography>


      ) : (


        <Grid
          container
          spacing={3}
        >


          {products.map((product) => {


            const imageUrl =
              getFirstImageUrl(
                product.image_ids
              );


            return (


              <Grid
                key={product.product_id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 3,
                }}
              >


                <Card>


                  {/* =========================
                      PRODUCT IMAGE
                  ========================= */}

                  <Box
                    sx={{
                      height: 180,

                      display: "flex",

                      alignItems: "center",

                      justifyContent: "center",

                      backgroundColor: "#f5f5f5",

                      overflow: "hidden",
                    }}
                  >


                    {imageUrl ? (


                      <Box
                        component="img"

                        src={imageUrl}

                        alt={
                          product.productName
                        }

                        sx={{
                          width: "100%",

                          height: "100%",

                          objectFit: "cover",
                        }}

                        onError={(e) => {

                          e.currentTarget.style.display =
                            "none";

                        }}
                      />


                    ) : (


                      <Typography
                        variant="h6"
                        color="text.secondary"
                      >
                        No Image
                      </Typography>


                    )}


                  </Box>


                  {/* =========================
                      PRODUCT DETAILS
                  ========================= */}

                  <CardContent>


                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {product.productName}
                    </Typography>


                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                      }}
                    >
                      {product.description}
                    </Typography>


                    <Typography
                      variant="h6"
                      sx={{
                        mt: 2,
                        fontWeight: "bold",
                      }}
                    >
                      ₹ {product.price}
                    </Typography>


                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                      }}
                    >
                      Stock: {
                        product.stock_quantity
                      }
                    </Typography>


                    {/* =========================
                        ADD TO CART
                    ========================= */}

                    <Button
                      variant="contained"

                      fullWidth

                      sx={{
                        mt: 2,
                      }}

                      onClick={() =>
                        addToCart(product)
                      }

                      disabled={
                        product.stock_quantity <= 0
                      }
                    >

                      {product.stock_quantity > 0

                        ? "Add to Cart"

                        : "Out of Stock"

                      }

                    </Button>


                  </CardContent>


                </Card>


              </Grid>


            );

          })}


        </Grid>


      )}


    </Container>
</>
  );

}



export default Products;

