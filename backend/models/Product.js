const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxLength: [200, 'Title cannot be longer than 200 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxLength: [2000, 'Description cannot be longer than 2000 characters']
  },
  
  // Artisan Information
  artisanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artisan',
    required: [true, 'Artisan ID is required']
  },
  
  artisanName: {
    type: String,
    required: [true, 'Artisan name is required']
  },
  
  // Categorization
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'Pottery & Ceramics',
        'Woodwork',
        'Metalwork',
        'Textiles',
        'Jewelry',
        'Glasswork',
        'Leatherwork',
        'Painting',
        'Sculpture',
        'Home Decor',
        'Furniture',
        'Kitchenware',
        'Art Prints',
        'Mixed Media',
        'Other'
      ],
      message: '{VALUE} is not a supported category'
    }
  },
  
  subcategory: String,
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Pricing
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  originalPrice: {
    type: Number,
    validate: {
      validator: function(v) {
        return !v || v >= this.price;
      },
      message: 'Original price must be greater than or equal to current price'
    }
  },
  
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  
  // Inventory
  inStock: {
    type: Boolean,
    default: true
  },
  
  stockQuantity: {
    type: Number,
    default: 1,
    min: [0, 'Stock quantity cannot be negative']
  },
  
  isOneOfAKind: {
    type: Boolean,
    default: true
  },
  
  // Physical Properties
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['inches', 'cm', 'feet', 'meters'],
      default: 'inches'
    }
  },
  
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['oz', 'lbs', 'g', 'kg'],
      default: 'lbs'
    }
  },
  
  materials: [{
    type: String,
    required: [true, 'At least one material is required']
  }],
  
  colors: [String],
  
  // Media
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  videos: [{
    url: String,
    thumbnail: String,
    description: String
  }],
  
  // AI Generated Content
  aiGenerated: {
    description: {
      content: String,
      confidence: Number,
      generatedAt: Date
    },
    tags: [{
      tag: String,
      confidence: Number
    }],
    category: {
      predicted: String,
      confidence: Number
    }
  },
  
  // Status and Visibility
  status: {
    type: String,
    enum: ['draft', 'active', 'sold', 'archived', 'pending'],
    default: 'active'
  },
  
  featured: {
    type: Boolean,
    default: false
  },
  
  featuredUntil: Date,
  
  // Ratings and Reviews
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot be more than 5']
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Production Information
  craftingTime: {
    type: String,
    enum: ['Less than 1 day', '1-3 days', '4-7 days', '1-2 weeks', '2-4 weeks', '1+ months']
  },
  
  techniques: [String],
  
  customizable: {
    available: {
      type: Boolean,
      default: false
    },
    options: [{
      type: String,
      choices: [String],
      additionalCost: Number
    }]
  },
  
  // Shipping
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    domesticCost: {
      type: Number,
      default: 0
    },
    internationalCost: Number,
    processingTime: {
      type: String,
      enum: ['Same day', '1-2 days', '3-5 days', '1-2 weeks'],
      default: '1-2 days'
    },
    fragile: {
      type: Boolean,
      default: false
    }
  },
  
  // SEO and Marketing
  seoTitle: String,
  seoDescription: String,
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  
  likes: {
    type: Number,
    default: 0
  },
  
  shares: {
    type: Number,
    default: 0
  },
  
  // Sales Information
  totalSales: {
    type: Number,
    default: 0
  },
  
  lastSold: Date,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  publishedAt: Date,
  
  archivedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ category: 1 });
productSchema.index({ artisanId: 1 });
productSchema.index({ price: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ inStock: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ status: 1 });
productSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for display price
productSchema.virtual('displayPrice').get(function() {
  return this.originalPrice && this.originalPrice > this.price ? 
    { current: this.price, original: this.originalPrice, onSale: true } :
    { current: this.price, onSale: false };
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0] || null;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Pre-save middleware
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Generate slug if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      + '-' + Date.now();
  }
  
  // Set published date when status changes to active
  if (this.status === 'active' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Ensure at least one image has isPrimary set to true
  if (this.images.length > 0 && !this.images.some(img => img.isPrimary)) {
    this.images[0].isPrimary = true;
  }
  
  next();
});

// Instance methods
productSchema.methods.updateRating = function(newRating) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.count;
  return this.save();
};

productSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

productSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

productSchema.methods.markAsSold = function() {
  this.status = 'sold';
  this.inStock = false;
  this.stockQuantity = 0;
  this.lastSold = new Date();
  this.totalSales += 1;
  return this.save();
};

// Static methods
productSchema.statics.findByCategory = function(category) {
  return this.find({
    category: category,
    status: 'active',
    inStock: true
  }).sort({ createdAt: -1 });
};

productSchema.statics.findByArtisan = function(artisanId) {
  return this.find({
    artisanId: artisanId,
    status: 'active'
  }).sort({ createdAt: -1 });
};

productSchema.statics.findFeatured = function(limit = 10) {
  return this.find({
    featured: true,
    status: 'active',
    inStock: true,
    $or: [
      { featuredUntil: { $exists: false } },
      { featuredUntil: { $gte: new Date() } }
    ]
  }).sort({ createdAt: -1 }).limit(limit);
};

productSchema.statics.findTopRated = function(limit = 10) {
  return this.find({
    status: 'active',
    inStock: true,
    'rating.count': { $gte: 5 }
  }).sort({ 'rating.average': -1 }).limit(limit);
};

productSchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  return this.find({
    price: { $gte: minPrice, $lte: maxPrice },
    status: 'active',
    inStock: true
  }).sort({ price: 1 });
};

productSchema.statics.searchProducts = function(query) {
  return this.find({
    $text: { $search: query },
    status: 'active',
    inStock: true
  }, {
    score: { $meta: 'textScore' }
  }).sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Product', productSchema);