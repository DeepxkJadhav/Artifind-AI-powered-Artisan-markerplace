# Artifind

**AI-powered web application for local artisans**

Artifind is a modern web platform that connects local artisans with buyers through AI-enhanced discovery, image recognition, voice search, and intelligent chatbot assistance.

## ✨ Features

- **AI-Powered Image Recognition**: Automatically categorize and tag artisan products
- **Voice Search**: Find products using natural voice commands with Google Speech-to-Text
- **Intelligent Chatbot**: Get personalized recommendations and product information
- **Artisan Profiles**: Showcase crafters and their unique stories
- **Smart Product Discovery**: Advanced search and filtering capabilities
- **Text Generation**: AI-generated product descriptions and content

## 🚀 Technology Stack

### Frontend
- **React.js** with **Vite** for fast development
- **React Router** for navigation
- **Material-UI** or **Tailwind CSS** for styling
- **Axios** for API communication
- **Google Speech-to-Text** for voice input

### Backend
- **Node.js** with **Express.js**
- **MongoDB** or **PostgreSQL** for data storage
- **Multer** for file upload handling
- **AI Integration**:
  - Google Vision API for image recognition
  - OpenAI/Claude for text generation
  - Custom chatbot logic

### Development & Deployment
- **Docker** and **Docker Compose**
- **Git** for version control
- Environment-based configuration

## 📁 Project Structure

```
artifind/
├── frontend/          # React.js application
├── backend/           # Node.js/Express API server
├── docs/              # Documentation and guides
├── docker-compose.yml # Development environment setup
├── package.json       # Root package configuration
└── README.md          # This file
```

## 🛠️ Quick Start

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd artifind
   npm run install:all
   ```

2. **Start development servers**:
   ```bash
   npm run dev
   ```
   This starts both frontend (http://localhost:5174) and backend (http://localhost:3001)

3. **Build for production**:
   ```bash
   npm run build
   ```

## 🚀 Deploy on Vercel

### Automatic Deployment (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Import Project"
   - Select your `artifind` repository
   - Vercel will auto-detect the configuration
   - Click "Deploy"

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# For production deployment
vercel --prod
```

Your app will be live at `https://your-project.vercel.app`

## 🎯 Development Roadmap

- [x] Project initialization and structure
- [ ] Frontend React components and routing
- [ ] Backend API endpoints and middleware
- [ ] AI service integrations
- [ ] Voice input implementation
- [ ] Chatbot development
- [ ] Database schema and models
- [ ] Authentication and security
- [ ] Testing and optimization
- [ ] Deployment configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**DeepakJadhav**

---

*Empowering local artisans through AI technology* 🎨✨