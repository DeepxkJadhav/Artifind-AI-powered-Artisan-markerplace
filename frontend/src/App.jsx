import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArtisansPage from './pages/ArtisansPage';
import ProductsPage from './pages/ProductsPage';
import ChatBot from './components/ChatBot';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // Saddle brown - artisan theme
      light: '#A0522D',
      dark: '#654321',
    },
    secondary: {
      main: '#D2691E', // Chocolate
      light: '#DEB887',
      dark: '#A0522D',
    },
    background: {
      default: '#FFF8DC', // Cornsilk
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/artisans" element={<ArtisansPage />} />
              <Route path="/products" element={<ProductsPage />} />
            </Routes>
          </Box>
          <Footer />
          <ChatBot />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
