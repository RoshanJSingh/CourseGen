# CourseGen backend (Text-to-Learn)

The API behind CourseGen. It is built with Node.js, Express and MongoDB, and uses Google Gemini to write the course content.

## What it does

- Generates a structured course from a short topic prompt
- Handles login with Auth0
- Stores lessons as flexible content blocks (text, code, video, quizzes and more)
- Suggests YouTube videos for lessons
- Translates lessons into Hinglish and can generate Hinglish audio
- Exports lessons as PDFs
- Keeps simple stats for courses and lessons

## Tech

- **Runtime:** Node.js 18+
- **Framework:** Express
- **Database:** MongoDB with Mongoose
- **Login:** Auth0 (JWT)
- **AI:** Google Gemini
- **Videos:** YouTube Data API v3
- **Validation:** express-validator
- **Security:** Helmet, CORS, rate limiting

## What you need

- Node.js 18.0.0 or newer
- MongoDB, local or on MongoDB Atlas
- An Auth0 account
- A Google Gemini API key
- A YouTube Data API v3 key

## Setup

1. Get the code:
   ```bash
   git clone https://github.com/RoshanJSingh/CourseGen.git
   cd CourseGen/server
   ```

2. Install the packages:
   ```bash
   npm install
   ```

3. Create your config file:
   ```bash
   cp .env.example .env
   ```

   Then fill in `.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/text-to-learn

   # Auth0
   AUTH0_ISSUER=https://your-auth0-domain.auth0.com/
   AUTH0_AUDIENCE=your-api-identifier

   # AI services
   GEMINI_API_KEY=your-google-genai-key
   YOUTUBE_API_KEY=your-youtube-data-api-key

   # CORS
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

## API

"Login" means the route needs a valid Auth0 token.

### Auth

- `GET /api/auth/status`: auth setup info
- `GET /api/auth/profile`: your profile (login)
- `GET /api/auth/verify`: check a token (login)

### Courses

- `POST /api/courses/suggestions`: course ideas
- `GET /api/courses`: your courses (login)
- `POST /api/courses`: generate a new course (login)
- `GET /api/courses/stats`: course stats (login)
- `GET /api/courses/:id`: one course (login)
- `PUT /api/courses/:id`: update a course (login)
- `DELETE /api/courses/:id`: delete a course (login)

### Lessons

- `GET /api/lessons/:id`: get a lesson, generating content if needed (login)
- `PUT /api/lessons/:id`: update a lesson (login)
- `GET /api/lessons/:id/pdf`: download the lesson as a PDF (login)
- `POST /api/lessons/:id/blocks`: add a content block (login)
- `PUT /api/lessons/:id/blocks/:index`: edit a content block (login)
- `DELETE /api/lessons/:id/blocks/:index`: remove a content block (login)
- `POST /api/lessons/:id/audio/hinglish`: make Hinglish audio (login)
- `GET /api/lessons/:id/analytics`: lesson stats (login)

### AI

- `GET /api/ai/status`: check the AI service
- `POST /api/ai/course-suggestions`: course ideas from Gemini
- `POST /api/ai/generate-course`: generate a course outline (login)
- `POST /api/ai/generate-lesson`: generate lesson content (login)
- `POST /api/ai/translate-hinglish`: translate to Hinglish (login)

### YouTube

- `GET /api/youtube/search`: search educational videos
- `GET /api/youtube/trending`: trending educational videos
- `GET /api/youtube/validate`: check a YouTube URL
- `GET /api/youtube/captions/:videoId`: a video's captions
- `GET /api/youtube/embed/:videoId`: embed HTML for a video

## Folder layout

```
server/
├── config/
│   └── database.js          MongoDB connection
├── controllers/
│   ├── courseController.js  course logic
│   └── lessonController.js  lesson logic
├── middlewares/
│   ├── auth.js              Auth0 check
│   └── errorHandler.js      error handling
├── models/
│   ├── Course.js
│   ├── Module.js
│   └── Lesson.js
├── routes/
│   ├── auth.js
│   ├── courses.js
│   ├── lessons.js
│   ├── ai.js
│   └── youtube.js
├── services/
│   ├── aiService.js         Google Gemini
│   └── youtubeService.js    YouTube Data API
├── utils/
│   └── helpers.js
└── server.js                entry point
```

## Data models

- **Course:** title, description, who made it, its modules, and extra info like tags, difficulty and estimated hours
- **Module:** a section of a course, with its lessons, order and goals
- **Lesson:** the lesson content as a list of JSON blocks, plus whether the AI has filled it in yet

## Content blocks

A lesson is a list of blocks like these:

- **Heading:** `{ type: "heading", text: "...", level: 2 }`
- **Paragraph:** `{ type: "paragraph", text: "..." }`
- **Code:** `{ type: "code", language: "javascript", text: "...", title: "..." }`
- **List:** `{ type: "list", style: "unordered", items: [...] }`
- **Video:** `{ type: "video", query: "...", url: "..." }`
- **Multiple choice:** `{ type: "mcq", question: "...", options: [...], answer: 1, explanation: "..." }`
- **Image:** `{ type: "image", url: "...", alt: "...", caption: "..." }`

## Errors

Errors always come back in the same shape:

```json
{
  "success": false,
  "error": "Error message",
  "details": []
}
```

`details` is only there for validation errors.

## Scripts

- `npm start`: run the server
- `npm run dev`: run with nodemon, restarting on changes
- `npm test`: no tests yet

## Deploying

1. Set `NODE_ENV=production`
2. Point `MONGO_URI` at your production database
3. Set up an Auth0 application for production
4. Add your production API keys

Render works well for this, but any Node host will do.

## Logging and health

- Requests are logged with Morgan
- Errors are logged to the console
- `GET /health` reports uptime
- The server shuts down cleanly when stopped
