import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Box,
  IconButton,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  PhotoCamera as PhotoCameraIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products`);
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      analyzeImage(file);
    }
  };

  const analyzeImage = async (file) => {
    try {
      setAnalyzing(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${API_URL}/ai/analyze-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setAiAnalysis(response.data.data);
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading amazing handcrafted products...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button onClick={fetchProducts} variant="contained" sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center" sx={{ mb: 2 }}>
          Handcrafted Products
        </Typography>
        <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mb: 6 }}>
          Discover unique, AI-curated artisan creations
        </Typography>

        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={product.image || `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=240&fit=crop`}
                  alt={product.title}
                  sx={{
                    objectFit: 'cover',
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {product.title}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {product.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      By {product.artisan}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      📍 {product.location}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {product.tags?.slice(0, 3).map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>

                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    {product.price}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <IconButton size="small" color="primary">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <ShareIcon />
                    </IconButton>
                  </Box>
                  <Button 
                    size="small" 
                    variant="contained"
                    sx={{ borderRadius: 2 }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {products.length === 0 && !loading && (
          <Paper sx={{ p: 6, textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="textSecondary">
              No products found. Check back soon!
            </Typography>
          </Paper>
        )}
      </Container>

      {/* AI Image Analysis FAB */}
      <Fab
        color="secondary"
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          zIndex: 1000,
        }}
        onClick={() => setAiDialogOpen(true)}
      >
        <PhotoCameraIcon />
      </Fab>

      {/* AI Image Analysis Dialog */}
      <Dialog 
        open={aiDialogOpen} 
        onClose={() => setAiDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          🤖 AI Image Analysis
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Upload an image to find similar artisan products using our AI technology
          </Typography>
          
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<UploadIcon />}
              sx={{ mb: 2, py: 2 }}
            >
              Choose Image
            </Button>
          </label>

          {uploadedImage && (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Uploaded: {uploadedImage.name}
              </Typography>
              {analyzing && <CircularProgress size={24} />}
            </Box>
          )}

          {aiAnalysis && (
            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="h6" gutterBottom>
                ✨ AI Analysis Results
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Categories:</strong> {aiAnalysis.categories?.join(', ')}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Materials:</strong> {aiAnalysis.materials?.join(', ')}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Style:</strong> {aiAnalysis.style}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Confidence:</strong> {Math.round((aiAnalysis.confidence || 0) * 100)}%
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                {aiAnalysis.suggestions?.[0]}
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiDialogOpen(false)}>Close</Button>
          {aiAnalysis && (
            <Button variant="contained" onClick={() => setAiDialogOpen(false)}>
              Find Similar Products
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductsPage;