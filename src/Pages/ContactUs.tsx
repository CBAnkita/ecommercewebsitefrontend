import React, { useState } from "react";
import axios from "axios";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

import Topbar from "../Component/Topbar";

const ContactUs: React.FC = () => {

  // -----------------------------
  // Form States
  // -----------------------------
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Snackbar state
  const [open, setOpen] = useState(false);

  // -----------------------------
  // Topbar Pages
  // -----------------------------
  const pages = [
    { menuItem: "Product", link: "/products" },
    { menuItem: "Categories", link: "/Categories" },
    { menuItem: "ContactUs", link: "/ContactUs" },
  ];

  // -----------------------------
  // Topbar Settings
  // -----------------------------
  const settings = [
    { settingitem: "Profile", settinglink: "/profile" },
    { settingitem: "Account", settinglink: "/Account" },
    { settingitem: "Dashboard", settinglink: "/Dashboard" },
    { settingitem: "Logout", settinglink: "/Logout" },
  ];

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================
  const handleSubmit = async (e: React.FormEvent) => {

    // Page reload होऊ नये म्हणून
    e.preventDefault();

    // -----------------------------
    // Validation
    // -----------------------------
    if (!name || !email || !subject || !message) {
      alert("Please fill all fields.");
      return;
    }

    try {

      // -----------------------------
      // Backend API Call
      // -----------------------------
      const response = await axios.post(
        "http://localhost:8080/ecomapp/contact",
        {
          name: name,
          email: email,
          subject: subject,
          message: message,
        }
      );

      console.log("Contact message saved:", response.data);

      // -----------------------------
      // Form Clear
      // -----------------------------
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");

      // -----------------------------
      // Success Snackbar
      // -----------------------------
      setOpen(true);

    } catch (error: any) {

      console.error("Error sending contact message:", error);

      alert(
        error.response?.data ||
        "Unable to send message. Please try again."
      );
    }
  };

  return (
    <>
      {/* ==============================
          TOPBAR
      ============================== */}
      <Topbar pages={pages} settings={settings} />

      {/* ==============================
          MAIN CONTACT US SECTION
      ============================== */}
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          pt: 12,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">

          {/* ==============================
              PAGE TITLE
          ============================== */}
          <Box
            sx={{
              textAlign: "center",
              mb: 5,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                mb: 1,
              }}
            >
              Contact Us
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
            >
              Have any questions? We are here to help you.
            </Typography>
          </Box>

          {/* ==============================
              CONTACT CONTENT
          ============================== */}
          <Grid
            container
            spacing={4}
           
          >

            {/* =================================
                LEFT SIDE - CONTACT INFORMATION
            ================================= */}
            <Grid size={{ xs: 12, md: 5 }}>

              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                    }}
                  >
                    Get In Touch
                  </Typography>

                  <Typography
                    color="text.secondary"
                    sx={{ mb: 4 }}
                  >
                    We would love to hear from you.
                    Please contact us using the information below.
                  </Typography>

                  <Divider sx={{ mb: 3 }} />

                  {/* EMAIL */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <EmailOutlinedIcon
                      color="primary"
                      sx={{ fontSize: 32 }}
                    />

                    <Box>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Email
                      </Typography>

                      <Typography color="text.secondary">
                        support@ecommerce.com
                      </Typography>
                    </Box>
                  </Box>

                  {/* PHONE */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <PhoneOutlinedIcon
                      color="primary"
                      sx={{ fontSize: 32 }}
                    />

                    <Box>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Phone
                      </Typography>

                      <Typography color="text.secondary">
                        +91 98765 43210
                      </Typography>
                    </Box>
                  </Box>

                  {/* ADDRESS */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <LocationOnOutlinedIcon
                      color="primary"
                      sx={{ fontSize: 32 }}
                    />

                    <Box>
                      <Typography sx={{ fontWeight: "bold" }}>
                        Address
                      </Typography>

                      <Typography color="text.secondary">
                        Pune, Maharashtra, India
                      </Typography>
                    </Box>
                  </Box>

                </CardContent>
              </Card>
            </Grid>

            {/* =================================
                RIGHT SIDE - CONTACT FORM
            ================================= */}
            <Grid size={{ xs: 12, md: 7 }}>

              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      mb: 3,
                    }}
                  >
                    Send Us a Message
                  </Typography>

                  {/* =========================
                      FORM
                  ========================= */}
                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                  >

                    {/* NAME */}
                    <TextField
                      fullWidth
                      label="Name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      margin="normal"
                    />

                    {/* EMAIL */}
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      margin="normal"
                    />

                    {/* SUBJECT */}
                    <TextField
                      fullWidth
                      label="Subject"
                      value={subject}
                      onChange={(e) =>
                        setSubject(e.target.value)
                      }
                      margin="normal"
                    />

                    {/* MESSAGE */}
                    <TextField
                      fullWidth
                      label="Message"
                      multiline
                      rows={5}
                      value={message}
                      onChange={(e) =>
                        setMessage(e.target.value)
                      }
                      margin="normal"
                    />

                    {/* SEND BUTTON */}
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<SendOutlinedIcon />}
                      sx={{
                        mt: 3,
                        px: 4,
                        py: 1.3,
                        borderRadius: 2,
                        fontWeight: "bold",
                      }}
                    >
                      Send Message
                    </Button>

                  </Box>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* ==============================
          SUCCESS SNACKBAR
      ============================== */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert
          severity="success"
          onClose={() => setOpen(false)}
        >
          Your message has been sent successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactUs;