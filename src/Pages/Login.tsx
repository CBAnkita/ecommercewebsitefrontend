import React, { useState } from "react";

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  CircularProgress,
  Checkbox,
  Divider,
  FormGroup,
  FormControlLabel,
} from "@mui/material";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080/ecomapp";

interface Role {
  id: number;
  name: string;
}

interface User {
  userId?: number;
  email: string;
  firstName: string;
  lastName: string;
  details?: string;
  roles?: Role[];
}

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    email: false,
    password: false,
  });

  const [emailMsg, setEmailMsg] = useState("");

  // =========================
  // VALIDATION
  // =========================

  const valid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;

    if (email.trim() === "") {
      setError((pre) => ({
        ...pre,
        email: true,
      }));

      setEmailMsg("Please enter Email");

      isValid = false;
    } else if (!emailRegex.test(email)) {
      setError((pre) => ({
        ...pre,
        email: true,
      }));

      setEmailMsg("Enter a valid email");

      isValid = false;
    }

    if (password.trim() === "") {
      setError((pre) => ({
        ...pre,
        password: true,
      }));

      isValid = false;
    }

    return isValid;
  };

  // =========================
  // LOGIN
  // =========================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!valid()) {
      return;
    }

    setLoading(true);

    try {
      // =========================
      // STEP 1: LOGIN API
      // =========================

      const response = await axios.post(
        `${API_BASE_URL}/login`,
        {
          email: email,
          password: password,
        }
      );

      console.log("Login successful");
      console.log("Login Response:", response.data);

      const token = response.data.token;
      const userId = response.data.userId;

      // =========================
      // CHECK TOKEN + USER ID
      // =========================

      if (!token || !userId) {
        alert("Login response is invalid.");
        return;
      }

      // =========================
      // STEP 2: STORE LOGIN DATA
      // =========================

      localStorage.setItem("token", token);
      localStorage.setItem(
        "userId",
        String(userId)
      );

      console.log(
        "TOKEN STORED:",
        localStorage.getItem("token")
      );

      console.log(
        "USER ID STORED:",
        localStorage.getItem("userId")
      );

      // =========================
      // STEP 3: GET USER PROFILE
      // =========================

      const userResponse =
        await axios.get<User>(
          `${API_BASE_URL}/pra?user_id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      console.log(
        "User Profile:",
        userResponse.data
      );

      const loggedInUser = userResponse.data;

      // =========================
      // STEP 4: CHECK ROLE
      // =========================

      const isAdmin =
        loggedInUser.roles?.some(
          (role) => role.name === "ADMIN"
        ) ?? false;

      console.log(
        "User Roles:",
        loggedInUser.roles
      );

      console.log(
        "Is Admin:",
        isAdmin
      );

      // =========================
      // STEP 5: SAVE ROLE
      // =========================

      if (isAdmin) {
        localStorage.setItem("role", "ADMIN");
      } else {
        localStorage.setItem("role", "USER");
      }

      // =========================
      // STEP 6: REDIRECT
      // =========================

      alert("Login successful!");

      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/Products");
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("===== LOGIN ERROR =====");
        console.log("Message:", error.message);
        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);

        alert(
          error.response?.data
            ? String(error.response.data)
            : "Login failed"
        );
      } else {
        console.log(
          "Unexpected error:",
          error
        );

        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "98vh",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        variant="elevation"
        elevation={5}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>

            {/* EMAIL */}

            <TextField
              type="text"
              value={email}
              fullWidth
              onChange={(e) => {
                setEmail(e.target.value);

                setError((pre) => ({
                  ...pre,
                  email: false,
                }));
              }}
              label="Enter Email"
              size="medium"
              error={error.email}
              helperText={
                error.email
                  ? emailMsg
                  : ""
              }
            />

            {/* PASSWORD */}

            <TextField
              type="password"
              value={password}
              fullWidth
              onChange={(e) => {
                setPassword(e.target.value);

                setError((pre) => ({
                  ...pre,
                  password: false,
                }));
              }}
              label="Enter password"
              size="medium"
              error={error.password}
              helperText={
                error.password
                  ? "Please enter Password"
                  : ""
              }
            />

            {/* CHECKBOX */}

            <FormGroup>
              <FormControlLabel
                label="I want to receive updates via email."
                control={
                  <Checkbox
                    slotProps={{
                      input: {
                        "aria-label": "Demo",
                      },
                    }}
                  />
                }
              />
            </FormGroup>

            {/* LOGIN BUTTON */}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={22}
                  color="inherit"
                />
              ) : (
                "Sign-In"
              )}
            </Button>

            {/* FORGOT PASSWORD */}

            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <Link
                to="/ForgotPassword"
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            {/* OR */}

            <Divider
              sx={{
                borderColor: "#000",
              }}
              orientation="horizontal"
            >
              OR
            </Divider>

            {/* REGISTER */}

            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <Link
                to="/Register"
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                }}
              >
                Don't have an account? Sign-Up
              </Link>
            </Box>

          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;