# Artifind Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB 7.0+ (or MongoDB Atlas)
- Git

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd artifind
   ```

2. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**:
   ```bash
   # Copy environment templates
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Edit the .env files with your API keys and configuration
   ```

4. **Start development servers**:
   ```bash
   npm run dev
   ```

This starts:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📁 Project Structure

```
artifind/
├── frontend/              # React.js application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API and external services
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── contexts/      # React contexts
│   ├── public/            # Static assets
│   └── package.json
├── backend/               # Node.js/Express API
│   ├── routes/            # API route handlers
│   ├── models/            # Database models (Mongoose)
│   ├── services/          # Business logic services
│   ├── middleware/        # Express middleware
│   ├── config/            # Configuration files
│   └── package.json
├── docs/                  # Documentation
└── docker-compose.yml     # Development environment
```

## 🛠️ Development Workflow

### Frontend Development

**Technology Stack:**
- React.js 18 with Vite
- Material-UI for components
- React Router for navigation
- Axios for API calls
- Web Speech API for voice input

**Key Components:**
- `Header.jsx` - Navigation bar with search and user menu
- `SearchBar.jsx` - AI-powered search with voice input
- `ChatBot.jsx` - Floating AI assistant
- `Footer.jsx` - Site footer with links

**Running Frontend Only:**
```bash
cd frontend
npm run dev
```

### Backend Development

**Technology Stack:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- Multer for file uploads
- Helmet for security
- Morgan for logging

**API Endpoints:**

#### Artisans (`/api/artisans`)
- `GET /` - Get all artisans (with filtering)
- `GET /:id` - Get single artisan
- `POST /` - Create artisan profile
- `PUT /:id` - Update artisan profile
- `DELETE /:id` - Delete artisan profile

#### Products (`/api/products`)
- `GET /` - Get products (with search & filtering)
- `GET /:id` - Get single product
- `GET /artisan/:artisanId` - Get products by artisan
- `GET /category/:category` - Get products by category
- `POST /` - Create new product
- `PUT /:id` - Update product
- `DELETE /:id` - Delete product

#### AI Services (`/api/ai`)
- `POST /analyze-image` - Analyze product images
- `POST /generate-description` - Generate product descriptions
- `POST /suggest-tags` - Suggest product tags
- `POST /enhance-search` - Enhance search queries
- `POST /personalize-recommendations` - Get recommendations

#### Chat (`/api/chat`)
- `POST /message` - Send message to AI chatbot
- `GET /history/:sessionId` - Get conversation history
- `DELETE /session/:sessionId` - Clear conversation
- `POST /voice-to-text` - Convert speech to text

**Running Backend Only:**
```bash
cd backend
npm run dev
```

### Database Schema

#### Artisan Model
```javascript
{
  name: String,
  email: String,
  specialty: String,
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: { latitude: Number, longitude: Number }
  },
  rating: { average: Number, count: Number },
  verified: Boolean,
  // ... more fields
}
```

#### Product Model
```javascript
{
  title: String,
  description: String,
  artisanId: ObjectId,
  category: String,
  price: Number,
  images: [{ url: String, alt: String, isPrimary: Boolean }],
  materials: [String],
  tags: [String],
  inStock: Boolean,
  // ... more fields
}
```

## 🤖 AI Integration

### Image Recognition
Uses Google Vision API to analyze product images:
```javascript
// Backend service
const analysis = await imageRecognitionService.analyzeProduct(imagePath);
// Returns categories, materials, colors, style suggestions
```

### Text Generation
Integration ready for OpenAI/Claude:
```javascript
// Generate product descriptions
const description = await aiService.generateDescription({
  imageAnalysis: analysis,
  productType: 'pottery',
  materials: ['clay', 'glaze']
});
```

### Voice Input
Frontend voice service using Web Speech API:
```javascript
// Voice search
const transcript = await voiceService.startListening({
  language: 'en-US',
  timeout: 10000
});
```

### Chatbot
Intelligent conversation handling:
```javascript
// Chat API
const response = await fetch('/api/chat/message', {
  method: 'POST',
  body: JSON.stringify({
    message: userMessage,
    sessionId: sessionId
  })
});
```

## 🔧 Configuration

### Environment Variables

**Backend (`.env`)**:
```bash
# Server
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=mongodb://localhost:27017/artifind

# AI Services
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_VISION_KEY_PATH=./config/service-account.json
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-claude-key

# Security
JWT_SECRET=your-jwt-secret
```

**Frontend (`.env`)**:
```bash
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_SPEECH_API_KEY=your-speech-api-key
```

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

### Test Structure
- Unit tests for services and utilities
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for user workflows

## 🚀 Deployment

### Docker Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment
```bash
# Build frontend
cd frontend && npm run build

# Start production server
cd backend && npm start
```

### Environment Setup
1. Configure production MongoDB
2. Set up AI service API keys
3. Configure file storage (AWS S3, Cloudinary)
4. Set up monitoring and logging
5. Configure SSL certificates

## 📊 Monitoring & Analytics

### Health Checks
- API health: `GET /api/health`
- Database health: Built into connection service
- Service monitoring with Winston logging

### Performance Metrics
- API response times
- Database query performance
- Image processing times
- Search response quality

## 🔐 Security

### Implemented Security Measures
- Helmet.js for security headers
- Rate limiting for API endpoints
- Input validation and sanitization
- CORS configuration
- File upload restrictions
- Environment variable protection

### Authentication (To Be Implemented)
- JWT-based authentication
- OAuth integration (Google, Facebook)
- Role-based access control
- Session management

## 🎨 UI/UX Guidelines

### Design System
- Material-UI components
- Consistent color palette (#8B4513 primary)
- Responsive design principles
- Accessibility compliance (WCAG)

### Component Guidelines
- Reusable component structure
- Props validation with PropTypes
- Consistent naming conventions
- Error boundary implementation

## 📝 API Documentation

### Response Format
```javascript
// Success Response
{
  success: true,
  data: { ... },
  message: "Operation completed successfully"
}

// Error Response
{
  success: false,
  error: "Error message",
  details: { ... }
}
```

### Pagination
```javascript
// Paginated endpoints include:
{
  success: true,
  data: [...],
  count: 12,      // Items in current page
  total: 150,     // Total items
  page: 1,        // Current page
  pages: 13       // Total pages
}
```

### Search & Filtering
Most endpoints support query parameters:
- `search` - Text search
- `category` - Filter by category
- `minPrice` / `maxPrice` - Price range
- `location` - Geographic filtering
- `sort` - Sort field
- `order` - Sort direction (asc/desc)
- `page` / `limit` - Pagination

## 🤝 Contributing

### Code Style
- ESLint for JavaScript/React
- Prettier for code formatting
- Consistent naming conventions
- Comprehensive commenting

### Git Workflow
1. Create feature branch from `main`
2. Make changes with clear commit messages
3. Test thoroughly
4. Create pull request
5. Code review and merge

### Pull Request Template
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Environment variables documented
- [ ] Breaking changes noted
- [ ] Performance impact assessed

---

For questions or issues, please check the [main README](../README.md) or create an issue in the repository.