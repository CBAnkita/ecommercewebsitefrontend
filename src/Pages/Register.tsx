import React, { useState } from 'react';

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert
} from '@mui/material';

import axios from 'axios';
import Topbar from '../Component/Topbar';

import { useNavigate } from 'react-router-dom';


function Register() {

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [details, setDetails] = useState('');

  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);


  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setMessage('');
    setSuccess(false);

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    const newError = {

      firstName:
        firstName.trim() === '',

      lastName:
        lastName.trim() === '',

      email:
        email.trim() === '' ||
        !emailRegex.test(email),

      password:
        password.length < 8,

      confirmPassword:
        confirmPassword === '' ||
        password !== confirmPassword

    };


    setError(newError);


    if (
      newError.firstName ||
      newError.lastName ||
      newError.email ||
      newError.password ||
      newError.confirmPassword
    ) {
      return;
    }


    const userData = {

      firstName: firstName.trim(),

      lastName: lastName.trim(),

      email: email.trim(),

      password: password,

      details: details.trim()

    };


    try {

      const response = await axios.post(
        'http://localhost:8080/ecomapp/emailregister',
        userData
      );


      console.log(response.data);

      setSuccess(true);

      setMessage(
        'User registered successfully!'
      );


      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setDetails('');


      setTimeout(() => {

        navigate('/login');

      }, 1500);


    } catch (error: any) {

      console.log(error);


      if (error.response) {

        setMessage(
          error.response.data ||
          'Registration failed'
        );

      } else {

        setMessage(
          'Server is not running or connection failed'
        );

      }

    }

  };
   const pages1 = [
            {
                menuItem:'Product',
                link:'/products'
            },
            {
                menuItem:'Categories',
                link:'/Categories'
            },
            
            
            {
                menuItem:'ContactUs',
                link:'/ContactUs'
            },
            
            ];



    const settings1 = [
            {
                settingitem:'Profile',
                settinglink:'/profile'

            }, 
            {
                settingitem:'Account',
                settinglink:'/Account'
            }, 
            {
                settingitem:'Dashboard',
                settinglink:'/Dashboard'
                
            }
            , 
            {
                settingitem:'Logout',
                settinglink:'/Logout'
                
            }
            ];




  return (
    <>
    <Topbar
      pages={pages1}
      settings={settings1}
    />

    <Box
      sx={{
        minHeight: '85vh',

        display: 'flex',

        justifyContent: 'center',

        alignItems: 'center',

        backgroundColor: '#f5f5f5',

        py: 4
      }}
    >

      <Paper
        elevation={6}
        sx={{
          width: {
            xs: '90%',
            sm: 450
          },

          p: 4,

          borderRadius: 3
        }}
      >

        {/* TITLE */}

        <Typography
          variant="h5"
          align="center"
          sx={{
            mb: 1,
            fontWeight: 'bold'
          }}
        >
          Create Account
        </Typography>


        <Typography
          align="center"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Register your new account
        </Typography>


        {/* MESSAGE */}

        {message && (

          <Alert
            severity={
              success
                ? 'success'
                : 'error'
            }

            sx={{ mb: 2 }}
          >
            {message}
          </Alert>

        )}


        <form onSubmit={handleRegister}>

          {/* FIRST NAME */}

          <TextField
            fullWidth
            label="First Name"
            value={firstName}

            onChange={(e) => {

              setFirstName(e.target.value);

              setError(prev => ({
                ...prev,
                firstName: false
              }));

            }}

            error={error.firstName}

            helperText={
              error.firstName
                ? 'Please enter first name'
                : ''
            }

            margin="normal"
          />


          {/* LAST NAME */}

          <TextField
            fullWidth
            label="Last Name"
            value={lastName}

            onChange={(e) => {

              setLastName(e.target.value);

              setError(prev => ({
                ...prev,
                lastName: false
              }));

            }}

            error={error.lastName}

            helperText={
              error.lastName
                ? 'Please enter lastName'
                : ''
            }

            margin="normal"
          />


          {/* EMAIL */}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}

            onChange={(e) => {

              setEmail(e.target.value);

              setError(prev => ({
                ...prev,
                email: false
              }));

            }}

            error={error.email}

            helperText={
              error.email
                ? 'Please enter a valid email'
                : ''
            }

            margin="normal"
          />


          {/* PASSWORD */}

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}

            onChange={(e) => {

              setPassword(e.target.value);

              setError(prev => ({
                ...prev,
                password: false
              }));

            }}

            error={error.password}

            helperText={
              error.password
                ? 'Password must contain at least 8 characters'
                : ''
            }

            margin="normal"
          />


          {/* CONFIRM PASSWORD */}

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}

            onChange={(e) => {

              setConfirmPassword(
                e.target.value
              );

              setError(prev => ({
                ...prev,
                confirmPassword: false
              }));

            }}

            error={
              error.confirmPassword
            }

            helperText={
              error.confirmPassword
                ? 'Passwords do not match'
                : ''
            }

            margin="normal"
          />


          {/* DETAILS */}

          <TextField
            fullWidth
            label="Details"
            multiline
            rows={3}
            value={details}

            onChange={(e) =>
              setDetails(e.target.value)
            }

            margin="normal"
          />


          {/* REGISTER BUTTON */}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 3,
              py: 1.3,
              borderRadius: 2
            }}
          >
            Register
          </Button>


          {/* LOGIN */}

          <Typography
            align="center"
            sx={{ mt: 3 }}
          >

            Already have an account?

            <Button
              onClick={() =>
                navigate('/login')
              }
              variant="text"
            >
              Login
            </Button>

          </Typography>

        </form>

      </Paper>

    </Box>
    </>

  );

}

export default Register;
