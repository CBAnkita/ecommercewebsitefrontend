import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import AdminTopbar from "../Component/AdminTopbar";

const API_BASE_URL = "http://localhost:8080/ecomapp";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
}

const AdminContacts: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessage | null>(null);

  const [openDialog, setOpenDialog] = useState(false);

  // =========================
  // GET ALL CONTACT MESSAGES
  // =========================

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/contact`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(response.data);
    } catch (error: any) {
      console.error(
        "Error fetching contact messages:",
        error
      );

      const message =
        error?.response?.data ||
        "Unable to load contact messages";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // =========================
  // VIEW MESSAGE
  // =========================

  const handleViewMessage = (
    message: ContactMessage
  ) => {
    setSelectedMessage(message);
    setOpenDialog(true);
  };

  // =========================
  // CLOSE
  // =========================

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMessage(null);
  };

  // =========================
  // DELETE
  // =========================

  const handleDeleteMessage = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_BASE_URL}/contact/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Message deleted successfully!");

      fetchMessages();
    } catch (error: any) {
      console.error(
        "Delete contact message error:",
        error
      );

      const message =
        error?.response?.data ||
        "Unable to delete message";

      alert(message);
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredMessages = messages.filter(
    (message) => {
      const searchText = search.toLowerCase();

      return (
        message.name
          ?.toLowerCase()
          .includes(searchText) ||
        message.email
          ?.toLowerCase()
          .includes(searchText) ||
        message.subject
          ?.toLowerCase()
          .includes(searchText) ||
        message.message
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  return (
    <>
      <AdminTopbar />

      <Container
        maxWidth="lg"
        sx={{
          pt: 12,
          pb: 5,
        }}
      >
        {/* HEADER */}

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700 }}
          >
            Contact Messages
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 0.5,
            }}
          >
            View and manage customer messages
          </Typography>
        </Box>

        {/* SEARCH */}

        <TextField
          fullWidth
          placeholder="Search by name, email, subject..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          sx={{ mb: 4 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* MESSAGE LIST */}

        {loading ? (
          <Typography align="center">
            Loading messages...
          </Typography>
        ) : filteredMessages.length === 0 ? (
          <Card>
            <CardContent>
              <Typography
                align="center"
                sx={{ py: 4 }}
              >
                No contact messages found.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {filteredMessages.map((message) => (
              <Card
                key={message.id}
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  height: "100%",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    {message.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      mb: 2,
                    }}
                  >
                    {message.email}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {message.subject}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: 60,
                    }}
                  >
                    {message.message}
                  </Typography>

                  {message.createdAt && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "text.secondary",
                        mt: 2,
                      }}
                    >
                      {new Date(
                        message.createdAt
                      ).toLocaleString()}
                    </Typography>
                  )}

                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "flex-end",
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() =>
                        handleViewMessage(message)
                      }
                    >
                      <VisibilityIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDeleteMessage(
                          message.id
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* VIEW MESSAGE DIALOG */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Contact Message
        </DialogTitle>

        <DialogContent>
          {selectedMessage && (
            <Box sx={{ pt: 1 }}>
              <Typography
                variant="body2"
                sx={{ mb: 1 }}
              >
                <strong>Name:</strong>{" "}
                {selectedMessage.name}
              </Typography>

              <Typography
                variant="body2"
                sx={{ mb: 1 }}
              >
                <strong>Email:</strong>{" "}
                {selectedMessage.email}
              </Typography>

              <Typography
                variant="body2"
                sx={{ mb: 2 }}
              >
                <strong>Subject:</strong>{" "}
                {selectedMessage.subject}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Message
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-wrap",
                  color: "text.secondary",
                }}
              >
                {selectedMessage.message}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminContacts;