# ReelRadar

ReelRadar is a semester project that recreates the feel of a modern streaming platform using the MERN development approach. The application allows users to browse movies, search titles, open detailed movie pages, watch trailers, and maintain a personal list of saved movies without requiring a database. Movie data is provided through the TMDB API, while the frontend experience is designed to resemble a premium streaming service interface.

## Abstract

The goal of this project is to build a full-stack movie discovery application with a clean separation between frontend and backend responsibilities. The frontend is developed with React and Vite, while the backend is built using Node.js and Express. Instead of storing content in a local database, the application consumes TMDB as an external API source and uses browser localStorage for lightweight user-side persistence.

## Project Summary

| Property | Details |
|----------|---------|
| Project Name | ReelRadar |
| Project Type | Semester Project |
| Development Style | MERN-style application |
| Frontend | React 18, Vite, React Router |
| Backend | Node.js, Express.js |
| API Source | TMDB API |
| Local Persistence | localStorage |
| Interface Style | Netflix-inspired streaming UI |

## Objectives

- Build a responsive movie browsing platform with separate frontend and backend layers.
- Integrate a third-party movie API and expose controlled backend routes.
- Create a streaming-style user interface with featured content and category rows.
- Implement search, movie details, trailer playback, and user favorites.
- Deliver a project suitable for semester presentation and demonstration.

## Major Features

### 1. Home Page
- Featured movie hero section with large backdrop banner.
- Category-based rows such as Popular, Trending, Top Rated, Now Playing, and Coming Soon.
- Personalized My List row based on saved favorites.
- Search bar with result count and reset option.
- Skeleton loading placeholders for a smoother interface.

### 2. Movie Detail Page
- Poster, title, tagline, rating, year, runtime, and genres.
- Full movie overview.
- Cast section with actor images.
- Trailer access and favorites toggle.

### 3. Favorites Functionality
- Add and remove movies from a personal list.
- Store favorites in browser localStorage.
- Keep favorites available after page refresh.

### 4. UI and Branding
- Dark streaming-platform inspired interface.
- Horizontal browse rows and hover preview overlays.
- Featured trailer modal on the home page.
- Custom ReelRadar branding with wordmark and app icon.

## System Architecture

### Frontend
- React handles the user interface and routing.
- Vite provides the development server and build pipeline.
- Axios is used for communication with the backend API.

### Backend
- Express provides REST endpoints for movie data.
- Axios is used server-side to communicate with TMDB.
- Environment variables protect the TMDB API key.

### Data Flow
1. The frontend sends requests to the Express backend.
2. The backend calls TMDB and filters responses into app-specific endpoints.
3. The frontend renders categories, movie details, and search results.
4. Favorites are stored locally in the browser.

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/movies/home` | Returns the category-based home feed |
| GET | `/api/movies/trending` | Returns weekly trending movies |
| GET | `/api/movies/search?query=name` | Searches movies by title |
| GET | `/api/movies/:id` | Returns movie details with videos and credits |

## Project Structure

```text
MEARN PROJECT/
├── backend/
│   ├── server.js
│   ├── .env
│   ├── package.json
│   └── routes/
│       └── movies.js
└── frontend/
    ├── index.html
    ├── public/
    │   ├── reelradar-icon.svg
    │   └── reelradar-wordmark.svg
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        │   ├── Icons.jsx
        │   ├── Navbar.jsx
        │   ├── SearchBar.jsx
        │   └── MovieCard.jsx
        └── pages/
            ├── Home.jsx
            ├── Favorites.jsx
            └── MovieDetail.jsx
```

## Setup Instructions

### Prerequisites
- Node.js v18 or above
- A free TMDB API key from [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

### Step 1: Configure Environment Variables
Update the backend environment file:

```env
TMDB_API_KEY=your_tmdb_api_key_here
PORT=5000
```

### Step 2: Start the Backend

```bash
cd backend
npm run dev
```

Backend URL: `http://localhost:5000`

### Step 3: Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend URL: `http://localhost:5173`

## Deploy On Render

This repository is ready for Render Blueprint deployment using [render.yaml](render.yaml).

### 1. Push This Project To GitHub
- Commit your latest changes.
- Push the repository to GitHub.

### 2. Create Services In Render
- In Render dashboard, choose `New +` -> `Blueprint`.
- Select this repository.
- Render will detect [render.yaml](render.yaml) and create:
    - `reelradar-api` (Node web service)
    - `reelradar-web` (static site)

### 3. Set Required Environment Variables

For `reelradar-api`:
- `TMDB_API_KEY` = your TMDB key
- `FRONTEND_ORIGINS` = your frontend Render URL
: example `https://reelradar-web.onrender.com`

For `reelradar-web`:
- `VITE_API_BASE_URL` = your backend Render URL
: example `https://reelradar-api.onrender.com`

### 4. Redeploy
- Trigger deploy for both services after adding env vars.
- Open frontend URL from `reelradar-web` service.

### Notes
- Backend health check endpoint: `/healthz`
- CORS in backend supports local dev ports and `FRONTEND_ORIGINS` for production.
- Frontend API calls use `VITE_API_BASE_URL` in production.

## Dependencies

### Backend Packages
| Package | Purpose |
|---------|---------|
| express | Server and routing |
| axios | HTTP requests to TMDB |
| cors | Cross-origin handling |
| dotenv | Environment variable loading |
| nodemon | Development auto-restart |

### Frontend Packages
| Package | Purpose |
|---------|---------|
| react | UI rendering |
| react-dom | DOM integration |
| react-router-dom | Routing |
| axios | API requests |
| vite | Build and dev tooling |

## Security Notes

- The TMDB API key is stored on the backend, not exposed directly in frontend code.
- The frontend communicates only with the Express API.
- Movie ID validation is handled before backend detail requests are made.
- CORS is restricted for local development usage.

## Branding Assets

- App Icon: `frontend/public/reelradar-icon.svg`
- Navbar Wordmark: `frontend/public/reelradar-wordmark.svg`

## Conclusion

ReelRadar demonstrates how a modern entertainment-style web application can be built using a React frontend, Express backend, and an external API source without requiring a full database setup. The project combines functional backend integration with a polished user interface and is suitable for academic demonstration as a full-stack semester submission.

## Author

Semester Project Submission  
Year: 2026
