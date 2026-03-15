import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  CloseIcon,
  HeartIcon,
  PlayIcon,
  StarIcon,
  WarningIcon,
} from '../components/Icons';

const IMG_BASE = 'https://image.tmdb.org/t/p/';

function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function buildRows(homeFeed, favorites) {
  const rows = [];

  if (favorites.length > 0) {
    rows.push({
      id: 'my-list',
      title: 'Your Watchlist',
      description: 'The titles you marked for a better movie night.',
      items: favorites,
    });
  }

  if (!homeFeed) {
    return rows;
  }

  return [
    ...rows,
    {
      id: 'popular',
      title: 'Audience Favorites',
      description: 'Popular picks people keep coming back to.',
      items: homeFeed.popular.slice(0, 12),
    },
    {
      id: 'trending-now',
      title: 'What People Are Talking About',
      description: 'The movies driving the loudest conversation right now.',
      items: homeFeed.trending.slice(1, 13),
    },
    {
      id: 'top-rated-picks',
      title: 'Critical Darlings',
      description: 'Highly rated films that hold up beyond the hype.',
      items: homeFeed.topRated.slice(0, 12),
    },
    {
      id: 'now-playing',
      title: 'Playing This Week',
      description: 'Fresh releases landing in theaters and watchlists.',
      items: homeFeed.nowPlaying.slice(0, 12),
    },
    {
      id: 'coming-soon',
      title: 'Worth Waiting For',
      description: 'Upcoming releases that already feel promising.',
      items: homeFeed.upcoming.slice(0, 12),
    },
  ].filter((row) => row.items.length > 0);
}

