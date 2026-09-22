import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import SecurityIcon from "@mui/icons-material/Security";
import DeleteIcon from "@mui/icons-material/Delete";
import LockResetIcon from "@mui/icons-material/LockReset";

import Topbar from "../Component/Topbar";

const Account: React.FC = () => {

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // =========================
  // TOPBAR
  // =========================

  const pages = [
    { menuItem: "Product", link: "/products" },
    { menuItem: "Categories", link: "/Categories" },
    { menuItem: "ContactUs", link: "/ContactUs" },
  ];

  const settings = [
    { settingitem: "Profile", settinglink: "/profile" },
    { settingitem: "Account", settinglink: "/Account" },
    { settingitem: "Dashboard", settinglink: "/Dashboard" },
    { settingitem: "Logout", settinglink: "/Logout" },
  ];

  // =========================
  // GET USER EMAIL
  // =========================

  useEffect(() => {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId) {
      setError("User ID not found. Please login again.");
      setLoading(false);
      return;
    }

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

        setEmail(response.data.email || "");

        setLoading(false);

      })
      .catch((error) => {

        console.error("Account error:", error);

        setError(
          error.response?.data ||
          "Unable to load account."
        );

        setLoading(false);
      });

  }, []);

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleChangePassword = async () => {

    if (!newPassword.trim()) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {

      setSaving(true);

      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:8080/ecomapp/updateprofile",
        {
          email: email,
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewPassword("");

      setSuccess("Password changed successfully!");

    } catch (error: any) {

      console.error("Password change error:", error);

      setError(
        error.response?.data ||
        "Unable to change password."
      );

    } finally {

      setSaving(false);

    }
  };

  // =========================
  // DELETE ACCOUNT
  // =========================

  const handleDeleteAccount = async () => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:8080/ecomapp/deleteuser?email=${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear login data
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      // Redirect to login
      window.location.href = "/";

    } catch (error: any) {

      console.error("Delete account error:", error);

      setError(
        error.response?.data ||
        "Unable to delete account."
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <>
        <Topbar pages={pages} settings={settings} />

        <Box
          sx={{
            pt: 12,
            textAlign: "center",
          }}
        >
          <Typography>
            Loading account...
          </Typography>
        </Box>
      </>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <>
      <Topbar pages={pages} settings={settings} />

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

              {/* TITLE */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <SecurityIcon
                  sx={{
                    fontSize: 65,
                    color: "primary.main",
                  }}
                />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Account
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  textAlign: "center",
                  mt: 1,
                  mb: 4,
                }}
              >
                Manage your account and security
              </Typography>

              <Divider sx={{ mb: 3 }} />

              {/* EMAIL */}

              <Typography
                sx={{
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                Account Email
              </Typography>

              <TextField
                fullWidth
                value={email}
                disabled
                margin="normal"
              />

              <Divider sx={{ my: 4 }} />

              {/* PASSWORD */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                <LockResetIcon color="primary" />

                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold" }}
                >
                  Change Password
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />

              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={saving}
                sx={{
                  mt: 2,
                }}
              >
                {saving
                  ? "Changing..."
                  : "Change Password"}
              </Button>

              <Divider sx={{ my: 4 }} />

              {/* DELETE ACCOUNT */}

              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "error.main",
                  mb: 1,
                }}
              >
                Delete Account
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Deleting your account will permanently
                remove your account.
              </Typography>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>

            </CardContent>

          </Card>

        </Container>

      </Box>

      {/* SUCCESS */}

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={3000}
        onClose={() => setSuccess("")}
      >
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      </Snackbar>

      {/* ERROR */}

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={4000}
        onClose={() => setError("")}
      >
        <Alert
          severity="error"
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      </Snackbar>

    </>
  );
};

export default Account;