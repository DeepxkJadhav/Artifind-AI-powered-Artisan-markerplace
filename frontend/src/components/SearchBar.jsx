import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Chip,
  Typography,
  Paper,
  Grow,
} from '@mui/material';
import {
  Search as SearchIcon,
  Mic as MicIcon,
  Close as CloseIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';

const SearchBar = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [suggestions] = useState([
    'Handmade pottery',
    'Wooden sculptures',
    'Traditional textiles',
    'Ceramic bowls',
    'Artisan jewelry',
  ]);

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // Mock voice search - in real app would use Web Speech API
    if (!isListening) {
      setTimeout(() => {
        setSearchTerm('handmade ceramic pottery');
        setIsListening(false);
      }, 2000);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
      // In real app, this would navigate to search results
      onClose?.();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
  };

  return (
    <Grow in={true}>
      <Paper elevation={3} sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for artisan products, materials, or styles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AIIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleVoiceSearch}
                    color={isListening ? 'secondary' : 'default'}
                    title="Voice Search"
                  >
                    <MicIcon />
                  </IconButton>
                  <IconButton onClick={handleSearch} color="primary">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {isListening && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="body2" color="secondary">
              🎤 Listening... Speak now
            </Typography>
          </Box>
        )}
        
        <Box>
          <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
            Popular searches:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                variant="outlined"
                size="small"
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>
      </Paper>
    </Grow>
  );
};

export default SearchBar;