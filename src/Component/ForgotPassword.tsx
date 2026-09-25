import React, { useState } from "react";

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";


function ForgotPassword() {

  const [email, setEmail] = useState("");

  const navigate = useNavigate();


  const handleSubmit = async () => {

    if (email.trim() === "") {

      alert("Please enter your email");

      return;
    }


    try {

      const response = await axios.post(
        "http://localhost:8080/ecomapp/forgot-password",
        {
          email: email.trim()
        }
      );


      console.log("Response:", response.data);

      alert("Password reset link sent successfully!");


      // Reset Password page वर जा
      navigate("/resetpassword", {
        state: {
          email: email.trim()
        }
      });


    } catch (error) {

      console.log("Forgot Password Error:", error);


      if (axios.isAxiosError(error)) {

        alert(
          error.response?.data ||
          "Email not found!"
        );

      } else {

        alert("Something went wrong");

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
            Forgot Password
          </Typography>


          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: "center"
            }}
          >
            Enter your registered email address
          </Typography>


          <TextField
            type="email"
            label="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            fullWidth
          />


          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
          >
            Send Reset Link
          </Button>


          <Box
            sx={{
              textAlign: "center"
            }}
          >

            <Link
              to="/"
              style={{
                textDecoration: "none"
              }}
            >
              Back to Login
            </Link>

          </Box>

        </Stack>

      </Paper>

    </Box>

  );
}


export default ForgotPassword;