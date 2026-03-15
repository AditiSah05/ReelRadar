import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  FilmIcon,
  HeartIcon,
  PlayIcon,
  StarIcon,
  UserIcon,
  WarningIcon,
} from '../components/Icons';

const IMG_BASE = 'https://image.tmdb.org/t/p/';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchMovieDetail();
  }, [id]);

  useEffect(() => {
    if (movie) {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favs.some((f) => f.id === movie.id));
    }
  }, [movie]);

  const fetchMovieDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`/api/movies/${id}`);
      setMovie(data);
    } catch {
      setError('Failed to load movie details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const updated = favs.filter((f) => f.id !== movie.id);
      localStorage.setItem('favorites', JSON.stringify(updated));
      window.dispatchEvent(new Event('favorites-updated'));
      setIsFavorite(false);
    } else {
      const movieToSave = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      };
      const updated = favs.some((favoriteMovie) => favoriteMovie.id === movie.id)
        ? favs
        : [...favs, movieToSave];
      localStorage.setItem('favorites', JSON.stringify(updated));
      window.dispatchEvent(new Event('favorites-updated'));
      setIsFavorite(true);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px 24px' }}>
        <div className="error-page">
          <WarningIcon className="icon" /> {error}
        </div>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="icon" />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  if (!movie) return null;

  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );
  const cast = movie.credits?.cast?.slice(0, 6) || [];
  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : 'N/A';

  return (
    <div className="detail-page">
      {movie.backdrop_path && (
        <div
          className="detail-backdrop"
          style={{
            backgroundImage: `url(${IMG_BASE}original${movie.backdrop_path})`,
          }}
        >
          <div className="backdrop-overlay"></div>
        </div>
      )}

      <div className="detail-content">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="icon" />
          <span>Back</span>
        </button>

        <div className="detail-main">
          <div className="detail-poster-wrapper">
            {movie.poster_path ? (
              <img
                src={`${IMG_BASE}w500${movie.poster_path}`}
                alt={movie.title}
                className="detail-poster"
              />
            ) : (
              <div className="no-poster">
                <FilmIcon className="icon" />
                <span>No Image</span>
              </div>
            )}
          </div>

          <div className="detail-info">
            <h1 className="detail-title">{movie.title}</h1>
            {movie.tagline && (
              <p className="detail-tagline">"{movie.tagline}"</p>
            )}

            <div className="detail-meta">
              <span className="meta-badge">
                <StarIcon className="icon" size={14} />
                <span>{movie.vote_average?.toFixed(1)}</span>
              </span>
              <span className="meta-badge">
                <CalendarIcon className="icon" size={14} />
                <span>{year}</span>
              </span>
              <span className="meta-badge">
                <ClockIcon className="icon" size={14} />
                <span>{runtime}</span>
              </span>
            </div>

            <div className="genres">
              {movie.genres?.map((g) => (
                <span key={g.id} className="genre-tag">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="detail-overview">{movie.overview}</p>

            <div className="detail-actions">
              <button
                className={`fav-detail-btn ${isFavorite ? 'favorited' : ''}`}
                onClick={toggleFavorite}
              >
                <HeartIcon className="icon" filled={isFavorite} />
                <span>
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </span>
              </button>
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="trailer-btn"
                >
                  <PlayIcon className="icon" />
                  <span>Watch Trailer</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {cast.length > 0 && (
          <div className="cast-section">
            <h2 className="cast-title">Top Cast</h2>
            <div className="cast-grid">
              {cast.map((actor) => (
                <div key={actor.id} className="cast-card">
                  {actor.profile_path ? (
                    <img
                      src={`${IMG_BASE}w185${actor.profile_path}`}
                      alt={actor.name}
                      className="cast-photo"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="cast-photo"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        fontSize: '2rem',
                      }}
                    >
                      <UserIcon className="icon" size={34} />
                    </div>
                  )}
                  <p className="cast-name">{actor.name}</p>
                  <p className="cast-character">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetail;
