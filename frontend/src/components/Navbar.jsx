import { Link, useLocation } from 'react-router-dom';
import { FilmIcon, HeartIcon } from './Icons';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="brand-lockup">
            <img src="/reelradar-wordmark.svg" alt="ReelRadar" className="logo-mark" />
            <span className="brand-note">Curated movie discovery</span>
          </span>
        </Link>
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/movies"
            className={`nav-link ${location.pathname === '/movies' ? 'active' : ''}`}
          >
            <FilmIcon className="icon" size={17} />
            <span>Movies</span>
          </Link>
          <Link
            to="/favorites"
            className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
          >
            <HeartIcon className="icon" filled={location.pathname === '/favorites'} />
            <span>Watchlist</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
