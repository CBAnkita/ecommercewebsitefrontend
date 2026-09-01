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

import axios from "axios";



function Products() {

  const [products, setProducts] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {getProducts();}, []);


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


  const addToCart = (product: any) => {

    console.log("Add to cart:", product);

  };


  return (

    <Container sx={{ mt: 4, mb: 4 }}>

      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 3
        }}
      >
        Products
      </Typography>


      {loading ? (

        <Typography>
          Loading products...
        </Typography>

      ) : products.length === 0 ? (

        <Typography>
          No products found.
        </Typography>

      ) : (

        <Grid container spacing={3}>

          {products.map((product) => (

            <Grid
              key={product.product_id}
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            >

              <Card>

               

                <Box
                  sx={{
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5"
                  }}
                >

                  <Typography
                    variant="h6"
                    color="text.secondary"
                  >
                    Product
                  </Typography>

                </Box>


                <CardContent>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold"
                    }}
                  >
                    {product.productName}
                  </Typography>


                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 1
                    }}
                  >
                    {product.description}
                  </Typography>


                  <Typography
                    variant="h6"
                    sx={{
                      mt: 2,
                      fontWeight: "bold"
                    }}
                  >
                    ₹ {product.price}
                  </Typography>


                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1
                    }}
                  >
                    Stock: {product.stock_quantity}
                  </Typography>


                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 2
                    }}
                    onClick={() => addToCart(product)}
                    disabled={product.stock_quantity <= 0}
                  >
                    {product.stock_quantity > 0
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </Button>

                </CardContent>

              </Card>

            </Grid>

          ))}

        </Grid>

      )}

    </Container>

  );
}


export default Products;