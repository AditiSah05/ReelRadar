import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { FilmIcon, WarningIcon } from '../components/Icons';

const movieCategories = [
  {
    id: 'popular',
    label: 'Audience Favorites',
    description: 'The titles people keep returning to.',
  },
  {
    id: 'trending',
    label: 'Trending',
    description: 'What is getting attention this week.',
  },
  {
    id: 'topRated',
    label: 'Top Rated',
    description: 'High-scoring films with lasting appeal.',
  },
  {
    id: 'nowPlaying',
    label: 'Now Playing',
    description: 'Recent releases currently in circulation.',
  },
  {
    id: 'upcoming',
    label: 'Coming Soon',
    description: 'Upcoming releases worth keeping an eye on.',
  },
];

function Movies() {
  const [homeFeed, setHomeFeed] = useState(null);
  const [activeCategory, setActiveCategory] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await axios.get('/api/movies/home');
        setHomeFeed(data);
      } catch {
        setError('Unable to load movies right now. Please try again in a moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const activeConfig = movieCategories.find((category) => category.id === activeCategory);
  const movies = homeFeed?.[activeCategory] || [];

  return (
    <div className="movies-page">
      <div className="movies-page-header">
        <h1 className="page-title">Movies</h1>
        <p className="movies-page-subtitle">
          Browse a wider catalog by category and jump straight into the titles that match your mood.
        </p>
      </div>

      <div className="movie-filter-bar" role="tablist" aria-label="Movie categories">
        {movieCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`movie-filter-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
            role="tab"
            aria-selected={activeCategory === category.id}
          >
            {category.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading-page">
          <div className="spinner"></div>
          <p>Loading movie categories...</p>
        </div>
      )}

      {!loading && error && (
        <div className="error-page">
          <WarningIcon className="icon" /> {error}
        </div>
      )}

      {!loading && !error && (
        <section className="movies-catalog-section">
          <div className="movies-catalog-head">
            <div>
              <h2 className="section-title">{activeConfig?.label}</h2>
              <p className="movies-catalog-copy">{activeConfig?.description}</p>
            </div>
            <div className="movies-count-pill">{movies.length} titles</div>
          </div>

          {movies.length > 0 ? (
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <FilmIcon className="icon" size={64} />
              </div>
              <h2>No movies available</h2>
              <p>This category is empty right now. Try another section.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Movies;
