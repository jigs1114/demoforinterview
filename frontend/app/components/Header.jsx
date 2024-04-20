'use client'
import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useRouter } from 'next/navigation'
import { LoginUserData } from '../apiservices/LoginUserData';


function Header() {
  const navigate = useRouter()
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null)
  useEffect(() => {


    return async () => {
      const uData = await LoginUserData();
      setUserData(uData);
    };
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickLogout = () => {
    navigate.push('/login')
    localStorage.removeItem('userToken')
  }

  return (

    <AppBar position="static">
      <Toolbar className='container'>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          POST
        </Typography>
        <div>
        <span>{userData?.first_name} {userData?.last_name}</span> <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
           <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={onClickLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header