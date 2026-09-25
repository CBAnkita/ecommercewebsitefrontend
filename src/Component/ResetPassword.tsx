import React, { useState } from "react";

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";


function ResetPassword() {

  const location = useLocation();

  const navigate = useNavigate();


  const email = location.state?.email || "";


  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");


  const handleResetPassword = async () => {

    // ---------------------------------------------
    // Check email
    // ---------------------------------------------

    if (email === "") {

      alert("Email not found. Please go back and try again.");

      navigate("/forgotpassword");

      return;
    }


    // ---------------------------------------------
    // Check new password
    // ---------------------------------------------

    if (password.trim() === "") {

      alert("Please enter new password");

      return;
    }


    // ---------------------------------------------
    // Check confirm password
    // ---------------------------------------------

    if (confirmPassword.trim() === "") {

      alert("Please confirm your password");

      return;
    }


    // ---------------------------------------------
    // Match passwords
    // ---------------------------------------------

    if (password !== confirmPassword) {

      alert("Passwords do not match");

      return;
    }


    try {

      const response = await axios.post(
        "http://localhost:8080/ecomapp/reset-password",
        {
          email: email,
          password: password
        }
      );


      console.log("Reset Password Response:", response.data);


      alert("Password reset successfully!");


      // Go to Login page
      navigate("/");

    } catch (error) {

      console.log("Reset Password Error:", error);


      if (axios.isAxiosError(error)) {

        alert(
          error.response?.data ||
          "Password reset failed!"
        );

      } else {

        alert("Something went wrong!");

      }

    }

  };


  return (

    <Box
      sx={{
        width: "100%",
        height: "98vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >

      <Paper
        elevation={5}
        sx={{
          width: "350px",
          p: 4
        }}
      >

        <Stack spacing={2}>

          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center"
            }}
          >
            Reset Password
          </Typography>


          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center"
            }}
          >
            Create your new password
          </Typography>


          <TextField
            type="password"
            label="New Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            fullWidth
          />


          <TextField
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            fullWidth
          />


          <Button
            variant="contained"
            onClick={handleResetPassword}
            fullWidth
          >
            Reset Password
          </Button>


          <Button
            variant="text"
            onClick={() => navigate("/")}
          >
            Back to Login
          </Button>

        </Stack>

      </Paper>

    </Box>

  );

}


export default ResetPassword;

