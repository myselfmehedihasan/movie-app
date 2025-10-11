import React, { useState, useEffect } from 'react';
import { Bouncy } from 'ldrs/react';
import MovieCard from '../Components/MovieCard';

const API_BASED_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const Trending = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState('week'); // 'day' or 'week'

  useEffect(() => {
    fetchTrendingMovies();
  }, [timeWindow]);

  const fetchTrendingMovies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASED_URL}/trending/movie/${timeWindow}?language=en-US`,
        API_OPTIONS
      );
      const data = await response.json();
      setTrendingMovies(data.results || []);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <img
        src="/hero-bg.png"
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover opacity-60 -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔥 Trending Movies
          </h1>
          
          {/* Time Window Toggle */}
          <div className="flex gap-4">
            <button
              onClick={() => setTimeWindow('day')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                timeWindow === 'day'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeWindow('week')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                timeWindow === 'week'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              This Week
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Bouncy size="45" speed="1.75" color="white" />
          </div>
        ) : (
          /* Movies Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;