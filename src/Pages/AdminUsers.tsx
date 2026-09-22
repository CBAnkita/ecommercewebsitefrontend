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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";

import AdminTopbar from "../Component/AdminTopbar";

const API_BASE_URL = "http://localhost:8080/ecomapp";

interface Role {
  id: number;
  name: string;
}

interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  details?: string;
  created_at?: string;
  roles: Role[];
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [selectedRole, setSelectedRole] = useState("USER");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // ==============================
  // SNACKBAR
  // ==============================

  const showSnackbar = (
    message: string,
    severity: "success" | "error"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // ==============================
  // FETCH USERS
  // ==============================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/admin/users`,
        {
          headers,
        }
      );

      setUsers(response.data);
    } catch (error: any) {
      console.error("Error fetching users:", error);

      showSnackbar(
        error?.response?.data || "Failed to load users",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==============================
  // SEARCH
  // ==============================

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    const fullName =
      `${user.firstName} ${user.lastName}`.toLowerCase();

    const email =
      user.email?.toLowerCase() || "";

    const roles =
      user.roles
        ?.map((role) => role.name.toLowerCase())
        .join(" ") || "";

    return (
      fullName.includes(searchText) ||
      email.includes(searchText) ||
      roles.includes(searchText)
    );
  });

  // ==============================
  // OPEN ROLE DIALOG
  // ==============================

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);

    const currentRole =
      user.roles && user.roles.length > 0
        ? user.roles[0].name
        : "USER";

    setSelectedRole(currentRole);

    setRoleDialogOpen(true);
  };

  // ==============================
  // ASSIGN ROLE
  // ==============================

  const assignRole = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/admin/assign-role`,
        null,
        {
          params: {
            userId: selectedUser.userId,
            roleName: selectedRole,
          },
          headers,
        }
      );

      showSnackbar(
        `Role "${selectedRole}" assigned successfully!`,
        "success"
      );

      setRoleDialogOpen(false);

      fetchUsers();
    } catch (error: any) {
      console.error("Role assign error:", error);

      showSnackbar(
        error?.response?.data || "Failed to assign role",
        "error"
      );
    }
  };

  // ==============================
  // REMOVE ROLE
  // ==============================

  const removeRole = async (roleName: string) => {
    if (!selectedUser) {
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/admin/remove-role`,
        null,
        {
          params: {
            userId: selectedUser.userId,
            roleName,
          },
          headers,
        }
      );

      showSnackbar(
        `Role "${roleName}" removed successfully!`,
        "success"
      );

      setRoleDialogOpen(false);

      fetchUsers();
    } catch (error: any) {
      console.error("Role remove error:", error);

      showSnackbar(
        error?.response?.data || "Failed to remove role",
        "error"
      );
    }
  };

  // ==============================
  // OPEN DELETE DIALOG
  // ==============================

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // ==============================
  // DELETE USER
  // ==============================

  const deleteUser = async () => {
    if (!userToDelete) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/admin/users/${userToDelete.userId}`,
        {
          headers,
        }
      );

      showSnackbar(
        "User deleted successfully!",
        "success"
      );

      setDeleteDialogOpen(false);
      setUserToDelete(null);

      fetchUsers();
    } catch (error: any) {
      console.error("Delete user error:", error);

      showSnackbar(
        error?.response?.data || "Failed to delete user",
        "error"
      );
    }
  };

  return (
    <>
      {/* ==============================
          ADMIN TOPBAR
      ============================== */}

      <AdminTopbar />

      <Container
        maxWidth="lg"
        sx={{
          pt: 12,
          pb: 5,
        }}
      >
        {/* PAGE HEADER */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              User Management
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Manage registered users and their roles
            </Typography>
          </Box>

          <Chip
            icon={<PersonIcon />}
            label={`Total Users: ${users.length}`}
            variant="outlined"
          />
        </Box>

        {/* SEARCH */}

        <TextField
          fullWidth
          label="Search users"
          placeholder="Search by name, email or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            mb: 4,
          }}
        />

        {/* LOADING */}

        {loading && (
          <Typography
            sx={{
              textAlign: "center",
              py: 5,
            }}
          >
            Loading users...
          </Typography>
        )}

        {/* NO USERS */}

        {!loading && filteredUsers.length === 0 && (
          <Alert severity="info">
            No users found.
          </Alert>
        )}

        {/* USERS */}

        {!loading && filteredUsers.length > 0 && (
          <Grid
            container
            spacing={3}
          >
            {filteredUsers.map((user) => (
              <Grid
                key={user.userId}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: 3,
                  }}
                >
                  <CardContent>
                    {/* USER ICON + NAME */}

                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        mb: 2,
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "primary.main",
                          color: "white",
                        }}
                      >
                        <PersonIcon />
                      </Box>

                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {user.firstName} {user.lastName}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          ID: {user.userId}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    {/* EMAIL */}

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        wordBreak: "break-word",
                      }}
                    >
                      <strong>Email:</strong>{" "}
                      {user.email}
                    </Typography>

                    {/* DETAILS */}

                    {user.details && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                        }}
                      >
                        <strong>Details:</strong>{" "}
                        {user.details}
                      </Typography>
                    )}

                    {/* ROLES */}

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      Roles
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        mb: 3,
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <Chip
                            key={role.id}
                            label={role.name}
                            size="small"
                            color={
                              role.name === "ADMIN"
                                ? "error"
                                : "primary"
                            }
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <Chip
                          label="No Role"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Stack>

                    {/* ACTIONS */}

                    <Stack spacing={1}>
                      <Button
                        variant="contained"
                        startIcon={<SecurityIcon />}
                        onClick={() =>
                          openRoleDialog(user)
                        }
                        fullWidth
                      >
                        Manage Role
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() =>
                          openDeleteDialog(user)
                        }
                        fullWidth
                      >
                        Delete User
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* ==========================
          ROLE DIALOG
      ========================== */}

      <Dialog
        open={roleDialogOpen}
        onClose={() =>
          setRoleDialogOpen(false)
        }
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Manage User Role
        </DialogTitle>

        <DialogContent>
          {selectedUser && (
            <>
              <Typography
                sx={{
                  mb: 2,
                  mt: 1,
                }}
              >
                <strong>User:</strong>{" "}
                {selectedUser.firstName}{" "}
                {selectedUser.lastName}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 3,
                }}
              >
                {selectedUser.email}
              </Typography>

              <FormControl fullWidth>
                <InputLabel>
                  Select Role
                </InputLabel>

                <Select
                  value={selectedRole}
                  label="Select Role"
                  onChange={(e) =>
                    setSelectedRole(e.target.value)
                  }
                >
                  <MenuItem value="USER">
                    USER
                  </MenuItem>

                  <MenuItem value="ADMIN">
                    ADMIN
                  </MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            gap: 1,
          }}
        >
          <Button
            onClick={() =>
              setRoleDialogOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="outlined"
            color="error"
            disabled={
              !selectedUser ||
              !selectedUser.roles?.some(
                (role) =>
                  role.name === selectedRole
              )
            }
            onClick={() =>
              removeRole(selectedRole)
            }
          >
            Remove Role
          </Button>

          <Button
            variant="contained"
            onClick={assignRole}
          >
            Assign Role
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==========================
          DELETE DIALOG
      ========================== */}

      <Dialog
        open={deleteDialogOpen}
        onClose={() =>
          setDeleteDialogOpen(false)
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Delete User
        </DialogTitle>

        <DialogContent>
          {userToDelete && (
            <Typography>
              Are you sure you want to delete{" "}
              <strong>
                {userToDelete.firstName}{" "}
                {userToDelete.lastName}
              </strong>
              ?
            </Typography>
          )}

          <Typography
            variant="body2"
            color="error"
            sx={{
              mt: 2,
            }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setDeleteDialogOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={deleteUser}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==========================
          SNACKBAR
      ========================== */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminUsers;