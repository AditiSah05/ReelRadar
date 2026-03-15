import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { FilmIcon, HeartIcon } from '../components/Icons';

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const syncFavorites = () => {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(favs);
    };

    syncFavorites();
    window.addEventListener('favorites-updated', syncFavorites);
    window.addEventListener('storage', syncFavorites);

    return () => {
      window.removeEventListener('favorites-updated', syncFavorites);
      window.removeEventListener('storage', syncFavorites);
    };
  }, []);

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <h1 className="page-title">Your Watchlist</h1>
        <div className="empty-state">
          <div className="empty-icon">
            <FilmIcon className="icon" size={64} />
          </div>
          <h2>Your watchlist is empty</h2>
          <p>
            Save a few films with the <HeartIcon className="icon inline-icon" /> button and they will wait here for later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <h1 className="page-title">Your Watchlist ({favorites.length})</h1>
      <div className="movies-grid">
        {favorites.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;
