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
} from '@mui/material';

import React from 'react';

import LocalMallIcon from '@mui/icons-material/LocalMall';

import {
    Person,
} from '@mui/icons-material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

import { Link, useNavigate } from 'react-router-dom';


function AdminTopbar() {

    const [search, setSearch] = React.useState('');

    const [anchorElUser, setAnchorElUser] =
        React.useState<null | HTMLElement>(null);

    const navigate = useNavigate();


    // =========================
    // ADMIN MENU OPEN
    // =========================

    const handleOpenUserMenu = (
        event: React.MouseEvent<HTMLElement>
    ) => {

        setAnchorElUser(event.currentTarget);

    };


    // =========================
    // ADMIN MENU CLOSE
    // =========================

    const handleCloseUserMenu = () => {

        setAnchorElUser(null);

    };


    // =========================
    // SEARCH
    // =========================

    const handleSearch = () => {

        if (search.trim() === '') {
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
                sx={{
                    p: 0,
                    m: 0
                }}
                maxWidth="xl"
            >

                <Toolbar disableGutters>


                    {/* ========================= */}
                    {/* LOGO ICON */}
                    {/* ========================= */}

                    <LocalMallIcon
                        sx={{
                            display: {
                                xs: 'none',
                                md: 'flex'
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
                                xs: 'none',
                                md: 'flex'
                            },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none'
                        }}
                    >
                        E-Commerce
                    </Typography>


                    {/* ========================= */}
                    {/* ADMIN NAVIGATION */}
                    {/* ========================= */}

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flexGrow: 1
                        }}
                    >


                        {/* ========================= */}
                        {/* DASHBOARD */}
                        {/* ========================= */}

                        <Link
                            to="/admin/dashboard"
                            style={{
                                color: 'white',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >

                            <DashboardIcon
                                fontSize="small"
                            />

                            Dashboard

                        </Link>


                        {/* ========================= */}
                        {/* PRODUCTS */}
                        {/* ========================= */}

                        <Link
                            to="/admin/add-product"
                            style={{
                                color: 'white',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >

                            <Inventory2Icon
                                fontSize="small"
                            />

                            Products

                        </Link>


                        {/* ========================= */}
                        {/* CATEGORIES */}
                        {/* ========================= */}

                        <Link
                            to="/admin/categories"
                            style={{
                                color: 'white',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >

                            <CategoryIcon
                                fontSize="small"
                            />

                            Categories

                        </Link>


                        {/* ========================= */}
                        {/* USERS */}
                        {/* ========================= */}

                        <Link
                            to="/admin/users"
                            style={{
                                color: 'white',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >

                            <PeopleIcon
                                fontSize="small"
                            />

                            Users

                        </Link>


                        {/* ========================= */}
                        {/* ORDERS */}
                        {/* ========================= */}

                        <Link
                            to="/admin/orders"
                            style={{
                                color: 'white',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >

                            <ShoppingBagIcon
                                fontSize="small"
                            />

                            Orders

                        </Link>


                    </Box>


                    {/* ========================= */}
                    {/* ADMIN SEARCH */}
                    {/* ========================= */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >

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
                                width: "220px",
                            }}
                        />

                    </Box>


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
                                    bgcolor: 'white',
                                    color: 'primary.main'
                                }}
                            >

                                <Person />

                            </Avatar>

                        </IconButton>

                    </Tooltip>


                    {/* ========================= */}
                    {/* ADMIN MENU */}
                    {/* ========================= */}

                    <Menu
                        sx={{
                            mt: '45px'
                        }}
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >


                        {/* ========================= */}
                        {/* PROFILE */}
                        {/* ========================= */}

                        <MenuItem
                            component={Link}
                            to="/profile"
                            onClick={handleCloseUserMenu}
                        >

                            Profile

                        </MenuItem>


                        {/* ========================= */}
                        {/* ACCOUNT */}
                        {/* ========================= */}

                        <MenuItem
                            component={Link}
                            to="/Account"
                            onClick={handleCloseUserMenu}
                        >

                            Account

                        </MenuItem>


                        {/* ========================= */}
                        {/* ADMIN DASHBOARD */}
                        {/* ========================= */}

                        <MenuItem
                            component={Link}
                            to="/admin/dashboard"
                            onClick={handleCloseUserMenu}
                        >

                            Admin Dashboard

                        </MenuItem>


                        {/* ========================= */}
                        {/* MANAGE USERS */}
                        {/* ========================= */}

                        <MenuItem
                            component={Link}
                            to="/admin/users"
                            onClick={handleCloseUserMenu}
                        >

                            Manage Users

                        </MenuItem>


                        {/* ========================= */}
                        {/* MANAGE PRODUCTS */}
                        {/* ========================= */}

                        <MenuItem
                            component={Link}
                            to="/admin/products"
                            onClick={handleCloseUserMenu}
                        >

                            Manage Products

                        </MenuItem>


                        {/* ========================= */}
                        {/* MANAGE CATEGORIES */}
                        {/* ========================= */}

                        <MenuItem
                            component={Link}
                            to="/admin/categories"
                            onClick={handleCloseUserMenu}
                        >

                            Manage Categories

                        </MenuItem>


                        {/* ========================= */}
                        {/* MANAGE ORDERS */}
                        {/* ========================= */}

                        <MenuItem
                            component={Link}
                            to="/admin/orders"
                            onClick={handleCloseUserMenu}
                        >

                            Manage Orders

                        </MenuItem>


                        {/* ========================= */}
                        {/* MANAGE CONTACTS */}
                        {/* ========================= */}

                        <MenuItem
                            component={Link}
                            to="/admin/contacts"
                            onClick={handleCloseUserMenu}
                        >

                            Manage Contacts

                        </MenuItem>


                        {/* ========================= */}
                        {/* LOGOUT */}
                        {/* ========================= */}

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