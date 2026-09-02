import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  Button,
  IconButton,
  Avatar,
  TextField, Badge
} from '@mui/material';

import React from 'react';

import LocalMallIcon from '@mui/icons-material/LocalMall';

import { Search, Settings, ShoppingCart, Person } from '@mui/icons-material';

import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Topbar from '../Component/Topbar';



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





function Home() {
  return(
    <Topbar
      pages={pages1}
      settings={settings1}
    />
  )
  
}

export default Home;