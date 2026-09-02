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
    Badge
} from '@mui/material';

import React from 'react';

import LocalMallIcon from '@mui/icons-material/LocalMall';

import {
    ShoppingCart,
    Person
} from '@mui/icons-material';

import { Link } from 'react-router-dom';


type NavigationPage = {
    link: string;
    menuItem: string;
};

type settingpage = {
    settingitem: string;
    settinglink: string;
};


function Topbar({
    pages,
    settings
}:
{
    pages: NavigationPage[];
    settings: settingpage[];
}) {

    const [search, setSearch] = React.useState('');

    const [cartCount, setCartCount] = React.useState(0);

    const [anchorElUser, setAnchorElUser] =
        React.useState<null | HTMLElement>(null);


    const handleOpenUserMenu = (
        event: React.MouseEvent<HTMLElement>
    ) => {
        setAnchorElUser(event.currentTarget);
    };


    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    return (

        <AppBar position="fixed">

            <Container
                sx={{
                    
                    p: 0,
                    m: 0
                }}
                maxWidth='xl'
            
            >

                <Toolbar disableGutters>


                    {/* Logo Icon */}

                    <LocalMallIcon
                        sx={{
                            display: {
                                xs: 'none',
                                md: 'flex'
                            },
                            mr: 1
                        }}
                    />


                    {/* E-Commerce */}

                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
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


                    {/* Navigation Links */}

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flexGrow: 1
                        }}
                    >

                        {pages.map((item) => (

                            <Link
                                key={item.link}
                                to={item.link}
                                style={{
                                    color: 'white',
                                    textDecoration: 'none'
                                }}
                            >
                                {item.menuItem}
                            </Link>

                        ))}

                    </Box>


                    {/* Search */}
                        <Box sx={{display:'flex', flexDirection:'row',alignItems:'flex-end'}}>
                    <TextField
                        type="text"

                        value={search}

                        onChange={(e) =>
                            setSearch(e.target.value)
                        }

                        placeholder="Search"

                        size="small"

                        sx={{
                            backgroundColor: 'white',
                            borderRadius: 1,
                            width: '220px'
                        }}
                    />


                    {/* Cart Icon */}

                    <IconButton
                        component={Link}
                        to="/cart"
                        sx={{
                            color: 'white',
                            ml: 2
                        }}
                    >

                        <Badge
                            badgeContent={cartCount}
                            color="error"
                        >

                            <ShoppingCart />

                        </Badge>

                    </IconButton>


                    {/* User Icon */}

                    <Tooltip title="User Account">

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


                    {/* User Menu */}

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

                        {settings.map((item) => (

                            <MenuItem
                                key={item.settinglink}
                                component={Link}
                                to={item.settinglink}
                                onClick={handleCloseUserMenu}
                            >
                                {item.settingitem}
                            </MenuItem>

                        ))}

                    </Menu>

                    </Box>

                </Toolbar>

            </Container>

        </AppBar>

    );
}


export default Topbar;

