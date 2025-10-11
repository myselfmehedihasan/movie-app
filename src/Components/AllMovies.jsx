import { Bouncy } from 'ldrs/react';
import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import Pagination from './Pagination';

/**
 * AllMovies Component
 * Shows movies with sorting, filtering, and pagination
 * Now handles its own data fetching
 */
const AllMovies = ({ searchTerm, apiBaseUrl, apiOptions }) => {
  const [sortOrder, setSortOrder] = useState('none');
  const [sortedMovies, setSortedMovies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(20);
  
  // Data fetching state
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch movies from TMDB
  const fetchMovies = async (query = "", page = 1) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${apiBaseUrl}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
        : `${apiBaseUrl}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_year=2025&sort_by=popularity.desc`;

      const response = await fetch(endpoint, apiOptions);
      if (!response.ok) throw new Error("Failed to fetch movies");

      const data = await response.json();
      setMovieList(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 500)); // TMDB limits to 500 pages
      setCurrentPage(page);

      // Scroll to top of results
      window.scrollTo({ top: 20, behavior: 'smooth' });
    } catch (error) {
      console.error("Error details:", error);
      setErrorMessage("Error fetching movies. Please try again later...");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchMovies(searchTerm, newPage);
    }
  };

  // Fetch movies when searchTerm changes (reset to page 1)
  useEffect(() => {
    setCurrentPage(1);
    fetchMovies(searchTerm, 1);
  }, [searchTerm]);

  // Re-sort whenever sortOrder or movieList changes
  useEffect(() => {
    if (!Array.isArray(movieList)) return;

    let sorted = [...movieList];

    switch (sortOrder) {
      case "year-asc":
        sorted.sort((a, b) => 
          (a.release_date?.slice(0, 4) || 0) - (b.release_date?.slice(0, 4) || 0)
        );
        break;
      case "year-desc":
        sorted.sort((a, b) => 
          (b.release_date?.slice(0, 4) || 0) - (a.release_date?.slice(0, 4) || 0)
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
        <h2>
          {searchTerm ? (
            <>
              Search Results for "<span className="text-yellow-400">{searchTerm}</span>"
            </>
          ) : (
            'All Movies'
          )}
        </h2>

        {/* Sort dropdown */}
        <div className="flex justify-center items-center mb-10">
          <label htmlFor="sort-select" className="mr-2 text-white">Sort by:</label>
          <select 
            id="sort-select"
            onChange={handleSortChange} 
            value={sortOrder}
            className="px-3 py-2 border rounded text-amber-600"
          >
            <option value="none">Default</option>
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
          <p className="text-red-500 text-center">{errorMessage}</p>
        ) : sortedMovies.length === 0 ? (
          <p className="text-gray-400 text-center py-10">No movies found. Try a different search!</p>
        ) : (
          <ul>
            {sortedMovies.slice(0, visibleCount).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        )}

        {/* Pagination */}
        {!isLoading && !errorMessage && movieList.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </div>
  );
};

export default AllMovies;