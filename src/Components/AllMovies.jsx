import { Bouncy } from 'ldrs/react';
import React from 'react';
import MovieCard from './MovieCard';

/**
 * AllMovies Component
 * * Shows movies, spinner, or error
 * @param {Array} movieList - Movies to display
 * @param {boolean} isLoading - Show spinner
 * @param {string} errorMessage - API errors
 */
const AllMovies = ({ movieList, isLoading, errorMessage }) => {
  return (
    <div>
      {/* Section title */}
      <section className="all-movies">
        <h2>All Movies</h2>

        {/* Loading / Error / Movie list */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            {/* Spinner */}
            <Bouncy size="45" speed="1.75" color="white" />
          </div>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <ul>
            {/* Render MovieCard for each movie */}
            {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AllMovies;
