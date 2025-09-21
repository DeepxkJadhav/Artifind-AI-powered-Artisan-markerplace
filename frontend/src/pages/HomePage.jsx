import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Avatar,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Upload as UploadIcon,
  Mic as MicIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Mock featured products
    setFeaturedProducts([
      {
        id: 1,
        title: 'Handcrafted Ceramic Bowl Set',
        price: '$89.99',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        artisan: 'Elena Rodriguez',
        location: 'Santa Fe, NM',
        rating: 4.9,
        tags: ['pottery', 'ceramic', 'handmade'],
      },
      {
        id: 2,
        title: 'Carved Wooden Sculpture',
        price: '$156.00',
        image: 'https://images.unsplash.com/photo-1544967919-4f8c07d68a0f?w=400&h=300&fit=crop',
        artisan: 'Marcus Chen',
        location: 'Portland, OR',
        rating: 4.8,
        tags: ['wood', 'sculpture', 'art'],
      },
      {
        id: 3,
        title: 'Woven Textile Wall Art',
        price: '$234.50',
        image: 'https://images.unsplash.com/photo-1558618047-77e2a7b314d6?w=400&h=300&fit=crop',
        artisan: 'Sofia Morales',
        location: 'Austin, TX',
        rating: 5.0,
        tags: ['textile', 'weaving', 'wall-art'],
      },
    ]);
  }, []);

  const aiFeatures = [
    {
      icon: <UploadIcon fontSize="large" />,
      title: 'Image Recognition',
      description: 'Upload photos to find similar artisan products',
      color: '#1976d2',
    },
    {
      icon: <MicIcon fontSize="large" />,
      title: 'Voice Search',
      description: 'Speak naturally to discover unique crafts',
      color: '#ed6c02',
    },
    {
      icon: <AIIcon fontSize="large" />,
      title: 'Smart Recommendations',
      description: 'AI-powered suggestions based on your preferences',
      color: '#2e7d32',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(139,69,19,0.8) 0%, rgba(160,82,45,0.8) 100%), url("https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=1200&h=600&fit=crop") center/cover',
          color: 'white',
          py: 12,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Discover Amazing Artisan Crafts
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            AI-powered marketplace connecting you with local makers and their unique handcrafted treasures
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
              onClick={() => navigate('/products')}
            >
              Explore Products
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
              onClick={() => navigate('/artisans')}
            >
              Meet Artisans
            </Button>
          </Box>
        </Container>
      </Box>

      {/* AI Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          Powered by AI Technology
        </Typography>
        <Grid container spacing={4}>
          {aiFeatures.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  height: '100%',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <Box sx={{ color: feature.color, mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
            Featured Handcrafted Products
          </Typography>
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateY(-5px)' },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3">
                      {product.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                        {product.artisan[0]}
                      </Avatar>
                      <Typography variant="body2" color="textSecondary">
                        {product.artisan}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'textSecondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        {product.location}
                      </Typography>
                      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                        <StarIcon fontSize="small" sx={{ color: '#ffa726', mr: 0.5 }} />
                        <Typography variant="body2">{product.rating}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      {product.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      ))}
                    </Box>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      {product.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton size="small">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton size="small">
                      <ShareIcon />
                    </IconButton>
                    <Button size="small" variant="contained" sx={{ ml: 'auto' }}>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/products')}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
            Join the Artifind Community
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ mb: 4, opacity: 0.9 }}>
            Connect with talented artisans and discover one-of-a-kind handcrafted treasures
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' }, mr: 2 }}
            >
              Start Shopping
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Become an Artisan
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;