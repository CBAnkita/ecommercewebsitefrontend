import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router-dom";
import AdminTopbar from "../Component/AdminTopbar";

const API_BASE_URL =
  "http://localhost:8080/ecomapp";

interface Product {
  product_id: number;
  productName: string;
  description: string;
  price: number;
  stock_quantity: number;
  categoryName?: string;
  imageIds?: number[];
}

interface Category {
  categoryId: number;
  name: string;
}

const AdminProducts: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [editOpen, setEditOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [productName, setProductName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [image, setImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [saving, setSaving] =
    useState(false);

  // =========================
  // LOAD PRODUCTS
  // =========================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/product/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Products:",
        response.data
      );

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error: any) {
      console.log(
        "Product loading error:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "Unauthorized. Please login again."
        );
      } else if (
        error.response?.status === 403
      ) {
        setError(
          "Only Admin can access this page."
        );
      } else {
        setError(
          error.response?.data ||
            "Unable to load products."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD CATEGORIES
  // =========================

  const loadCategories = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/category/all`
      );

      if (Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (error) {
      console.log(
        "Category loading error:",
        error
      );
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // =========================
  // IMAGE URL
  // =========================

  const getImageUrl = (
    imageId?: number
  ) => {
    if (!imageId) {
      return "";
    }

    return `${API_BASE_URL}/images/${imageId}`;
  };

  // =========================
  // EDIT PRODUCT
  // =========================

  const handleEdit = (
    product: Product
  ) => {
    setSelectedProduct(product);

    setProductName(
      product.productName || ""
    );

    setDescription(
      product.description || ""
    );

    setPrice(
      String(product.price ?? "")
    );

    setStock(
      String(product.stock_quantity ?? "")
    );

    const category = categories.find(
      (item) =>
        item.name ===
        product.categoryName
    );

    setCategoryId(
      category
        ? String(category.categoryId)
        : ""
    );

    setImage(null);

    setImagePreview(
      product.imageIds &&
        product.imageIds.length > 0
        ? getImageUrl(
            product.imageIds[0]
          )
        : null
    );

    setEditOpen(true);
  };

  // =========================
  // IMAGE CHANGE
  // =========================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const handleUpdate = async () => {
    if (!selectedProduct) {
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    if (!productName.trim()) {
      alert(
        "Please enter product name."
      );
      return;
    }

    if (
      !price ||
      Number(price) <= 0
    ) {
      alert(
        "Please enter valid price."
      );
      return;
    }

    if (
      !stock ||
      Number(stock) < 0
    ) {
      alert(
        "Please enter valid stock."
      );
      return;
    }

    if (!categoryId) {
      alert(
        "Please select category."
      );
      return;
    }

    if (!image) {
      alert(
        "Please select product image again for update."
      );
      return;
    }

    try {
      setSaving(true);

      const productData = {
        product_id:
          selectedProduct.product_id,

        productName:
          productName.trim(),

        description:
          description.trim(),

        price: Number(price),

        stock_quantity:
          Number(stock),

        category: {
          categoryId:
            Number(categoryId),
        },
      };

      const formData =
        new FormData();

      formData.append(
        "product",
        new Blob(
          [JSON.stringify(productData)],
          {
            type: "application/json",
          }
        )
      );

      formData.append(
        "images",
        image
      );

      await axios.put(
        `${API_BASE_URL}/product/update`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert(
        "Product updated successfully!"
      );

      setEditOpen(false);
      setSelectedProduct(null);
      setImage(null);
      setImagePreview(null);

      await loadProducts();
    } catch (error: any) {
      console.log(
        "Update product error:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        alert(
          "Unauthorized. Please login again."
        );
      } else if (
        error.response?.status ===
        403
      ) {
        alert(
          "Only Admin can update product."
        );
      } else {
        alert(
          error.response?.data ||
            "Failed to update product."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async (
    productId: number
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/product/delete/${productId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert(
        "Product deleted successfully!"
      );

      await loadProducts();
    } catch (error: any) {
      console.log(
        "Delete product error:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        alert(
          "Unauthorized. Please login again."
        );
      } else if (
        error.response?.status ===
        403
      ) {
        alert(
          "Only Admin can delete product."
        );
      } else {
        alert(
          error.response?.data ||
            "Failed to delete product."
        );
      }
    }
  };

  const filteredProducts =
    products.filter((product) =>
      product.productName
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );



  if (loading) {
    return (
      <>
        <AdminTopbar />

        <Box
          sx={{
            minHeight: "100vh",
            pt: 12,
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <AdminTopbar />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor:
            "#f5f5f5",
          pt: 12,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">

         {/* HEADER */}

<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
    flexWrap: "wrap",
    mb: 4,
  }}
>
  <Box>
    <Typography
      variant="h4"
      sx={{
        fontWeight: 700,
      }}
    >
      Product Management
    </Typography>

    <Typography
      color="text.secondary"
      sx={{ mt: 1 }}
    >
      Manage all products from here.
    </Typography>
  </Box>

  <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={() => navigate("/admin/add-product")}
  >
    Add Product
  </Button>
</Box>

{/* ERROR */}

{error && (
  <Alert
    severity="error"
    sx={{ mb: 3 }}
  >
    {error}
  </Alert>
)}

{/* SEARCH */}

<TextField
  fullWidth
  label="Search Product"
  placeholder="Search by product name..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  sx={{ mb: 4 }}
/>

          {/* PRODUCTS */}

          {filteredProducts.length ===
          0 ? (
            <Card>
              <CardContent
                sx={{
                  textAlign:
                    "center",
                  py: 6,
                }}
              >
                <Typography
                  variant="h6"
                  color="text.secondary"
                >
                  No products found.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Box
              sx={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 3,
              }}
            >
              {filteredProducts.map(
                (product) => (
                  <Card
                    key={
                      product.product_id
                    }
                    sx={{
                      borderRadius: 3,
                      overflow:
                        "hidden",
                    }}
                  >

                    {/* IMAGE */}

                    <Box
                      sx={{
                        width:
                          "100%",
                        height: 220,
                        backgroundColor:
                          "#f5f5f5",
                        display:
                          "flex",
                        justifyContent:
                          "center",
                        alignItems:
                          "center",
                      }}
                    >
                      {product.imageIds &&
                      product
                        .imageIds
                        .length >
                        0 ? (
                        <Box
                          component="img"
                          src={getImageUrl(
                            product
                              .imageIds[0]
                          )}
                          alt={
                            product.productName
                          }
                          sx={{
                            width:
                              "100%",
                            height:
                              "100%",
                            objectFit:
                              "contain",
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

                    <CardContent>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight:
                            700,
                          mb: 1,
                        }}
                      >
                        {
                          product.productName
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          minHeight:
                            40,
                          mb: 2,
                        }}
                      >
                        {
                          product.description
                        }
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight:
                            700,
                          fontSize:
                            20,
                        }}
                      >
                        ₹
                        {
                          product.price
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ mt: 1 }}
                      >
                        Category:{" "}
                        {
                          product.categoryName
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          fontWeight:
                            600,
                        }}
                      >
                        Stock:{" "}
                        {
                          product.stock_quantity
                        }
                      </Typography>

                      {/* ACTIONS */}

                      <Box
                        sx={{
                          display:
                            "flex",
                          gap: 1,
                          mt: 3,
                        }}
                      >
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={
                            <EditIcon />
                          }
                          onClick={() =>
                            handleEdit(
                              product
                            )
                          }
                        >
                          Edit
                        </Button>

                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDelete(
                              product.product_id
                            )
                          }
                          sx={{
                            border:
                              "1px solid",
                            borderColor:
                              "error.main",
                            borderRadius:
                              1,
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                )
              )}
            </Box>
          )}
        </Container>
      </Box>

      {/* EDIT DIALOG */}

      <Dialog
        open={editOpen}
        onClose={() =>
          !saving &&
          setEditOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Edit Product
        </DialogTitle>

        <DialogContent>

          <TextField
            label="Product Name"
            fullWidth
            value={productName}
            onChange={(e) =>
              setProductName(
                e.target.value
              )
            }
            sx={{
              mt: 1,
              mb: 2,
            }}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            sx={{ mb: 2 }}
          />

          <TextField
            label="Price"
            type="number"
            fullWidth
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value
              )
            }
            sx={{ mb: 2 }}
          />

          <TextField
            label="Stock Quantity"
            type="number"
            fullWidth
            value={stock}
            onChange={(e) =>
              setStock(
                e.target.value
              )
            }
            sx={{ mb: 2 }}
          />

          <TextField
            select
            label="Category"
            fullWidth
            value={categoryId}
            onChange={(e) =>
              setCategoryId(
                e.target.value
              )
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
                  {
                    category.name
                  }
                </MenuItem>
              )
            )}
          </TextField>

          {/* IMAGE PREVIEW */}

          {imagePreview && (
            <Box
              sx={{
                width:
                  "100%",
                height: 180,
                mb: 2,
                backgroundColor:
                  "#f5f5f5",
                display:
                  "flex",
                justifyContent:
                  "center",
                alignItems:
                  "center",
                overflow:
                  "hidden",
                borderRadius: 2,
              }}
            >
              <Box
                component="img"
                src={
                  imagePreview
                }
                alt="Product"
                sx={{
                  width:
                    "100%",
                  height:
                    "100%",
                  objectFit:
                    "contain",
                }}
              />
            </Box>
          )}

          <Button
            variant="outlined"
            component="label"
            fullWidth
          >
            Select New Image

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={
                handleImageChange
              }
            />
          </Button>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display:
                "block",
              mt: 1,
            }}
          >
            Select an image before
            updating because the
            backend requires an
            image file.
          </Typography>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setEditOpen(false)
            }
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleUpdate
            }
            disabled={saving}
          >
            {saving ? (
              <CircularProgress
                size={22}
                color="inherit"
              />
            ) : (
              "Update Product"
            )}
          </Button>

        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminProducts;