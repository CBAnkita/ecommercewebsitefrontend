import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  InputAdornment,
  TextField,
  Typography,
  Stack,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Topbar from "../Component/Topbar";

import { useNavigate } from "react-router-dom";

interface Category {
  categoryId?: number;
  name: string;
  description: string;
  image_ids?: string;
  created_at?: string;
  updated_at?: string;
}

const API_URL = "http://localhost:8080/ecomapp/category";

const Categories: React.FC = () => {

  const navigate = useNavigate();

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // GET ALL CATEGORIES
  // =========================

  const getCategories = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/all`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setCategories(response.data);

    } catch (error) {

      console.error(
        "Error fetching categories:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // USE EFFECT
  // =========================

  useEffect(() => {

    getCategories();

  }, []);


  // =========================
  // SEARCH CATEGORY
  // =========================

  const filteredCategories =
    categories.filter((category) => {

      const searchText =
        search.toLowerCase();

      return (
        category.name
          ?.toLowerCase()
          .includes(searchText) ||

        category.description
          ?.toLowerCase()
          .includes(searchText)
      );

    });


  // =========================
  // VIEW PRODUCTS
  // =========================

  const handleViewProducts = (
    categoryId?: number
  ) => {

    if (!categoryId) {
      return;
    }

    navigate(
      `/products?category=${categoryId}`
    );

  };


  // =========================
  // JSX
  // =========================

  return (

    <>

      {/* USER TOPBAR */}

      <Topbar
        pages={[
          {
            menuItem: "Products",
            link: "/products",
          },
          {
            menuItem: "Categories",
            link: "/categories",
          },
          {
            menuItem: "Contact Us",
            link: "/ContactUs",
          },
        ]}
        settings={[
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
        ]}
      />


      {/* MAIN CONTAINER */}

      <Container
        maxWidth="lg"
        sx={{
          pt: 12,
          pb: 6,
        }}
      >

        {/* ========================= */}
        {/* PAGE HEADER */}
        {/* ========================= */}

        <Box sx={{ mb: 4 }}>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Categories
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
            }}
          >
            Browse products by category
            and find what you need.
          </Typography>

        </Box>


        {/* ========================= */}
        {/* SEARCH */}
        {/* ========================= */}

        <TextField
          fullWidth
          placeholder="Search category..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          sx={{
            mb: 4,
            maxWidth: 600,
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    color="action"
                  />
                </InputAdornment>
              ),
            },
          }}
        />


        {/* ========================= */}
        {/* LOADING */}
        {/* ========================= */}

        {loading && (

          <Typography
            align="center"
            sx={{
              py: 8,
              color: "text.secondary",
            }}
          >
            Loading categories...
          </Typography>

        )}


        {/* ========================= */}
        {/* NO CATEGORY */}
        {/* ========================= */}

        {!loading &&
          filteredCategories.length === 0 && (

            <Card
              sx={{
                p: 5,
                textAlign: "center",
              }}
            >

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                No categories found
              </Typography>

              <Typography
                color="text.secondary"
              >
                Try another category name.
              </Typography>

            </Card>

          )}


        {/* ========================= */}
        {/* CATEGORY GRID */}
        {/* ========================= */}

        {!loading &&
          filteredCategories.length > 0 && (

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },

                gap: 3,
              }}
            >

              {filteredCategories.map(
                (category) => (

                  <Card
                    key={
                      category.categoryId
                    }
                    sx={{
                      height: "100%",

                      display: "flex",

                      flexDirection:
                        "column",

                      borderRadius: 3,

                      overflow: "hidden",

                      boxShadow: 2,

                      transition:
                        "all 0.3s ease",

                      "&:hover": {
                        transform:
                          "translateY(-5px)",

                        boxShadow: 6,
                      },
                    }}
                  >

                    {/* ========================= */}
                    {/* CATEGORY IMAGE */}
                    {/* ========================= */}

                    {category.image_ids ? (

                      <CardMedia
                        component="img"
                        height="190"
                        image={
                          category.image_ids
                        }
                        alt={
                          category.name
                        }
                        sx={{
                          objectFit:
                            "cover",
                        }}
                      />

                    ) : (

                      <Box
                        sx={{
                          height: 190,

                          display: "flex",

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


                    {/* ========================= */}
                    {/* CATEGORY DETAILS */}
                    {/* ========================= */}

                    <CardContent
                      sx={{
                        flexGrow: 1,

                        display: "flex",

                        flexDirection:
                          "column",
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
                        color="text.secondary"
                        sx={{
                          mb: 3,

                          display:
                            "-webkit-box",

                          WebkitLineClamp: 3,

                          WebkitBoxOrient:
                            "vertical",

                          overflow: "hidden",

                          minHeight: 60,
                        }}
                      >
                        {category.description ||
                          "Explore products from this category."}
                      </Typography>


                      {/* ========================= */}
                      {/* VIEW PRODUCTS */}
                      {/* ========================= */}

                      <Box
                        sx={{
                          mt: "auto",
                        }}
                      >

                        <Button
                          fullWidth
                          variant="contained"
                          endIcon={
                            <ArrowForwardIcon />
                          }
                          onClick={() =>
                            handleViewProducts(
                              category.categoryId
                            )
                          }
                          sx={{
                            borderRadius: 2,

                            textTransform:
                              "none",

                            fontWeight: 600,
                          }}
                        >
                          View Products
                        </Button>

                      </Box>

                    </CardContent>

                  </Card>

                )
              )}

            </Box>

          )}

      </Container>

    </>

  );
};


export default Categories;