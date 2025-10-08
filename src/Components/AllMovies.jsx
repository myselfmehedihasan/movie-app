import { Bouncy } from 'ldrs/react';
import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';

/**
 * AllMovies Component
 * Shows movies with sorting and filtering options
 */
const AllMovies = ({ movieList, isLoading, errorMessage }) => {
  const [sortOrder, setSortOrder] = useState('none');
  const [sortedMovies, setSortedMovies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);

  // Re-sort whenever sortOrder or movieList changes
  useEffect(() => {
    if (!Array.isArray(movieList)) return;

    let sorted = [...movieList];

    switch (sortOrder) {
      case "year-asc":
        sorted.sort((a, b) => 
          (a.primary_release_year || 0) - (b.primary_release_year || 0)
        );
        break;
      case "year-desc":
        sorted.sort((a, b) => 
          (b.primary_release_year || 0) - (a.primary_release_year || 0)
        );
        break;
      case "rating-asc":
        sorted.sort((a, b) => 
          (a.vote_average || 0) - (b.vote_average || 0)
        );
        break;
      case "rating-desc":
        sorted.sort((a, b) => 
          (b.vote_average || 0) - (a.vote_average || 0)
        );
        break;
      case "vote-count-asc":
        sorted.sort((a, b) => 
          (a.vote_count || 0) - (b.vote_count || 0)
        );
        break;
      case "vote-count-desc":
        sorted.sort((a, b) => 
          (b.vote_count || 0) - (a.vote_count || 0)
        );
        break;
      default:
        // No sorting, keep original order
        break;
    }

    setSortedMovies(sorted);
  }, [sortOrder, movieList]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setVisibleCount(20); // Reset visible count on sort
  };

  return (
    <div>
      <section className="all-movies">
        <h2>All Movies</h2>

        {/* Sort dropdown */}
        <div className="mb-4 flex justify-center items-center mb-10">
          <label htmlFor="sort-select" className="mr-2 text-white">Sort by:</label>
          <select 
            id="sort-select"
            onChange={handleSortChange} 
            value={sortOrder}
            className="px-3 py-2 border rounded text-amber-600"
          >
            <option  value="none">Default</option>
            <option value="year-desc">Year: Newest First</option>
            <option value="year-asc">Year: Oldest First</option>
            <option value="rating-desc">Rating: Highest First</option>
            <option value="rating-asc">Rating: Lowest First</option>
            <option value="vote-count-desc">Most Votes</option>
            <option value="vote-count-asc">Least Votes</option>
          </select>
        </div>

        {/* Loading / Error / Movie list */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Bouncy size="45" speed="1.75" color="white" />
          </div>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <ul>
            {sortedMovies.slice(0, visibleCount).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AllMovies;