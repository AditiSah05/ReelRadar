const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_BASE = 'https://api.themoviedb.org/3';

const getApiKey = () => {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error('TMDB_API_KEY is not set in .env');
  return key;
};

const fetchTmdb = async (path, params = {}) => {
  const { data } = await axios.get(`${TMDB_BASE}${path}`, {
    params: {
      api_key: getApiKey(),
      ...params,
    },
  });

  return data;
};

router.get('/home', async (req, res) => {
  try {
    const [trending, popular, topRated, nowPlaying, upcoming] = await Promise.all([
      fetchTmdb('/trending/movie/week'),
      fetchTmdb('/movie/popular'),
      fetchTmdb('/movie/top_rated'),
      fetchTmdb('/movie/now_playing'),
      fetchTmdb('/movie/upcoming'),
    ]);

    res.json({
      trending: trending.results || [],
      popular: popular.results || [],
      topRated: topRated.results || [],
      nowPlaying: nowPlaying.results || [],
      upcoming: upcoming.results || [],
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch home page movies' });
  }
});

router.get('/genres', async (req, res) => {
  try {
    const data = await fetchTmdb('/genre/movie/list');
    res.json({ genres: data.genres || [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch movie genres' });
  }
});

// GET /api/movies/trending
router.get('/trending', async (req, res) => {
  try {
    const data = await fetchTmdb('/trending/movie/week');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trending movies' });
  }
});

// GET /api/movies/search?query=batman&page=1
router.get('/search', async (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query || !query.trim()) {
    return res.status(400).json({ message: 'query parameter is required' });
  }
  try {
    const data = await fetchTmdb('/search/movie', {
      query: query.trim(),
      page,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to search movies' });
  }
});

// GET /api/movies/:id  (includes videos + credits)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ message: 'Invalid movie ID' });
  }
  try {
    const data = await fetchTmdb(`/movie/${id}`, {
      append_to_response: 'videos,credits',
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch movie details' });
  }
});

module.exports = router;
