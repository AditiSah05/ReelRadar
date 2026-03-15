import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import { FilmIcon, WarningIcon } from '../components/Icons';

function Movies() {
  const [homeFeed, setHomeFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError('');

      try {
        const { data: feedData } = await axios.get('/api/movies/home');
        setHomeFeed(feedData);
      } catch {
        setError('Unable to load movies right now. Please try again in a moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const movies = homeFeed
    ? Object.values(homeFeed)
        .flat()
        .filter((movie, index, array) => array.findIndex((item) => item.id === movie.id) === index)
    : [];

  return (
    <div className="movies-page">
      <div className="movies-page-header">
        <h1 className="page-title">Movies</h1>
        <p className="movies-page-subtitle">
          Browse a wider catalog of films collected from the latest popular, trending, and upcoming releases.
        </p>
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
              <h2 className="section-title">Movie Catalog</h2>
              <p className="movies-catalog-copy">A broader collection of titles gathered into one place.</p>
            </div>
            <div className="movies-count-pill">
              {movies.length} {movies.length === 1 ? 'title' : 'titles'}
            </div>
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
