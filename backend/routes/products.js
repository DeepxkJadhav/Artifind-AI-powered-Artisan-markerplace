const express = require('express');
const router = express.Router();

// Mock product data
const mockProducts = [
  {
    id: '1',
    title: 'Handcrafted Ceramic Bowl Set',
    description: 'Beautiful set of 4 ceramic bowls with traditional Southwest patterns',
    artisan: 'Elena Rodriguez',
    location: 'Santa Fe, NM',
    artisanId: '1',
    category: 'Pottery',
    price: '$89.99',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    tags: ['ceramic', 'bowls', 'traditional', 'southwest', 'handmade'],
    inStock: true,
    stockQuantity: 12,
    rating: 4.7,
    reviewCount: 23,
    featured: true
  },
  {
    id: '2',
    title: 'Carved Wooden Sculpture',
    description: 'Intricate hand-carved wooden sculpture depicting local wildlife',
    artisan: 'Marcus Chen',
    location: 'Portland, OR',
    artisanId: '2',
    category: 'Art',
    price: '$156.00',
    image: 'https://images.unsplash.com/photo-1544967919-4f8c07d68a0f?w=400&h=300&fit=crop',
    tags: ['wood', 'sculpture', 'art', 'wildlife', 'carved'],
    inStock: true,
    stockQuantity: 3,
    rating: 4.8,
    reviewCount: 12,
    featured: true
  },
  {
    id: '3',
    title: 'Woven Textile Wall Art',
    description: 'Contemporary woven wall hanging using traditional techniques',
    artisan: 'Sofia Morales',
    location: 'Austin, TX',
    artisanId: '3',
    category: 'Textiles',
    price: '$234.50',
    image: 'https://images.unsplash.com/photo-1558618047-77e2a7b314d6?w=400&h=300&fit=crop',
    tags: ['textile', 'weaving', 'wall-art', 'contemporary'],
    inStock: true,
    stockQuantity: 5,
    rating: 5.0,
    reviewCount: 18,
    featured: true
  },
  {
    id: '4',
    title: 'Sterling Silver Jewelry Set',
    description: 'Handcrafted sterling silver necklace and earring set with turquoise stones',
    artisan: 'Anna Silversmith',
    location: 'Sedona, AZ',
    artisanId: '4',
    category: 'Jewelry',
    price: '$189.99',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
    tags: ['jewelry', 'silver', 'turquoise', 'handmade', 'southwest'],
    inStock: true,
    stockQuantity: 8,
    rating: 4.9,
    reviewCount: 27,
    featured: false
  },
  {
    id: '5',
    title: 'Artisan Glass Vase Collection',
    description: 'Set of 3 blown glass vases with unique color patterns',
    artisan: 'David Glassworks',
    location: 'Seattle, WA',
    artisanId: '5',
    category: 'Glass Art',
    price: '$145.00',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    tags: ['glass', 'vase', 'blown-glass', 'colorful', 'modern'],
    inStock: true,
    stockQuantity: 6,
    rating: 4.6,
    reviewCount: 15,
    featured: false
  },
  {
    id: '6',
    title: 'Handwoven Wool Blanket',
    description: 'Traditional wool blanket with geometric patterns, perfect for home decor',
    artisan: 'Maria Textiles',
    location: 'Taos, NM',
    artisanId: '6',
    category: 'Textiles',
    price: '$295.00',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    tags: ['wool', 'blanket', 'geometric', 'traditional', 'handwoven'],
    inStock: true,
    stockQuantity: 4,
    rating: 4.8,
    reviewCount: 22,
    featured: false
  }
];

// @route   GET /api/products
// @desc    Get all products with filtering and search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      artisan,
      minPrice,
      maxPrice,
      inStock,
      featured,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    let filteredProducts = [...mockProducts];

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (artisan) {
      filteredProducts = filteredProducts.filter(product =>
        product.artisanId === artisan
      );
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product =>
        product.price <= parseFloat(maxPrice)
      );
    }

    if (inStock === 'true') {
      filteredProducts = filteredProducts.filter(product => product.inStock);
    }

    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(product => product.featured);
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aValue = a[sort];
      let bValue = b[sort];

      if (sort === 'price' || sort === 'rating') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sort === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      success: true,
      count: paginatedProducts.length,
      total: filteredProducts.length,
      page: parseInt(page),
      pages: Math.ceil(filteredProducts.length / parseInt(limit)),
      data: paginatedProducts
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching products'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = mockProducts.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching product'
    });
  }
});

// @route   GET /api/products/artisan/:artisanId
// @desc    Get products by artisan
// @access  Public
router.get('/artisan/:artisanId', async (req, res) => {
  try {
    const artisanProducts = mockProducts.filter(p => p.artisanId === req.params.artisanId);

    res.json({
      success: true,
      count: artisanProducts.length,
      data: artisanProducts
    });
  } catch (error) {
    console.error('Error fetching artisan products:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching artisan products'
    });
  }
});

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const categoryProducts = mockProducts.filter(p => 
      p.category.toLowerCase() === req.params.category.toLowerCase()
    );

    res.json({
      success: true,
      count: categoryProducts.length,
      data: categoryProducts
    });
  } catch (error) {
    console.error('Error fetching category products:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching category products'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private (artisan only)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      artisanId,
      category,
      price,
      images,
      tags,
      stockQuantity,
      dimensions,
      weight,
      materials
    } = req.body;

    // Validation
    if (!title || !description || !artisanId || !category || !price) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, artisan ID, category, and price are required'
      });
    }

    const newProduct = {
      id: String(mockProducts.length + 1),
      title,
      description,
      artisanId,
      category,
      price: parseFloat(price),
      images: images || [],
      tags: tags || [],
      inStock: stockQuantity > 0,
      stockQuantity: parseInt(stockQuantity) || 0,
      dimensions,
      weight,
      materials: materials || [],
      createdAt: new Date().toISOString(),
      featured: false,
      rating: 0,
      reviewCount: 0
    };

    mockProducts.push(newProduct);

    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating product'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (artisan only)
router.put('/:id', async (req, res) => {
  try {
    const productIndex = mockProducts.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const updatedProduct = {
      ...mockProducts[productIndex],
      ...req.body,
      price: req.body.price ? parseFloat(req.body.price) : mockProducts[productIndex].price,
      stockQuantity: req.body.stockQuantity ? parseInt(req.body.stockQuantity) : mockProducts[productIndex].stockQuantity,
      inStock: req.body.stockQuantity ? req.body.stockQuantity > 0 : mockProducts[productIndex].inStock
    };

    mockProducts[productIndex] = updatedProduct;

    res.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating product'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (artisan only)
router.delete('/:id', async (req, res) => {
  try {
    const productIndex = mockProducts.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    mockProducts.splice(productIndex, 1);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting product'
    });
  }
});

module.exports = router;