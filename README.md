# CourseGen (Text-to-Learn)

Type in a topic and CourseGen builds a full online course for it: modules, lessons, code examples, quizzes and suggested YouTube videos. The content is written by Google Gemini, and lessons can also be explained in Hinglish.

The project has two parts:

- `server/`: a Node.js and Express API that does the real work (course generation, lessons, YouTube search, Hinglish translation and PDF export), with MongoDB for storage and Auth0 for login.
- `client/`: a simple web page in plain HTML, CSS and JavaScript that talks to the API.

## Features

- Turns any topic into a course made of modules and lessons, using Gemini.
- Lessons are built from content blocks: headings, paragraphs, code, lists, images, videos and multiple choice questions.
- Suggests and embeds relevant YouTube videos for each lesson.
- Translates lesson content into Hinglish, and can generate Hinglish audio.
- Exports a lesson as a PDF.
- Keeps stats for each course and lesson.
- Login with Auth0. Most routes need a signed-in user.
- Helmet security headers, rate limiting, CORS rules and input validation on every route.
- A `/health` endpoint for uptime checks.

## Tech

| Part | Tools |
|:---|:---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express, MongoDB (Mongoose), PDFKit |
| AI and data | Google Gemini, YouTube Data API |
| Auth and ops | Auth0, Helmet, Morgan, express-rate-limit |

## Layout

```
CourseGen/
├── client/          index.html, app.js, style.css
├── server/
│   ├── config/      database connection
│   ├── controllers/ course and lesson logic
│   ├── middlewares/ Auth0 check and error handling
│   ├── models/      Mongoose schemas (Course, Module, Lesson)
│   ├── routes/      auth, courses, lessons, ai, youtube
│   ├── services/    Gemini and YouTube API code
│   └── server.js    entry point
└── scripts/         build and deploy helpers
```

## Getting started

You will need Node.js 18 or newer, a MongoDB database (local or Atlas), a Gemini API key, a YouTube Data API key and an Auth0 account.

```bash
git clone https://github.com/RoshanJSingh/CourseGen.git
cd CourseGen/server
npm install
cp .env.example .env    # then fill in your keys
npm run dev             # API runs on http://localhost:5000
```

The client is a static page, so any local server will do. In a second terminal:

```bash
cd CourseGen/client
python -m http.server 5173
```

Then open http://localhost:5173.

## API

All routes are under `/api`. Routes marked "login" need a valid Auth0 token.

**Courses**

| Method | Route | What it does |
|:---|:---|:---|
| `POST` | `/courses/suggestions` | suggest course ideas |
| `POST` | `/courses` | generate a new course from a topic (login) |
| `GET` | `/courses` | list your courses (login) |
| `GET` | `/courses/stats` | stats across your courses (login) |
| `GET` | `/courses/:id` | get one course (login) |
| `PUT` | `/courses/:id` | update a course (login) |
| `DELETE` | `/courses/:id` | delete a course (login) |

**Lessons** (all need login)

| Method | Route | What it does |
|:---|:---|:---|
| `GET` | `/lessons/:id` | get a lesson, generating its content if needed |
| `PUT` | `/lessons/:id` | update a lesson |
| `GET` | `/lessons/:id/pdf` | download the lesson as a PDF |
| `POST` | `/lessons/:id/blocks` | add a content block |
| `PUT` | `/lessons/:id/blocks/:index` | edit a content block |
| `DELETE` | `/lessons/:id/blocks/:index` | remove a content block |
| `POST` | `/lessons/:id/audio/hinglish` | make Hinglish audio for the lesson |
| `GET` | `/lessons/:id/analytics` | lesson stats |

**AI, YouTube and auth**

| Method | Route | What it does |
|:---|:---|:---|
| `GET` | `/ai/status` | check the AI service |
| `POST` | `/ai/course-suggestions` | course ideas from Gemini |
| `POST` | `/ai/generate-course` | generate a course outline (login) |
| `POST` | `/ai/generate-lesson` | generate lesson content (login) |
| `POST` | `/ai/translate-hinglish` | translate text to Hinglish (login) |
| `GET` | `/youtube/search` | search for educational videos |
| `GET` | `/youtube/trending` | trending educational videos |
| `GET` | `/youtube/validate` | check a YouTube URL |
| `GET` | `/youtube/captions/:videoId` | get a video's captions |
| `GET` | `/youtube/embed/:videoId` | get embed HTML for a video |
| `GET` | `/auth/status` | auth setup info |
| `GET` | `/auth/profile` | your profile (login) |
| `GET` | `/auth/verify` | check a token (login) |

There is also `GET /health` outside `/api` for uptime checks.

More detail on the backend, including the environment variables and the content block format, is in [server/README.md](server/README.md).
