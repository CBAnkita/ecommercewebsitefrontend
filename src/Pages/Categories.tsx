import React, { useEffect, useState } from "react";
import axios from "axios";


import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Topbar from '../Component/Topbar';

interface Category {
  categoryId?: number;
  name: string;
  description: string;
  imageUrl: string;
  created_at?: string;
  updated_at?: string;
}

const API_URL = "http://localhost:8080/ecomapp/category";

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [open, setOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [category, setCategory] = useState<Category>({
    name: "",
    description: "",
    imageUrl: "",
  });

  const [search, setSearch] = useState("");

  // ================= GET ALL CATEGORIES =================

  const getCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Unable to fetch categories");
    }
  };

  // ================= USE EFFECT =================

  useEffect(() => {
    getCategories();
  }, []);

  // ================= OPEN ADD =================

  const handleAddOpen = () => {
    setEditMode(false);

    setCategory({
      name: "",
      description: "",
      imageUrl: "",
    });

    setOpen(true);
  };

  // ================= OPEN EDIT =================

  const handleEdit = (item: Category) => {
    setEditMode(true);

    setCategory({
      categoryId: item.categoryId,
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
    });

    setOpen(true);
  };

  // ================= CLOSE DIALOG =================

  const handleClose = () => {
    setOpen(false);
  };

  // ================= INPUT CHANGE =================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setCategory((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ================= ADD CATEGORY =================

  const handleAdd = async () => {
    try {
      if (!category.name.trim()) {
        alert("Please enter category name");
        return;
      }

      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/add`,
        {
          name: category.name,
          description: category.description,
          imageUrl: category.imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Category added successfully!");

      setOpen(false);

      getCategories();
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data ||
          "Error while adding category"
      );
    }
  };

  // ================= UPDATE CATEGORY =================

  const handleUpdate = async () => {
    try {
      if (!category.name.trim()) {
        alert("Please enter category name");
        return;
      }

      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/update`,
        category,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Category updated successfully!");

      setOpen(false);

      getCategories();
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data ||
          "Error while updating category"
      );
    }
  };

  // ================= DELETE CATEGORY =================

  const handleDelete = async (id?: number) => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Category deleted successfully!");

      getCategories();
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data ||
          "Error while deleting category"
      );
    }
  };

  // ================= SEARCH =================

  const filteredCategories = categories.filter(
    (item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.description
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // ================= JSX =================

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
        component={'h4'}
          sx={{fontWeight:'bold'}}
        >
          Categories
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddOpen}
        >
          Add Category
        </Button>
      </Box>

      {/* SEARCH */}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search Category"
          placeholder="Search by category name..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </Box>

      {/* TABLE */}

      <TableContainer
        component={Paper}
        elevation={3}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>ID</b>
              </TableCell>

              <TableCell>
                <b>Image</b>
              </TableCell>

              <TableCell>
                <b>Name</b>
              </TableCell>

              <TableCell>
                <b>Description</b>
              </TableCell>

              <TableCell align="center">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((item) => (
                <TableRow key={item.categoryId}>
                  <TableCell>
                    {item.categoryId}
                  </TableCell>

                  <TableCell>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        width="60"
                        height="60"
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>

                  <TableCell>
                    {item.name}
                  </TableCell>

                  <TableCell>
                    {item.description}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        handleEdit(item)
                      }
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDelete(
                          item.categoryId
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                >
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ADD / EDIT DIALOG */}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editMode
            ? "Update Category"
            : "Add Category"}
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Category Name"
            name="name"
            value={category.name}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            multiline
            rows={3}
            value={category.description}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Image URL"
            name="imageUrl"
            value={category.imageUrl}
            onChange={handleChange}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            color="inherit"
          >
            Cancel
          </Button>

          {editMode ? (
            <Button
              variant="contained"
              onClick={handleUpdate}
            >
              Update
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleAdd}
            >
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
    
  );
}

export default Categories;