import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Stack,
  Pagination,
} from "@mui/material";

import Topbar from "../Component/Topbar";
import axios from "axios";
import Carousel from "../Component/Carousel";
import { useSearchParams, useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = "http://localhost:8080/ecomapp/images";

function Products() {
  const [allproduct, setallProduct] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [currentProducts, setcurrentProducts] = useState<any[]>([]);
  const [totalPages, settotalPages] = useState(0);

  const productsPerPage = 8;

  const startIndex = (page - 1) * productsPerPage;

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();



  const searchText = searchParams.get("search") || "";

  const filteredProducts = allproduct.filter((product) =>
    product.productName
      ?.toLowerCase()
      .includes(searchText.toLowerCase())
  );

  

  useEffect(() => {
    getAllProduct();
  }, []);

    const getAllProduct = async () => {
        try {
        const response = await axios.get(
            "http://localhost:8080/ecomapp/product/all"
        );

        console.log("Products:", response.data);

        setallProduct(response.data);
        } catch (error) {
        console.log("Product error:", error);
        } finally {
        setLoading(false);
        }
    };



    useEffect(() => {
      setPage(1);
    }, [searchText]);


    useEffect(() => {
      setcurrentProducts(
        filteredProducts.slice(
          startIndex,
          startIndex + productsPerPage
        )
      );

      settotalPages(
        Math.ceil(
          filteredProducts.length / productsPerPage
        )
      );
    }, [allproduct, searchText, page]);


  const getFirstImageUrl = (image_ids: String[]) => {
    if (!image_ids || image_ids.length === 0) {
      return [];
    }

    let imgurl: String[] = [];

    image_ids.map((imgitem) =>
      imgurl.push(`${IMAGE_BASE_URL}/${imgitem}`)
    );

    return imgurl;
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

      console.log("Add to cart response:", response.data);
      window.dispatchEvent(new Event("cartUpdated"));
      alert(`${product.productName} added to cart!`);
    } catch (error: any) {
      console.log("Add to cart error:", error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else if (error.response?.status === 403) {
        alert("You are not authorized to access cart.");
      } else {
        alert(
          error.response?.data ||
            "Failed to add product to cart"
        );
      }
    }
  };



    const buyNow = (product: any) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

        if (!userId || !token) {
          alert("Please login first");
          return;
        }

        navigate("/checkout", {
          state: {
            product: product,
            quantity: 1,
          },
        });
      };



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

      

        {searchText && (
          <Typography
            variant="h6"
            sx={{
              mb: 3,
            }}
          >
            Search results for: "{searchText}"
          </Typography>
        )}

        

        {loading ? (
          <Typography>
            Loading products...
          </Typography>
        ) : filteredProducts.length === 0 ? (
          <Typography>
            No products found.
          </Typography>
        ) : (
          <>
            <Grid container spacing={3}>
              {currentProducts.map((product) => {
                const imageUrl =
                  getFirstImageUrl(product.imageIds);

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
                        {imageUrl.length > 0 ? (
                          <Carousel
                            images={imageUrl}
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
                          Stock: {product.stock_quantity}
                        </Typography>


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
                            : "Out of Stock"}
                        </Button>

                        

                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            mt: 1,
                          }}
                          onClick={() =>
                            buyNow(product)
                          }
                          disabled={
                            product.stock_quantity <= 0
                          }
                        >
                          Buy Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

  

            {totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 4,
                  mb: 4,
                }}
              >
                <Stack
                  spacing={2}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                    onChange={(e, val) => {
                      setPage(val);
                    }}
                  />
                </Stack>
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
}

export default Products;