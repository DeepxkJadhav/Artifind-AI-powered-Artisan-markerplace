const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/artisans');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Mock data for development
const mockArtisans = [
  {
    id: '1',
    name: 'Elena Rodriguez',
    specialty: 'Pottery & Ceramics',
    location: 'Santa Fe, NM',
    description: 'Traditional pottery maker with 15 years of experience in Southwestern ceramic art. Specializes in hand-thrown bowls, vases, and decorative pieces using traditional techniques passed down through generations.',
    profileImage: null,
    rating: {
      average: 4.8,
      count: 156
    },
    totalProducts: 45,
    verified: true,
    joinedDate: '2020-03-15',
    skills: ['Hand-throwing', 'Glazing', 'Traditional Southwest patterns', 'Kiln firing']
  },
  {
    id: '2',
    name: 'Marcus Chen',
    specialty: 'Wood Sculpture',
    location: 'Portland, OR',
    description: 'Master woodworker specializing in wildlife sculptures and custom furniture. Uses sustainable materials and traditional carving techniques to create unique pieces that celebrate nature.',
    profileImage: null,
    rating: {
      average: 4.9,
      count: 89
    },
    totalProducts: 38,
    verified: true,
    joinedDate: '2019-07-22',
    skills: ['Wood carving', 'Wildlife sculpture', 'Sustainable materials', 'Custom furniture']
  },
  {
    id: '3',
    name: 'Sofia Morales',
    specialty: 'Textile Arts',
    location: 'Austin, TX',
    description: 'Contemporary textile artist combining traditional weaving techniques with modern designs. Creates wall hangings, rugs, and decorative pieces that bridge cultural heritage with contemporary aesthetics.',
    profileImage: null,
    rating: {
      average: 5.0,
      count: 73
    },
    totalProducts: 28,
    verified: true,
    joinedDate: '2021-01-10',
    skills: ['Hand weaving', 'Natural dyes', 'Contemporary design', 'Cultural patterns']
  },
  {
    id: '4',
    name: 'Anna Silversmith',
    specialty: 'Jewelry Making',
    location: 'Sedona, AZ',
    description: 'Award-winning jewelry designer working primarily with sterling silver and natural gemstones. Creates unique pieces inspired by the desert landscape and Native American traditions.',
    profileImage: null,
    rating: {
      average: 4.9,
      count: 203
    },
    totalProducts: 67,
    verified: true,
    joinedDate: '2018-05-20',
    skills: ['Sterling silver', 'Gemstone setting', 'Desert-inspired designs', 'Traditional techniques']
  },
  {
    id: '5',
    name: 'David Glassworks',
    specialty: 'Glass Art',
    location: 'Seattle, WA',
    description: 'Professional glass artist specializing in blown glass sculptures, vases, and functional art pieces. Each piece is hand-blown using traditional techniques with modern artistic flair.',
    profileImage: null,
    rating: {
      average: 4.6,
      count: 94
    },
    totalProducts: 52,
    verified: true,
    joinedDate: '2020-08-14',
    skills: ['Glass blowing', 'Color techniques', 'Sculptural forms', 'Functional art']
  },
  {
    id: '6',
    name: 'Maria Textiles',
    specialty: 'Traditional Weaving',
    location: 'Taos, NM',
    description: 'Fourth-generation weaver specializing in traditional wool blankets and textiles. Uses hand-spun wool and natural dyes to create pieces that honor ancestral weaving traditions.',
    profileImage: null,
    rating: {
      average: 4.8,
      count: 127
    },
    totalProducts: 34,
    verified: true,
    joinedDate: '2017-12-03',
    skills: ['Hand spinning', 'Natural dyes', 'Traditional patterns', 'Wool processing']
  }
];

// @route   GET /api/artisans
// @desc    Get all artisans with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { location, specialty, rating, limit = 10 } = req.query;
    
    let filteredArtisans = [...mockArtisans];
    
    // Apply filters
    if (location) {
      filteredArtisans = filteredArtisans.filter(artisan => 
        artisan.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (specialty) {
      filteredArtisans = filteredArtisans.filter(artisan =>
        artisan.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    }
    
    if (rating) {
      filteredArtisans = filteredArtisans.filter(artisan =>
        artisan.rating >= parseFloat(rating)
      );
    }
    
    // Limit results
    filteredArtisans = filteredArtisans.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      count: filteredArtisans.length,
      data: filteredArtisans
    });
  } catch (error) {
    console.error('Error fetching artisans:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching artisans'
    });
  }
});

// @route   GET /api/artisans/:id
// @desc    Get single artisan by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const artisan = mockArtisans.find(a => a.id === req.params.id);
    
    if (!artisan) {
      return res.status(404).json({
        success: false,
        error: 'Artisan not found'
      });
    }
    
    res.json({
      success: true,
      data: artisan
    });
  } catch (error) {
    console.error('Error fetching artisan:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching artisan'
    });
  }
});

// @route   POST /api/artisans
// @desc    Create new artisan profile
// @access  Private (authentication required)
router.post('/', upload.single('profileImage'), async (req, res) => {
  try {
    const {
      name,
      specialty,
      location,
      description,
      email,
      phone
    } = req.body;
    
    // Validation
    if (!name || !specialty || !location) {
      return res.status(400).json({
        success: false,
        error: 'Name, specialty, and location are required'
      });
    }
    
    const newArtisan = {
      id: String(mockArtisans.length + 1),
      name,
      specialty,
      location,
      description,
      email,
      phone,
      profileImage: req.file ? `/uploads/artisans/${req.file.filename}` : null,
      rating: 0,
      totalProducts: 0,
      verified: false,
      joinedDate: new Date().toISOString()
    };
    
    mockArtisans.push(newArtisan);
    
    res.status(201).json({
      success: true,
      data: newArtisan,
      message: 'Artisan profile created successfully'
    });
  } catch (error) {
    console.error('Error creating artisan:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating artisan profile'
    });
  }
});

// @route   PUT /api/artisans/:id
// @desc    Update artisan profile
// @access  Private (authentication required)
router.put('/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const artisanIndex = mockArtisans.findIndex(a => a.id === req.params.id);
    
    if (artisanIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Artisan not found'
      });
    }
    
    const updatedArtisan = {
      ...mockArtisans[artisanIndex],
      ...req.body,
      ...(req.file && { profileImage: `/uploads/artisans/${req.file.filename}` })
    };
    
    mockArtisans[artisanIndex] = updatedArtisan;
    
    res.json({
      success: true,
      data: updatedArtisan,
      message: 'Artisan profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating artisan:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating artisan profile'
    });
  }
});

// @route   DELETE /api/artisans/:id
// @desc    Delete artisan profile
// @access  Private (authentication required)
router.delete('/:id', async (req, res) => {
  try {
    const artisanIndex = mockArtisans.findIndex(a => a.id === req.params.id);
    
    if (artisanIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Artisan not found'
      });
    }
    
    mockArtisans.splice(artisanIndex, 1);
    
    res.json({
      success: true,
      message: 'Artisan profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting artisan:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting artisan profile'
    });
  }
});

module.exports = router;