function Home() {
  const navigate = useNavigate();
  const rowRefs = useRef({});
  const [homeFeed, setHomeFeed] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isFeaturedFavorite, setIsFeaturedFavorite] = useState(false);
  const [featuredTrailerKey, setFeaturedTrailerKey] = useState('');
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [isTrailerLoading, setIsTrailerLoading] = useState(false);

  const setRowRef = (rowId, element) => {
    if (element) {
      rowRefs.current[rowId] = element;
    }
  };

  const scrollRow = (rowId, direction) => {
    const rowElement = rowRefs.current[rowId];

    if (!rowElement) {
      return;
    }

    rowElement.scrollBy({
      left: direction === 'left' ? -420 : 420,
      behavior: 'smooth',
    });
  };

  const handleRowKeyScroll = (event, rowId) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollRow(rowId, 'left');
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollRow(rowId, 'right');
    }
  };

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get('/api/movies/home');
        setHomeFeed(data);
      } catch {
        setError(
          'Failed to load the home feed. Make sure the backend is running and your TMDB API key is set.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    const syncFavorites = () => {
      setFavorites(getFavorites());
    };

    syncFavorites();
    window.addEventListener('favorites-updated', syncFavorites);
    window.addEventListener('storage', syncFavorites);

    return () => {
      window.removeEventListener('favorites-updated', syncFavorites);
      window.removeEventListener('storage', syncFavorites);
    };
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(
        `/api/movies/search?query=${encodeURIComponent(query)}`
      );
      setSearchResults(data.results);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const moviesToShow = searchQuery ? searchResults : homeFeed?.trending || [];
  const featuredMovie = !searchQuery && homeFeed?.trending?.length ? homeFeed.trending[0] : null;
  const contentRows = !searchQuery ? buildRows(homeFeed, favorites) : [];
  const sectionTitle = searchQuery
    ? `Results for "${searchQuery}" — ${searchResults.length} found`
    : 'Browse the Radar';

  useEffect(() => {
    if (!featuredMovie) {
      setIsFeaturedFavorite(false);
      setFeaturedTrailerKey('');
      return;
    }

    setIsFeaturedFavorite(favorites.some((movie) => movie.id === featuredMovie.id));

    const fetchFeaturedTrailer = async () => {
      setIsTrailerLoading(true);

      try {
        const { data } = await axios.get(`/api/movies/${featuredMovie.id}`);
        const trailer = data.videos?.results?.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        setFeaturedTrailerKey(trailer?.key || '');
      } catch {
        setFeaturedTrailerKey('');
      } finally {
        setIsTrailerLoading(false);
      }
    };

    fetchFeaturedTrailer();
  }, [featuredMovie, favorites]);

  useEffect(() => {
    if (!isTrailerModalOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsTrailerModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isTrailerModalOpen]);

  const toggleFeaturedFavorite = () => {
    if (!featuredMovie) {
      return;
    }

    const storedFavorites = getFavorites();

    if (isFeaturedFavorite) {
      const updatedFavorites = storedFavorites.filter((movie) => movie.id !== featuredMovie.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      window.dispatchEvent(new Event('favorites-updated'));
      setIsFeaturedFavorite(false);
      return;
    }

    const updatedFavorites = storedFavorites.some((movie) => movie.id === featuredMovie.id)
      ? storedFavorites
      : [...storedFavorites, featuredMovie];

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    window.dispatchEvent(new Event('favorites-updated'));
    setIsFeaturedFavorite(true);
  };

  const openTrailerModal = () => {
    if (featuredTrailerKey) {
      setIsTrailerModalOpen(true);
      return;
    }

    navigate(`/movie/${featuredMovie.id}`);
  };

  const renderSkeletonRow = (title) => (
    <section className="content-row" key={title}>
      <div className="row-header">
        <h3 className="row-title skeleton-line skeleton-title"></h3>
      </div>
      <div className="row-track skeleton-track" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="skeleton-card" key={`${title}-${index}`}>
            <div className="skeleton-poster shimmer"></div>
            <div className="skeleton-meta">
              <div className="skeleton-line shimmer"></div>
              <div className="skeleton-line skeleton-line-short shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="home-page">
      <div className="hero-section">
        {featuredMovie && !loading && (
          <section
            className="featured-panel"
            style={{
              backgroundImage: featuredMovie.backdrop_path
                ? `linear-gradient(90deg, rgba(8, 8, 8, 0.95) 0%, rgba(8, 8, 8, 0.72) 46%, rgba(8, 8, 8, 0.82) 100%), url(${IMG_BASE}original${featuredMovie.backdrop_path})`
                : undefined,
            }}
          >
            <div className="featured-copy">
              <p className="featured-label">Tonight&apos;s Spotlight</p>
              <h2 className="featured-title">{featuredMovie.title}</h2>

              <div className="featured-meta">
                <span className="meta-badge">
                  <StarIcon className="icon" size={14} />
                  <span>{featuredMovie.vote_average?.toFixed(1) || 'N/A'}</span>
                </span>
                <span className="meta-badge">
                  <CalendarIcon className="icon" size={14} />
                  <span>
                    {featuredMovie.release_date
                      ? featuredMovie.release_date.split('-')[0]
                      : 'Unknown'}
                  </span>
                </span>
              </div>

              <p className="featured-overview">
                {featuredMovie.overview || 'A standout title from this week’s trending movies.'}
              </p>

              <div className="featured-actions">
                <button className="featured-primary-btn" onClick={openTrailerModal}>
                  <PlayIcon className="icon" size={15} />
                  <span>{isTrailerLoading ? 'Loading Trailer' : 'Play Trailer'}</span>
                </button>
                <button
                  className="featured-secondary-btn info"
                  onClick={() => navigate(`/movie/${featuredMovie.id}`)}
                >
                  <span>More Info</span>
                </button>
                <button
                  className={`featured-secondary-btn ${
                    isFeaturedFavorite ? 'favorited' : ''
                  }`}
                  onClick={toggleFeaturedFavorite}
                >
                  <HeartIcon className="icon" filled={isFeaturedFavorite} />
                  <span>{isFeaturedFavorite ? 'Saved to My List' : 'Save to My List'}</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {!featuredMovie && loading && !searchQuery && (
          <section className="featured-panel featured-panel-skeleton" aria-hidden="true">
            <div className="featured-copy">
              <div className="skeleton-line skeleton-pill shimmer"></div>
              <div className="skeleton-line skeleton-featured-title shimmer"></div>
              <div className="skeleton-line skeleton-featured-title short shimmer"></div>
              <div className="featured-meta">
                <span className="meta-badge skeleton-badge shimmer"></span>
                <span className="meta-badge skeleton-badge shimmer"></span>
              </div>
              <div className="skeleton-line skeleton-overview shimmer"></div>
              <div className="skeleton-line skeleton-overview medium shimmer"></div>
              <div className="skeleton-line skeleton-overview short shimmer"></div>
            </div>
          </section>
        )}

        <h1 className="hero-title">Pick a film with better odds</h1>
        <p className="hero-subtitle">
          Skip the endless scrolling. Start with what&apos;s rising, what&apos;s loved, and what&apos;s actually worth your time.
        </p>
        <SearchBar onSearch={handleSearch} />
        {searchQuery && (
          <button className="clear-btn" onClick={clearSearch}>
            <CloseIcon className="icon" />
            <span>Clear Search</span>
          </button>
        )}
      </div>

      <div className="movies-section">
        <h2 className="section-title">{sectionTitle}</h2>

        {loading && !searchQuery && <div>{['row-one', 'row-two', 'row-three'].map(renderSkeletonRow)}</div>}

        {loading && searchQuery && (
          <div className="movies-grid" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="skeleton-card" key={`search-skeleton-${index}`}>
                <div className="skeleton-poster shimmer"></div>
                <div className="skeleton-meta">
                  <div className="skeleton-line shimmer"></div>
                  <div className="skeleton-line skeleton-line-short shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="error-msg">
            <WarningIcon className="icon" /> {error}
          </div>
        )}

        {!loading && !error && searchQuery && moviesToShow.length === 0 && (
          <div className="no-results">No movies found for "{searchQuery}"</div>
        )}

        {!loading && !error && !searchQuery && (
          <div className="row-stack">
            {contentRows.map((row) => (
              <section className="content-row" key={row.id}>
                <div className="row-header">
                  <div className="row-heading">
                    <h3 className="row-title">{row.title}</h3>
                    <p className="row-description">{row.description}</p>
                  </div>
                  <div className="row-controls">
                    <button
                      className="row-nav-btn"
                      type="button"
                      onClick={() => scrollRow(row.id, 'left')}
                      aria-label={`Scroll ${row.title} left`}
                    >
                      <ArrowLeftIcon className="icon" />
                    </button>
                    <button
                      className="row-nav-btn"
                      type="button"
                      onClick={() => scrollRow(row.id, 'right')}
                      aria-label={`Scroll ${row.title} right`}
                    >
                      <ArrowRightIcon className="icon" />
                    </button>
                  </div>
                </div>
                <div className="row-track-shell">
                  <div
                    className="row-track"
                    ref={(element) => setRowRef(row.id, element)}
                    tabIndex={0}
                    onKeyDown={(event) => handleRowKeyScroll(event, row.id)}
                    aria-label={`${row.title} carousel. Use left and right arrow keys to scroll.`}
                  >
                    {row.items.map((movie) => (
                      <MovieCard key={`${row.id}-${movie.id}`} movie={movie} />
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}

        {!loading && !error && searchQuery && (
          <div className="movies-grid">
            {moviesToShow.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      {isTrailerModalOpen && featuredTrailerKey && (
        <div className="modal-backdrop" onClick={() => setIsTrailerModalOpen(false)}>
          <div className="trailer-modal" onClick={(event) => event.stopPropagation()}>
            <div className="trailer-modal-header">
              <h3 className="trailer-modal-title">{featuredMovie?.title}</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsTrailerModalOpen(false)}
                aria-label="Close trailer"
              >
                <CloseIcon className="icon" />
              </button>
            </div>
            <div className="trailer-frame-wrap">
              <iframe
                className="trailer-frame"
                src={`https://www.youtube.com/embed/${featuredTrailerKey}?autoplay=1&rel=0`}
                title={`${featuredMovie?.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
