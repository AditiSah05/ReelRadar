# ReelRadar

ReelRadar is a full-stack movie discovery application built as a semester project using a MERN-style architecture without a database. The project combines a React frontend, an Express backend, TMDB API integration, and browser-based local persistence to deliver a polished streaming-style browsing experience.

## Live Deployment

Production URL: https://reelradar-yf5g.onrender.com/

## Overview

ReelRadar focuses on fast movie discovery. Users can browse curated categories, search titles, open a detailed movie page, watch trailers, and maintain a personal watchlist. Instead of storing data in a database, the application uses TMDB as the external movie source and saves watchlist data in localStorage.

## Project Snapshot

| Property | Details |
|----------|---------|
| Project Name | ReelRadar |
| Project Type | Semester Project |
| Architecture | MERN-style without database |
| Frontend | React 18, Vite, React Router DOM |
| Backend | Node.js, Express.js |
| Data Source | TMDB API |
| Persistence | Browser localStorage |
| Deployment | Single Render web service |

## Core Features

- Streaming-style homepage with a featured spotlight section.
- Editorial movie rows such as Audience Favorites, Critical Darlings, and Worth Waiting For.
- Dedicated Movies page with category switching and genre filtering.
- Search flow with clear reset behavior.
- Movie detail page with trailer support, cast information, and metadata.
- Watchlist management stored locally in the browser.
- Premium, cinematic interface with keyboard-accessible navigation.

## Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Axios
- Custom CSS

### Backend

- Node.js
- Express.js
- Axios
- CORS
- dotenv

## Application Flow

1. The React frontend requests data from the Express backend.
2. The backend communicates with TMDB using protected server-side API access.
3. The backend returns filtered movie data through app-specific routes.
4. The frontend renders featured content, category rows, search results, and movie details.
5. The watchlist is saved in localStorage and restored on refresh.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/healthz` | Health check for deployment monitoring |
| GET | `/api/movies/home` | Aggregated homepage movie categories |
| GET | `/api/movies/trending` | Weekly trending movies |
| GET | `/api/movies/search?query=name` | Movie search by title |
| GET | `/api/movies/:id` | Movie details with videos and credits |

## Project Structure

```text
MEARN PROJECT/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── routes/
│       ├── auth.js
│       └── movies.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   ├── reelradar-icon.svg
│   │   └── reelradar-wordmark.svg
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       └── pages/
├── render.yaml
└── README.md
```

## Local Development

### Prerequisites

- Node.js 18 or newer
- A TMDB API key

### Environment Variables

Create or update `backend/.env` with:

```env
TMDB_API_KEY=your_tmdb_api_key_here
PORT=5000
```

### Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Render Deployment

This repository is configured for a single Render deployment where one Node service serves both the backend API and the built frontend.

### Render Service Configuration

- Environment: `Node`
- Root Directory: leave empty
- Build Command:

```bash
npm install --prefix backend && npm install --prefix frontend --include=dev && npm run build --prefix frontend
```

- Start Command:

```bash
npm start --prefix backend
```

### Required Render Environment Variables

```env
TMDB_API_KEY=your_tmdb_api_key_here
NODE_ENV=production
FRONTEND_ORIGINS=https://reelradar-yf5g.onrender.com
```

### Deployment Notes

- The backend exposes `/healthz` for service health checks.
- In production, Express serves the frontend build from `frontend/dist`.
- Frontend and backend run under the same Render domain.

## UI Notes

The interface is designed to feel more like a curated movie product than a generic API demo. The homepage combines a featured spotlight area with editorial row naming, while the rest of the UI emphasizes clarity, cinematic depth, and quick browsing.

## Security and Implementation Notes

- The TMDB API key stays on the backend.
- The frontend never directly exposes TMDB credentials.
- Movie detail requests validate numeric IDs before proxying requests.
- Watchlist data is stored locally per browser.
- CORS supports local development and Render deployment origins.

## Future Improvements

- Remove the unused auth route if the project remains watchlist-only.
- Add automated tests for backend route responses.
- Add better loading and error telemetry for production.
- Add pagination or infinite scrolling for long result sets.

## Author

Semester Project Submission
2026
