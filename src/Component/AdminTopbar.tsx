import React from "react";

import {
    AppBar,
    Container,
    Toolbar,
    Typography,
    Box,
    Tooltip,
    Menu,
    MenuItem,
    IconButton,
    Avatar,
    TextField,
} from "@mui/material";

import LocalMallIcon from "@mui/icons-material/LocalMall";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PersonIcon from "@mui/icons-material/Person";

import { Link, useNavigate } from "react-router-dom";


function AdminTopbar() {

    const [search, setSearch] = React.useState("");

    const [anchorElUser, setAnchorElUser] =
        React.useState<null | HTMLElement>(null);

    const navigate = useNavigate();


    // =========================
    // OPEN ADMIN MENU
    // =========================

    const handleOpenUserMenu = (
        event: React.MouseEvent<HTMLElement>
    ) => {

        setAnchorElUser(event.currentTarget);

    };


    // =========================
    // CLOSE ADMIN MENU
    // =========================

    const handleCloseUserMenu = () => {

        setAnchorElUser(null);

    };


    // =========================
    // SEARCH PRODUCTS
    // =========================

    const handleSearch = () => {

        if (search.trim() === "") {
            return;
        }

        navigate(
            `/admin/products?search=${encodeURIComponent(search)}`
        );

    };


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");

        handleCloseUserMenu();

        navigate("/");

    };


    return (

        <AppBar position="fixed">

            <Container
                maxWidth="xl"
                sx={{
                    p: 0,
                    m: 0
                }}
            >

                <Toolbar disableGutters>


                    {/* ========================= */}
                    {/* LOGO */}
                    {/* ========================= */}

                    <LocalMallIcon
                        sx={{
                            display: {
                                xs: "none",
                                md: "flex"
                            },
                            mr: 1
                        }}
                    />


                    {/* ========================= */}
                    {/* E-COMMERCE */}
                    {/* ========================= */}

                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/admin/dashboard"
                        sx={{
                            mr: 3,
                            display: {
                                xs: "none",
                                md: "flex"
                            },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            color: "inherit",
                            textDecoration: "none"
                        }}
                    >
                        E-Commerce
                    </Typography>


                    {/* ========================= */}
                    {/* ADMIN NAVIGATION */}
                    {/* ========================= */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flexGrow: 1
                        }}
                    >


                        {/* DASHBOARD */}

                        <Link
                            to="/admin/dashboard"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px"
                            }}
                        >

                            <DashboardIcon fontSize="small" />

                            Dashboard

                        </Link>


                        {/* PRODUCTS */}

                        <Link
                            to="/admin/add-product"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px"
                            }}
                        >

                            <Inventory2Icon fontSize="small" />

                            Products

                        </Link>


                        {/* CATEGORIES */}

                        <Link
                            to="/admin/categories"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px"
                            }}
                        >

                            <CategoryIcon fontSize="small" />

                            Categories

                        </Link>


                        {/* USERS */}

                        <Link
                            to="/admin/users"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px"
                            }}
                        >

                            <PeopleIcon fontSize="small" />

                            Users

                        </Link>


                        {/* ORDERS */}

                        <Link
                            to="/admin/orders"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px"
                            }}
                        >

                            <ShoppingBagIcon fontSize="small" />

                            Orders

                        </Link>


                        {/* CONTACTS */}

                        <Link
                            to="/admin/contacts"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px"
                            }}
                        >

                            <ContactMailIcon fontSize="small" />

                            Contacts

                        </Link>


                    </Box>


                    {/* ========================= */}
                    {/* SEARCH */}
                    {/* ========================= */}

                    <TextField
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {
                                handleSearch();
                            }

                        }}
                        placeholder="Search Products"
                        size="small"
                        variant="outlined"
                        sx={{
                            backgroundColor: "white",
                            borderRadius: 1,
                            width: "220px"
                        }}
                    />


                    {/* ========================= */}
                    {/* ADMIN ACCOUNT */}
                    {/* ========================= */}

                    <Tooltip title="Admin Account">

                        <IconButton
                            onClick={handleOpenUserMenu}
                            sx={{
                                ml: 1
                            }}
                        >

                            <Avatar
                                sx={{
                                    width: 35,
                                    height: 35,
                                    bgcolor: "white",
                                    color: "primary.main"
                                }}
                            >

                                <PersonIcon />

                            </Avatar>

                        </IconButton>

                    </Tooltip>


                    {/* ========================= */}
                    {/* ADMIN MENU */}
                    {/* ========================= */}

                    <Menu
                        sx={{
                            mt: "45px"
                        }}
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >


                        {/* PROFILE */}

                        <MenuItem
                            component={Link}
                            to="/profile"
                            onClick={handleCloseUserMenu}
                        >

                            <PersonIcon
                                fontSize="small"
                                sx={{ mr: 1 }}
                            />

                            Profile

                        </MenuItem>


                        {/* ACCOUNT */}

                        <MenuItem
                            component={Link}
                            to="/Account"
                            onClick={handleCloseUserMenu}
                        >

                            <PersonIcon
                                fontSize="small"
                                sx={{ mr: 1 }}
                            />

                            Account

                        </MenuItem>


                        {/* ADMIN DASHBOARD */}

                        <MenuItem
                            component={Link}
                            to="/admin/dashboard"
                            onClick={handleCloseUserMenu}
                        >

                            <DashboardIcon
                                fontSize="small"
                                sx={{ mr: 1 }}
                            />

                            Admin Dashboard

                        </MenuItem>


                        {/* MANAGE USERS */}

                        <MenuItem
                            component={Link}
                            to="/admin/users"
                            onClick={handleCloseUserMenu}
                        >

                            <PeopleIcon
                                fontSize="small"
                                sx={{ mr: 1 }}
                            />

                            Manage Users

                        </MenuItem>


                        {/* MANAGE PRODUCTS */}

                        <MenuItem
                            component={Link}
                            to="/admin/products"
                            onClick={handleCloseUserMenu}
                        >

                            <Inventory2Icon
                                fontSize="small"
                                sx={{ mr: 1 }}
                            />

                            Manage Products

                        </MenuItem>


                        {/* MANAGE CATEGORIES */}

                        <MenuItem
                            component={Link}
                            to="/admin/categories"
                            onClick={handleCloseUserMenu}
                        >

                            <CategoryIcon
                                fontSize="small"
                                sx={{ mr: 1 }}
                            />

                            Manage Categories

                        </MenuItem>


                        {/* MANAGE ORDERS */}

                        <MenuItem
                            component={Link}
                            to="/admin/orders"
                            onClick={handleCloseUserMenu}
                        >

                            <ShoppingBagIcon
                                fontSize="small"
                                sx={{ mr: 1 }}
                            />

                            Manage Orders

                        </MenuItem>


                        {/* MANAGE CONTACTS */}

                        <MenuItem
                            component={Link}
                            to="/admin/contacts"
                            onClick={handleCloseUserMenu}
                        >

                            <ContactMailIcon
                                fontSize="small"
                                sx={{ mr: 1 }}
                            />

                            Manage Contacts

                        </MenuItem>


                        {/* LOGOUT */}

                        <MenuItem
                            onClick={handleLogout}
                        >

                            Logout

                        </MenuItem>


                    </Menu>

                </Toolbar>

            </Container>

        </AppBar>

    );
}


export default AdminTopbar;

