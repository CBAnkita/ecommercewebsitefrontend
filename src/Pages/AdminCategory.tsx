import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Stack,
  InputAdornment,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

import AdminTopbar from "../Component/AdminTopbar";

const API_BASE_URL = "http://localhost:8080/ecomapp";
const IMAGE_BASE_URL = "http://localhost:8080/ecomapp/images";

interface Category {
  categoryId: number;
  name: string;
  description: string;
  image_ids?: string;
}

const AdminCategory: React.FC = () => {

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [search, setSearch] =
    useState("");

  const [openDialog, setOpenDialog] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [categoryName, setCategoryName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // GET ALL CATEGORIES
  // =====================================================

  const fetchCategories = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/category/all`
      );

      setCategories(response.data);

    } catch (error) {

      console.error(
        "Error fetching categories:",
        error
      );

      alert("Failed to load categories");

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    fetchCategories();

  }, []);


  // =====================================================
  // GET IMAGE URL
  // =====================================================

  const getCategoryImageUrl = (
    imageIds?: string
  ) => {

    if (!imageIds) {
      return null;
    }

    // If multiple IDs are stored like "5,6,7"
    // use first image ID
    const firstImageId =
      imageIds
        .split(",")[0]
        .trim();

    if (!firstImageId) {
      return null;
    }

    return `${IMAGE_BASE_URL}/${firstImageId}`;
  };


  // =====================================================
  // ADD CATEGORY
  // =====================================================

  const handleAddCategory = () => {

    setEditingCategory(null);

    setCategoryName("");

    setDescription("");

    setSelectedImage(null);

    setImagePreview(null);

    setOpenDialog(true);
  };


  // =====================================================
  // EDIT CATEGORY
  // =====================================================

  const handleEditCategory = (
    category: Category
  ) => {

    setEditingCategory(category);

    setCategoryName(
      category.name
    );

    setDescription(
      category.description || ""
    );

    setSelectedImage(null);

    const imageUrl =
      getCategoryImageUrl(
        category.image_ids
      );

    setImagePreview(imageUrl);

    setOpenDialog(true);
  };


  // =====================================================
  // IMAGE SELECT
  // =====================================================

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };


  // =====================================================
  // CLOSE DIALOG
  // =====================================================

  const handleCloseDialog = () => {

    setOpenDialog(false);

    setEditingCategory(null);

    setCategoryName("");

    setDescription("");

    setSelectedImage(null);

    setImagePreview(null);
  };


  // =====================================================
  // ADD / UPDATE CATEGORY
  // =====================================================

  const handleSaveCategory = async () => {

    if (!categoryName.trim()) {

      alert("Please enter category name");

      return;
    }


    try {

      const token =
        localStorage.getItem("token");


      // =================================================
      // UPDATE CATEGORY
      // =================================================

      if (editingCategory) {

        const categoryData = {

          categoryId:
            editingCategory.categoryId,

          name:
            categoryName.trim(),

          description:
            description.trim(),

          image_ids:
            editingCategory.image_ids || "",
        };


        await axios.put(
          `${API_BASE_URL}/category/update`,
          categoryData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );


        alert(
          "Category updated successfully!"
        );

      }


      // =================================================
      // ADD CATEGORY
      // =================================================

      else {

        const formData =
          new FormData();


        // ---------------------------------------------
        // CATEGORY DATA
        // ---------------------------------------------

        const categoryData = {

          name:
            categoryName.trim(),

          description:
            description.trim(),
        };


        formData.append(
          "category",
          new Blob(
            [
              JSON.stringify(
                categoryData
              ),
            ],
            {
              type: "application/json",
            }
          )
        );


        // ---------------------------------------------
        // CATEGORY IMAGE
        // ---------------------------------------------

        if (selectedImage) {

          formData.append(
            "images",
            selectedImage
          );
        }


        // ---------------------------------------------
        // POST CATEGORY + IMAGE
        // ---------------------------------------------

        await axios.post(
          `${API_BASE_URL}/category/add`,
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        alert(
          "Category added successfully!"
        );
      }


      // =================================================
      // CLOSE + REFRESH
      // =================================================

      handleCloseDialog();

      await fetchCategories();


    } catch (error: any) {

      console.error(
        "Category save error:",
        error
      );


      const message =
        error?.response?.data ||
        "Something went wrong while saving category";


      alert(message);
    }
  };


  // =====================================================
  // DELETE CATEGORY
  // =====================================================

  const handleDeleteCategory = async (
    categoryId: number
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this category?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      const token =
        localStorage.getItem("token");


      await axios.delete(
        `${API_BASE_URL}/category/delete/${categoryId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      alert(
        "Category deleted successfully!"
      );


      await fetchCategories();


    } catch (error: any) {

      console.error(
        "Delete category error:",
        error
      );


      const message =
        error?.response?.data ||
        "Unable to delete category";


      alert(message);
    }
  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredCategories =
    categories.filter((category) => {

      const searchText =
        search.toLowerCase().trim();


      return (
        category.name
          ?.toLowerCase()
          .includes(searchText)
      );
    });


  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <AdminTopbar />


      <Container
        maxWidth="lg"
        sx={{
          pt: 12,
          pb: 5,
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          sx={{
            justifyContent:
              "space-between",

            alignItems: {
              xs: "stretch",
              sm: "center",
            },

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
              Category Management
            </Typography>


            <Typography
              variant="body2"
              sx={{
                color:
                  "text.secondary",

                mt: 0.5,
              }}
            >
              Add, edit and manage
              product categories
            </Typography>

          </Box>


          <Button
            variant="contained"
            startIcon={
              <AddIcon />
            }
            onClick={
              handleAddCategory
            }
          >
            Add Category
          </Button>

        </Stack>


        {/* =================================================
            SEARCH
        ================================================= */}

        <TextField
          fullWidth
          placeholder="Search category..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          sx={{
            mb: 4,
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment
                  position="start"
                >
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />


        {/* =================================================
            CATEGORY LIST
        ================================================= */}

        {loading ? (

          <Typography
            align="center"
          >
            Loading categories...
          </Typography>

        ) : filteredCategories.length === 0 ? (

          <Card>

            <CardContent>

              <Typography
                align="center"
                sx={{
                  py: 4,
                }}
              >
                No categories found.
              </Typography>

            </CardContent>

          </Card>

        ) : (

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },

              gap: 3,
            }}
          >

            {filteredCategories.map(
              (category) => {

                const imageUrl =
                  getCategoryImageUrl(
                    category.image_ids
                  );

                return (

                  <Card
                    key={
                      category.categoryId
                    }
                    sx={{
                      height: "100%",

                      display:
                        "flex",

                      flexDirection:
                        "column",

                      borderRadius: 3,

                      boxShadow: 3,

                      overflow:
                        "hidden",
                    }}
                  >

                    {/* =================================================
                        CATEGORY IMAGE
                    ================================================= */}

                    {imageUrl ? (

                      <CardMedia
                        component="img"
                        height="190"
                        image={imageUrl}
                        alt={
                          category.name
                        }
                        sx={{
                          objectFit:
                            "cover",
                        }}

                        onError={(event) => {

                          event.currentTarget.style.display =
                            "none";

                          const parent =
                            event.currentTarget.parentElement;

                          if (parent) {

                            parent.style.backgroundColor =
                              "#f1f5f9";
                          }
                        }}
                      />

                    ) : (

                      <Box
                        sx={{
                          height: 190,

                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          backgroundColor:
                            "#f1f5f9",
                        }}
                      >

                        <Typography
                          color="text.secondary"
                        >
                          No Image
                        </Typography>

                      </Box>
                    )}


                    {/* =================================================
                        CATEGORY DETAILS
                    ================================================= */}

                    <CardContent
                      sx={{
                        flexGrow: 1,
                      }}
                    >

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        {category.name}
                      </Typography>


                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            "text.secondary",

                          minHeight: 45,
                        }}
                      >
                        {category.description ||
                          "No description available"}
                      </Typography>


                      <Typography
                        variant="caption"
                        sx={{
                          display:
                            "block",

                          mt: 2,

                          color:
                            "text.secondary",
                        }}
                      >
                        Category ID:{" "}
                        {category.categoryId}
                      </Typography>

                    </CardContent>


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <Box
                      sx={{
                        display:
                          "flex",

                        justifyContent:
                          "flex-end",

                        gap: 1,

                        p: 2,

                        pt: 0,
                      }}
                    >

                      <IconButton
                        color="primary"
                        onClick={() =>
                          handleEditCategory(
                            category
                          )
                        }
                      >
                        <EditIcon />
                      </IconButton>


                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDeleteCategory(
                            category.categoryId
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>

                    </Box>

                  </Card>
                );
              }
            )}

          </Box>
        )}

      </Container>


      {/* =====================================================
          ADD / EDIT DIALOG
      ===================================================== */}

      <Dialog
        open={openDialog}
        onClose={
          handleCloseDialog
        }
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>

          {editingCategory
            ? "Edit Category"
            : "Add Category"}

        </DialogTitle>


        <DialogContent>

          {/* CATEGORY NAME */}

          <TextField
            fullWidth
            label="Category Name"
            value={categoryName}
            onChange={(e) =>
              setCategoryName(
                e.target.value
              )
            }
            sx={{
              mt: 1,
              mb: 2,
            }}
          />


          {/* DESCRIPTION */}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            sx={{
              mb: 2,
            }}
          />


          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              mb: 2,
            }}
          >

            {selectedImage
              ? "Change Image"
              : "Choose Category Image"}


            <input
              hidden
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
            />

          </Button>


          {/* =================================================
              IMAGE PREVIEW
          ================================================= */}

          {imagePreview && (

            <Box
              sx={{
                textAlign:
                  "center",

                mb: 2,
              }}
            >

              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                }}
              >
                Image Preview
              </Typography>


              <Box
                component="img"
                src={imagePreview}
                alt="Category Preview"
                sx={{
                  width:
                    "100%",

                  maxHeight:
                    220,

                  objectFit:
                    "cover",

                  borderRadius:
                    2,
                }}

                onError={(event) => {

                  event.currentTarget.style.display =
                    "none";
                }}
              />

            </Box>
          )}

        </DialogContent>


        {/* =================================================
            DIALOG ACTIONS
        ================================================= */}

        <DialogActions
          sx={{
            p: 2,
          }}
        >

          <Button
            onClick={
              handleCloseDialog
            }
          >
            Cancel
          </Button>


          <Button
            variant="contained"
            onClick={
              handleSaveCategory
            }
          >
            {editingCategory
              ? "Update"
              : "Add"}
          </Button>

        </DialogActions>

      </Dialog>

    </>
  );
};

export default AdminCategory;

