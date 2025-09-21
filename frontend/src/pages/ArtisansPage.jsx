import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Box,
  Button,
  Paper,
  CircularProgress,
  Rating,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const ArtisansPage = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/artisans`);
      if (response.data.success) {
        setArtisans(response.data.data);
      } else {
        setError('Failed to fetch artisans');
      }
    } catch (err) {
      console.error('Error fetching artisans:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading talented artisans...
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
        <Button onClick={fetchArtisans} variant="contained" sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center" sx={{ mb: 6 }}>
        Meet Our Talented Artisans
      </Typography>
      <Typography variant="h6" textAlign="center" color="textSecondary" sx={{ mb: 6 }}>
        Discover the stories and crafts of skilled makers from around the world
      </Typography>

      <Grid container spacing={4}>
        {artisans.map((artisan) => (
          <Grid item xs={12} sm={6} md={4} key={artisan.id}>
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
              <Box sx={{ position: 'relative', textAlign: 'center', pt: 4 }}>
                <Avatar
                  src={artisan.profileImage}
                  sx={{
                    width: 100,
                    height: 100,
                    mx: 'auto',
                    border: '4px solid',
                    borderColor: 'primary.main',
                    fontSize: 40,
                  }}
                >
                  {artisan.name?.[0] || 'A'}
                </Avatar>
                {artisan.verified && (
                  <VerifiedIcon
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 80,
                      left: '50%',
                      transform: 'translateX(-50%) translateX(35px)',
                      bgcolor: 'white',
                      borderRadius: '50%',
                    }}
                  />
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {artisan.name}
                </Typography>

                <Chip
                  label={artisan.specialty}
                  color="primary"
                  sx={{ mb: 2, fontWeight: 'medium' }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="textSecondary">
                    {artisan.location}
                  </Typography>
                </Box>

                {artisan.rating && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Rating
                      value={artisan.rating.average || 0}
                      precision={0.1}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                      ({artisan.rating.count || 0} reviews)
                    </Typography>
                  </Box>
                )}

                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    mb: 3,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {artisan.description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', mb: 3 }}>
                  {artisan.skills?.slice(0, 3).map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 'auto',
                    borderRadius: 2,
                  }}
                >
                  View Profile & Products
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {artisans.length === 0 && !loading && (
        <Paper sx={{ p: 6, textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No artisans found. Check back soon!
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default ArtisansPage;