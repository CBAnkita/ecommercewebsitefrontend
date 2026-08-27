import React, { useState } from "react";

import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import { Link } from "react-router-dom";

import axios from "axios";


function ForgotPassword() {

  const [email, setEmail] = useState("");


  const handleSubmit = async () => {

    if (email.trim() === "") {

      alert("Please enter your email");

      return;
    }


    try {

      const response = await axios.post(
        "http://localhost:8080/ecomapp/ForgotPassword",
        {
          email: email
        }
      );


      console.log(response.data);

      alert("Password reset link sent successfully!");

    } catch (error) {

      console.log(error);


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
              to="/Login"
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