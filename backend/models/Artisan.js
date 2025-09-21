const mongoose = require('mongoose');

const artisanSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Artisan name is required'],
    trim: true,
    maxLength: [100, 'Name cannot be longer than 100 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^\+?[\d\s\-\(\)]+$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  
  // Profile Information
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
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
        'Mixed Media',
        'Other'
      ],
      message: '{VALUE} is not a supported specialty'
    }
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxLength: [1000, 'Description cannot be longer than 1000 characters']
  },
  
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      default: 'United States'
    },
    zipCode: String,
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  
  // Media
  profileImage: {
    type: String,
    default: null
  },
  
  portfolioImages: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Business Information
  businessName: String,
  
  website: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please enter a valid website URL'
    }
  },
  
  socialMedia: {
    instagram: String,
    facebook: String,
    twitter: String,
    pinterest: String,
    etsy: String
  },
  
  // Verification and Status
  verified: {
    type: Boolean,
    default: false
  },
  
  verificationDate: Date,
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Statistics
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
  
  totalProducts: {
    type: Number,
    default: 0
  },
  
  totalSales: {
    type: Number,
    default: 0
  },
  
  // Artisan Skills and Preferences
  techniques: [{
    type: String,
    enum: [
      'Hand-thrown pottery',
      'Wheel throwing',
      'Glazing',
      'Wood turning',
      'Carving',
      'Joinery',
      'Metal forging',
      'Welding',
      'Casting',
      'Weaving',
      'Knitting',
      'Embroidery',
      'Metalsmithing',
      'Stone setting',
      'Engraving',
      'Blown glass',
      'Fused glass',
      'Stained glass',
      'Oil painting',
      'Watercolor',
      'Acrylic',
      'Sculpting',
      'Other'
    ]
  }],
  
  materials: [String],
  
  customOrders: {
    accepts: {
      type: Boolean,
      default: true
    },
    leadTime: {
      type: String,
      enum: ['1-2 weeks', '2-4 weeks', '1-2 months', '2+ months'],
      default: '2-4 weeks'
    },
    minPrice: Number,
    maxPrice: Number
  },
  
  // Shipping and Policies
  shipping: {
    domestic: {
      available: {
        type: Boolean,
        default: true
      },
      cost: Number,
      freeShippingThreshold: Number
    },
    international: {
      available: {
        type: Boolean,
        default: false
      },
      cost: Number,
      countries: [String]
    }
  },
  
  policies: {
    returns: {
      accepted: {
        type: Boolean,
        default: true
      },
      timeframe: {
        type: String,
        default: '30 days'
      }
    },
    exchanges: {
      accepted: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // Timestamps
  joinedDate: {
    type: Date,
    default: Date.now
  },
  
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
artisanSchema.index({ location: 1 });
artisanSchema.index({ specialty: 1 });
artisanSchema.index({ verified: 1 });
artisanSchema.index({ 'rating.average': -1 });
artisanSchema.index({ isActive: 1 });
artisanSchema.index({ name: 'text', description: 'text', specialty: 'text' });

// Virtual for full address
artisanSchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state}, ${this.location.country}`;
});

// Virtual for location string
artisanSchema.virtual('locationString').get(function() {
  return `${this.location.city}, ${this.location.state}`;
});

// Pre-save middleware
artisanSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

// Instance methods
artisanSchema.methods.updateRating = function(newRating) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.count;
  return this.save();
};

artisanSchema.methods.incrementProductCount = function() {
  this.totalProducts += 1;
  return this.save();
};

artisanSchema.methods.decrementProductCount = function() {
  this.totalProducts = Math.max(0, this.totalProducts - 1);
  return this.save();
};

// Static methods
artisanSchema.statics.findByLocation = function(city, state) {
  return this.find({
    'location.city': new RegExp(city, 'i'),
    'location.state': new RegExp(state, 'i'),
    isActive: true
  });
};

artisanSchema.statics.findBySpecialty = function(specialty) {
  return this.find({
    specialty: specialty,
    isActive: true
  }).sort({ 'rating.average': -1 });
};

artisanSchema.statics.getTopRated = function(limit = 10) {
  return this.find({
    isActive: true,
    'rating.count': { $gte: 5 }
  }).sort({ 'rating.average': -1 }).limit(limit);
};

module.exports = mongoose.model('Artisan', artisanSchema);