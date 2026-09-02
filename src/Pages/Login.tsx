import React, { useState } from 'react'
import { Box, Button, Paper, Stack, TextField, CircularProgress, Toolbar ,Checkbox, Divider, FormGroup, FormControlLabel} from '@mui/material'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckBox } from '@mui/icons-material';
import { Link } from "react-router-dom";


function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)  

    const [error, setError] = useState({
        email: false,
        password: false
    });

    const [emailMsg, setEmailMsg] = useState('')

    const valid = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = true;

        
        if (email.trim() === '') {
            setError(pre => ({ ...pre, email: true }))
            setEmailMsg('Please enter Email')
            isValid = false;
        } else if (!emailRegex.test(email)) {
            setError(pre => ({ ...pre, email: true }))
            setEmailMsg('Enter a valid email')
            isValid = false;
        }

        if (password.trim() === '') {
            setError(pre => ({ ...pre, password: true }))
            isValid = false;
        }

        return isValid;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!valid()) {
            return;
        }

        setLoading(true)   

        try {
            const response = await axios.post(
                "http://localhost:8080/ecomapp/login",
                {
                    email: email,
                    password: password
                }
            );

            console.log("Login successful");
            console.log("JWT:", response.data);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", String(response.data.userId));
            
            alert("Login successful!");
            navigate("/home");

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
                console.log("Unexpected error:", error);
                alert("Something went wrong");
            }
        } finally {
            setLoading(false)   
        }
    };
const pages = [
  {
    menuItem:'Logout',
    link:'/logout'
  },
  
];

const settings = [

  {
    settingitem:'Logout',
    settinglink:'/Logout'
    
  }
];


    return (
        
        <Box
            sx={{
                width: '100%',
                minHeight: '98vh',   
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                p: 2
            }}
        >
        
            <Paper
                variant='elevation'
                elevation={5}
                sx={{
                    width: '100%',
                    maxWidth: 400,  
                    p: 4
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} >
                        

                        <TextField
                            type='text'
                            value={email}
                            fullWidth
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError(pre => ({ ...pre, email: false }));
                            }}
                            label="Enter Email"
                            size='medium'
                            
                            error={error.email}
                            helperText={error.email ? emailMsg : ''}
                        />

                        <TextField
                            type='password'
                            value={password}
                            fullWidth
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(pre => ({ ...pre, password: false }));
                            }}
                            label="Enter password"
                            size='medium'
                            error={error.password}
                            helperText={error.password ? 'Please enter Password' : ''}
                        />
                        <FormGroup>
                        <FormControlLabel label='I want to receive updates via email.' control={<Checkbox slotProps={{input:{'aria-label':'Demo'}}}/>}/>                    
                        </FormGroup>

                        <Button
                            type='submit'
                            variant='contained'
                            disabled={loading}   
                        >
                            {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign-In'}
                        </Button>

                      <Box sx={{ textAlign: "center" }}>
                                <Link
                                    to="/ForgotPassword"
                                    style={{
                                    textDecoration: "none",
                                    color: "#1976d2"
                                    }}
                                >Forgot Password?
                                </Link>
                        </Box>

                        <Divider sx={{borderColor:'#000'}} orientation='horizontal'>OR</Divider>
                         

                         <Box sx={{ textAlign: "center" }}>
                                <Link
                                    to="/Register"
                                    style={{
                                    textDecoration: "none",
                                    color: "#1976d2"
                                    }}
                                >Don't have an account? Sign-Up

                                </Link>
                        </Box>




                            
                    </Stack>
                </form>
            </Paper>
        </Box>
    )
}

export default Login