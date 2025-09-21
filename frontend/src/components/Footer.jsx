import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Palette as PaletteIcon } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'primary.main',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <PaletteIcon />
          <Typography variant="body1" component="div">
            Artifind © 2024 - Empowering local artisans through AI technology
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ textAlign: 'center', mt: 1, opacity: 0.8 }}>
          Built with ❤️ for artisan communities
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;