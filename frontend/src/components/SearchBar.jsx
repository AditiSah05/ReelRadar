import { useState } from 'react';
import { SearchIcon } from './Icons';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search a title you trust, remember, or want to discover"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={100}
        />
        <button type="submit" className="search-btn">
          <SearchIcon className="icon" />
          <span>Find</span>
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
