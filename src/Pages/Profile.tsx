import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import Topbar from "../Component/Topbar";


interface User {
  userId?: number;
  email: string;
  firstName: string;
  lastName: string;
  details: string;
}


interface Role {
  id?: number;
  name: string;
}


const Profile: React.FC = () => {

  const [user, setUser] = useState<User>({
    email: "",
    firstName: "",
    lastName: "",
    details: "",
  });


  const [role, setRole] = useState("USER");

  const [password, setPassword] = useState("");

  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [error, setError] = useState("");


  // =========================
  // TOPBAR PAGES
  // =========================

  const pages =
    role === "ADMIN"
      ? [
          {
            menuItem: "Products",
            link: "/admin/products",
          },
          {
            menuItem: "Categories",
            link: "/admin/categories",
          },
          {
            menuItem: "Orders",
            link: "/admin/orders",
          },
          {
            menuItem: "Users",
            link: "/admin/users",
          },
        ]
      : [
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
        ];


  const settings = [
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
      settinglink:
        role === "ADMIN"
          ? "/admin/dashboard"
          : "/Dashboard",
    },
    {
      settingitem: "Logout",
      settinglink: "/Logout",
    },
  ];


  // =========================
  // GET USER PROFILE
  // =========================

  useEffect(() => {

    const userId = localStorage.getItem("userId");

    const token = localStorage.getItem("token");

    const savedRole = localStorage.getItem("role");


    // Get role from localStorage

    if (savedRole) {

      setRole(savedRole);

    }


    // User ID check

    if (!userId) {

      setError(
        "User ID not found. Please login again."
      );

      setLoading(false);

      return;
    }


    // API call

    axios
      .get(
        `http://localhost:8080/ecomapp/pra?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {

        console.log(
          "User profile:",
          response.data
        );


        // =========================
        // USER DATA
        // =========================

        setUser({

          userId: response.data.userId,

          email:
            response.data.email || "",

          firstName:
            response.data.firstName || "",

          lastName:
            response.data.lastName || "",

          details:
            response.data.details || "",

        });


        // =========================
        // ROLE FROM API
        // =========================

        if (
          response.data.roles &&
          response.data.roles.length > 0
        ) {

          const apiRole: Role =
            response.data.roles[0];


          if (apiRole.name) {

            setRole(apiRole.name);

            localStorage.setItem(
              "role",
              apiRole.name
            );

          }

        }


        setLoading(false);

      })
      .catch((error) => {

        console.error(
          "Profile error:",
          error
        );


        setError(
          error.response?.data ||
          "Unable to load profile."
        );


        setLoading(false);

      });

  }, []);


  // =========================
  // UPDATE PROFILE
  // =========================

  const handleUpdate = async () => {

    try {

      const token =
        localStorage.getItem("token");


      const updateData = {

        email: user.email,

        firstName: user.firstName,

        lastName: user.lastName,

        details: user.details,

        password: password,

      };


      const response = await axios.put(

        "http://localhost:8080/ecomapp/updateprofile",

        updateData,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }

      );


      console.log(
        "Profile updated:",
        response.data
      );


      setPassword("");

      setEditMode(false);

      setOpen(true);

    } catch (error: any) {

      console.error(
        "Update profile error:",
        error
      );


      setError(

        error.response?.data ||

        "Unable to update profile."

      );

    }

  };


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <>

        <Topbar
          pages={pages}
          settings={settings}
        />


        <Box
          sx={{
            pt: 12,
            textAlign: "center",
          }}
        >

          <Typography>
            Loading profile...
          </Typography>

        </Box>

      </>

    );

  }


  // =========================
  // PROFILE TITLE
  // =========================

  const profileTitle =
    role === "ADMIN"
      ? "Admin Profile"
      : "My Profile";


  const profileDescription =
    role === "ADMIN"
      ? "View and manage your administrator profile information"
      : "View and manage your profile information";


  // =========================
  // UI
  // =========================

  return (

    <>

      <Topbar
        pages={pages}
        settings={settings}
      />


      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          pt: 12,
          pb: 6,
        }}
      >

        <Container maxWidth="sm">

          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
            }}
          >

            <CardContent sx={{ p: 4 }}>


              {/* PROFILE ICON */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >

                <PersonIcon
                  sx={{
                    fontSize: 80,
                    color: "primary.main",
                  }}
                />

              </Box>


              {/* TITLE */}

              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                {profileTitle}
              </Typography>


              {/* DESCRIPTION */}

              <Typography
                color="text.secondary"
                sx={{
                  textAlign: "center",
                  mb: 2,
                }}
              >
                {profileDescription}
              </Typography>


              {/* ROLE */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 3,
                }}
              >

                <Chip
                  label={role}
                  color={
                    role === "ADMIN"
                      ? "error"
                      : "primary"
                  }
                  variant="outlined"
                />

              </Box>


              <Divider sx={{ mb: 3 }} />


              {/* EMAIL */}

              <TextField
                fullWidth
                label="Email"
                value={user.email}
                disabled
                margin="normal"
              />


              {/* FIRST NAME */}

              <TextField
                fullWidth
                label="First Name"
                value={user.firstName}
                disabled={!editMode}
                onChange={(e) =>
                  setUser({
                    ...user,
                    firstName:
                      e.target.value,
                  })
                }
                margin="normal"
              />


              {/* LAST NAME */}

              <TextField
                fullWidth
                label="Last Name"
                value={user.lastName}
                disabled={!editMode}
                onChange={(e) =>
                  setUser({
                    ...user,
                    lastName:
                      e.target.value,
                  })
                }
                margin="normal"
              />


              {/* DETAILS */}

              <TextField
                fullWidth
                label="Details"
                multiline
                rows={4}
                value={user.details}
                disabled={!editMode}
                onChange={(e) =>
                  setUser({
                    ...user,
                    details:
                      e.target.value,
                  })
                }
                margin="normal"
              />


              {/* PASSWORD */}

              {editMode && (

                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  margin="normal"
                  helperText="Leave blank if you don't want to change password"
                />

              )}


              {/* BUTTONS */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 3,
                }}
              >

                {!editMode ? (

                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() =>
                      setEditMode(true)
                    }
                  >
                    Edit Profile
                  </Button>

                ) : (

                  <>

                    <Button
                      variant="contained"
                      startIcon={
                        <SaveIcon />
                      }
                      onClick={handleUpdate}
                    >
                      Save Changes
                    </Button>


                    <Button
                      variant="outlined"
                      onClick={() => {

                        setEditMode(false);

                        setPassword("");

                      }}
                    >
                      Cancel
                    </Button>

                  </>

                )}

              </Box>


            </CardContent>

          </Card>

        </Container>

      </Box>


      {/* ========================= */}
      {/* SUCCESS MESSAGE */}
      {/* ========================= */}

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() =>
          setOpen(false)
        }
      >

        <Alert
          severity="success"
          onClose={() =>
            setOpen(false)
          }
        >
          Profile updated successfully!
        </Alert>

      </Snackbar>


      {/* ========================= */}
      {/* ERROR MESSAGE */}
      {/* ========================= */}

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={4000}
        onClose={() =>
          setError("")
        }
      >

        <Alert
          severity="error"
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>

      </Snackbar>

    </>

  );

};


export default Profile;