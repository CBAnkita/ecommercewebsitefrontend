import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import AdminTopbar from "../Component/AdminTopbar";

function AddProduct() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState<any[]>([]);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  // =========================
  // Get Categories
  // =========================
  const getCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/ecomapp/category/all"
      );

      console.log("Categories:", response.data);

      setCategories(response.data);
    } catch (error) {
      console.log("Category error:", error);
    }
  };

  // =========================
  // Select Image
  // =========================
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(file);

    setImagePreview(URL.createObjectURL(file));
  };

  // =========================
  // Add Product
  // =========================
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    // =========================
    // Validation
    // =========================

    if (!productName.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Please enter valid price.");
      return;
    }

    if (!stock || Number(stock) < 0) {
      alert("Please enter valid stock.");
      return;
    }

    if (!categoryId) {
      alert("Please select category.");
      return;
    }

    if (!image) {
      alert("Please select product image.");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // Product Object
      // =========================

      const productData = {
        productName: productName.trim(),
        description: description.trim(),
        price: Number(price),
        stock_quantity: Number(stock),

        category: {
          categoryId: Number(categoryId),
        },
      };

      console.log("Product Data:", productData);

      // =========================
      // FormData
      // =========================

      const formData = new FormData();

      // Product JSON
      formData.append(
        "product",
        new Blob(
          [JSON.stringify(productData)],
          {
            type: "application/json",
          }
        )
      );

      // Product Image
      formData.append("images", image);

      console.log("Sending product + image...");

      // =========================
      // API Call
      // =========================

      const response = await axios.post(
        "http://localhost:8080/ecomapp/product/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Product response:",
        response.data
      );

      alert("Product added successfully!");

      // =========================
      // Clear Form
      // =========================

      setProductName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategoryId("");

      setImage(null);
      setImagePreview(null);
    } catch (error: any) {
      console.log(
        "Add product error:",
        error
      );

      console.log(
        "Response:",
        error.response?.data
      );

      if (error.response?.status === 401) {
        alert(
          "Unauthorized. Please login again."
        );
      } else if (error.response?.status === 403) {
        alert(
          "Only Admin can add product."
        );
      } else {
        alert(
          error.response?.data ||
            "Failed to add product."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* =========================
          ADMIN TOPBAR
      ========================= */}

      <AdminTopbar />

      {/* =========================
          ADD PRODUCT PAGE
      ========================= */}

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          pt: 12,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Card elevation={5}>
            <CardContent>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  mb: 3,
                  textAlign: "center",
                }}
              >
                Add Product
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
              >
                {/* Product Name */}

                <TextField
                  label="Product Name"
                  fullWidth
                  value={productName}
                  onChange={(e) =>
                    setProductName(e.target.value)
                  }
                  sx={{ mb: 2 }}
                />

                {/* Description */}

                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  sx={{ mb: 2 }}
                />

                {/* Price */}

                <TextField
                  label="Price"
                  type="number"
                  fullWidth
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  sx={{ mb: 2 }}
                />

                {/* Stock */}

                <TextField
                  label="Stock Quantity"
                  type="number"
                  fullWidth
                  value={stock}
                  onChange={(e) =>
                    setStock(e.target.value)
                  }
                  sx={{ mb: 2 }}
                />

                {/* Category */}

                <TextField
                  select
                  label="Category"
                  fullWidth
                  value={categoryId}
                  onChange={(e) =>
                    setCategoryId(e.target.value)
                  }
                  sx={{ mb: 2 }}
                >
                  {categories.map(
                    (category) => (
                      <MenuItem
                        key={
                          category.categoryId
                        }
                        value={
                          category.categoryId
                        }
                      >
                        {category.name}
                      </MenuItem>
                    )
                  )}
                </TextField>

                {/* Image */}

                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Select Product Image

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={
                      handleImageChange
                    }
                  />
                </Button>

                {/* Image Preview */}

                {imagePreview && (
                  <Box
                    sx={{
                      width: "100%",
                      height: 250,
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#f5f5f5",
                      overflow: "hidden",
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Product Preview"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                )}

                {/* Save */}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 1,
                    py: 1.5,
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      color="inherit"
                    />
                  ) : (
                    "Add Product"
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}

export default AddProduct;
