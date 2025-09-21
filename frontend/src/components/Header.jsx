import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountCircle,
  Mic as MicIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Artisans', path: '/artisans' },
    { label: 'Products', path: '/products' },
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
        <Toolbar>
          {/* Logo/Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <PaletteIcon sx={{ mr: 1, fontSize: 32 }} />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 'bold',
                cursor: 'pointer',
                letterSpacing: 1,
              }}
              onClick={() => navigate('/')}
            >
              Artifind
            </Typography>
          </Box>

          {/* Navigation */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Search and User Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => setShowSearch(!showSearch)}
              title="Search"
            >
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit" title="Voice Search">
              <MicIcon />
            </IconButton>
            <IconButton
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
                vertical: 'top',
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
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My Account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Search Bar */}
      {showSearch && (
        <Box sx={{ backgroundColor: 'primary.light', p: 2 }}>
          <SearchBar onClose={() => setShowSearch(false)} />
        </Box>
      )}
    </>
  );
};

export default Header;

import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton 
} from '@mui/material';
import { 
  Home as HomeIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#8B4513' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, fontWeight: 'bold' }}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          🎨 Artifind
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/')}
            title="Home"
          >
            <HomeIcon />
          </IconButton>
          
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/search')}
            title="Search"
          >
            <SearchIcon />
          </IconButton>
          
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/artisans')}
            title="Artisans"
          >
            <PersonIcon />
          </IconButton>
          
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/chat')}
            title="Chat Assistant"
          >
            <ChatIcon />
          </IconButton>
          
          <Button 
            color="inherit" 
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;