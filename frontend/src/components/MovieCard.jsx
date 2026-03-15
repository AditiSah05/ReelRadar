import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FilmIcon, HeartIcon, StarIcon } from './Icons';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

function MovieCard({ movie }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const openDetails = () => {
    navigate(`/movie/${movie.id}`);
  };

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favs.some((f) => f.id === movie.id));
  }, [movie.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const updated = favs.filter((f) => f.id !== movie.id);
      localStorage.setItem('favorites', JSON.stringify(updated));
      window.dispatchEvent(new Event('favorites-updated'));
      setIsFavorite(false);
    } else {
      const updated = favs.some((favoriteMovie) => favoriteMovie.id === movie.id)
        ? favs
        : [...favs, movie];
      localStorage.setItem('favorites', JSON.stringify(updated));
      window.dispatchEvent(new Event('favorites-updated'));
      setIsFavorite(true);
    }
  };

  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetails();
    }
  };

  return (
    <div
      className="movie-card"
      onClick={openDetails}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${movie.title}`}
    >
      <div className="movie-poster-wrapper">
        {movie.poster_path ? (
          <img
            src={`${IMG_BASE}${movie.poster_path}`}
            alt={movie.title}
            className="movie-poster"
            loading="lazy"
          />
        ) : (
          <div className="no-image-placeholder">
            <FilmIcon className="icon placeholder-icon" size={36} />
            <span style={{ fontSize: '0.75rem' }}>No Image</span>
          </div>
        )}
        <button
          className={`fav-btn ${isFavorite ? 'favorited' : ''}`}
          type="button"
          onClick={toggleFavorite}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFavorite ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
          aria-pressed={isFavorite}
        >
          <HeartIcon className="icon" filled={isFavorite} />
        </button>
        <div className="movie-rating">
          <StarIcon className="icon" size={13} /> {rating}
        </div>
        <div className="movie-card-overlay">
          <p className="movie-overlay-label">Quick Preview</p>
          <h4 className="movie-overlay-title">{movie.title}</h4>
          <p className="movie-overlay-copy">
            {movie.overview || 'Open the full movie page to see details, cast, and more.'}
          </p>
          <span className="movie-overlay-action">View details</span>
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{year}</p>
      </div>
    </div>
  );
}

export default MovieCard;
