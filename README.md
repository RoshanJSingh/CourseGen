# Text-to-Learn: AI-Powered Course Generator

Transform any topic into a structured, multi-module online course with AI-powered content generation, interactive elements, and multilingual support.

## Features

### Core Features
- **AI Course Generation**: Transform any topic prompt into comprehensive course content using Google Gemini AI
- **Multi-Modal Content**: Support for text, code blocks, videos, images, lists, and interactive MCQs
- **Hinglish Support**: AI-generated explanations in Hinglish with audio playback
- **YouTube Integration**: Automatic video recommendations and embedding
- **PDF Export**: Export lessons as beautifully formatted PDF documents
- **Progress Tracking**: User progress monitoring and course completion tracking
- **Responsive Design**: Modern, mobile-first UI built with Chakra UI

### Authentication & Security
- **Auth0 Integration**: Secure authentication and user management
- **Protected Routes**: Role-based access control
- **JWT Token Management**: Secure API communication
- **Data Validation**: Input sanitization and validation

### User Experience
- **Modern UI**: Clean, intuitive interface with dark/light mode support
- **Interactive Learning**: MCQ quizzes with instant feedback
- **Course Navigation**: Easy lesson-to-lesson navigation
- **Search & Discovery**: Course recommendations and suggestions
- **User Profiles**: Personal dashboard with progress analytics

## Architecture

### Frontend (React + Vite)
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── blocks/         # Content block renderers
│   │   ├── Navbar.jsx      # Navigation component
│   │   ├── Sidebar.jsx     # Course navigation
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx    # Course creation
│   │   ├── CoursePage.jsx  # Course overview
│   │   ├── LessonPage.jsx  # Lesson viewer
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utilities and API helpers
│   └── main.jsx           # App entry point
└── package.json
```

### Backend (Node.js + Express)
```
server/
├── controllers/            # Request handlers
├── models/                # MongoDB schemas
├── routes/                # API routes
├── services/              # Business logic
├── middlewares/           # Custom middleware
├── utils/                 # Helper functions
├── config/                # Configuration
└── server.js             # Server entry point
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB database
- Auth0 account
- Google AI API key
- YouTube Data API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd text-to-learn
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 4. Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/text-to-learn

# Auth0
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-api-identifier

# Google AI
GOOGLE_API_KEY=your-google-ai-api-key

# YouTube
YOUTUBE_API_KEY=your-youtube-api-key

# Server
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-identifier
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Course Management
- `POST /api/courses` - Create a new course
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Lesson Management
- `GET /api/lessons/:id` - Get lesson details
- `PUT /api/lessons/:id` - Update lesson
- `POST /api/lessons/:id/complete` - Mark lesson complete
- `POST /api/lessons/:id/answer` - Submit quiz answer

### AI Services
- `POST /api/ai/generate-course` - Generate course from prompt
- `POST /api/ai/generate-lesson` - Generate lesson content
- `POST /api/ai/translate-hinglish` - Translate to Hinglish
- `POST /api/ai/suggestions` - Get topic suggestions

### YouTube Integration
- `GET /api/youtube/search` - Search videos
- `GET /api/youtube/video/:id` - Get video details
- `GET /api/youtube/embed/:id` - Get embed HTML
- `GET /api/youtube/captions/:id` - Get video captions

## 🔧 Content Block System

The platform supports various content block types:

### Text Blocks
- **Heading**: Different levels (H1-H6)
- **Paragraph**: Rich text content
- **List**: Ordered, unordered, checklist, pros/cons

### Media Blocks
- **Image**: With caption, fullscreen view, download
- **Video**: YouTube integration with captions
- **Code**: Syntax-highlighted code blocks

### Interactive Blocks
- **MCQ**: Single/multiple choice questions with explanations
- **Quiz**: Scored assessments with progress tracking

## 🌍 Multilingual Support

### Hinglish Integration
- AI-powered translation to Hinglish
- Audio generation for Hinglish content
- Cultural context awareness
- Code-switching support

### Implementation
```javascript
// Generate Hinglish explanation
const hinglishContent = await aiService.translateToHinglish(content, {
  context: 'educational',
  topic: 'programming',
  difficulty: 'beginner'
});

// Generate audio
const audioUrl = await aiService.generateHinglishAudio(hinglishContent);
```

## Component Usage

### Lesson Renderer
```jsx
import LessonRenderer from './components/LessonRenderer';

<LessonRenderer 
  content={lesson.content}
  onAnswer={handleMCQAnswer}
  isEditable={false}
/>
```

### PDF Export
```jsx
import LessonPDFExporter from './components/LessonPDFExporter';

<LessonPDFExporter 
  lesson={lesson}
  course={course}
  onExport={handleExportComplete}
/>
```

### Content Blocks
```jsx
// Each content block has a consistent structure
const contentBlock = {
  type: 'paragraph', // heading, code, video, mcq, list, image
  content: 'Block content...',
  // Block-specific properties
};
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
# Build the frontend
cd client
npm run build

# Deploy to Vercel
npx vercel --prod
```

### Backend Deployment (Render)
```bash
# Prepare backend
cd server
npm install --production

# Configure environment variables in Render dashboard
# Deploy using Render GitHub integration
```

### Production Checklist
- [ ] Environment variables configured
- [ ] MongoDB connection established
- [ ] Auth0 domains configured
- [ ] API keys secured
- [ ] CORS origins updated
- [ ] SSL certificates configured

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm run test
npm run test:coverage
```

### Backend Testing
```bash
cd server
npm run test
npm run test:integration
```

### E2E Testing
```bash
# Run Cypress tests
npm run test:e2e
```

## Performance Optimization

### Frontend Optimizations
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Bundle size analysis
- Caching strategies

### Backend Optimizations
- MongoDB indexing
- API response caching
- Rate limiting
- Request compression

## Monitoring & Analytics

### Error Tracking
- Frontend error boundaries
- Backend error middleware
- Logging with Morgan
- Performance monitoring

### User Analytics
- Course completion rates
- User engagement metrics
- Content performance tracking
- Learning path analysis

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write comprehensive tests
- Update documentation
- Use conventional commits

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Google Gemini AI** for content generation
- **Auth0** for authentication services
- **YouTube API** for video integration
- **Chakra UI** for component library
- **MongoDB** for data storage
- **Vercel & Render** for hosting services

## Support

For support, email support@text-to-learn.com or join our [Discord community](https://discord.gg/text-to-learn).

---

**Built with love for learners worldwide**
#   C o u r s e G e n  
 