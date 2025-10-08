// App.jsx
import React, { useEffect, useState } from "react";
import Search from "./Components/Search";
import { Bouncy } from "ldrs/react";
import "ldrs/react/Bouncy.css";
import MovieCard from "./Components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite";
import TrendingCarousel from "./Components/TrendingCarousel";
import AllMovies from "./Components/AllMovies";
import Pagination from "./Components/Pagination";
import Navbar from "./Components/Navbar";
import AnimatedButton from "./Components/AnimatedButton";

// TMDB API base URL
const API_BASED_URL = "https://api.themoviedb.org/3";
// TMDB API Key from env
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
// Fetch options with headers
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState(""); // search input
  const [errorMessage, setErrorMessage] = useState(""); // API errors
  const [movieList, setMovieList] = useState([]); // movies from API
  const [trendingMovies, setTrendingMovies] = useState([]); // trending from TMDB
  const [isLoading, setIsLoading] = useState(false); // loading spinner
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // debounce input
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search input
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  // Fetch movies from TMDB
  const fetchMovies = async (query = "", page = 1) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASED_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
        : `${API_BASED_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&primary_release_year=2025&sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) throw new Error("Failed to fetch movies");

      const data = await response.json();
      setMovieList(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 500)); // TMDB limits to 500 pages
      setCurrentPage(page);

      // Update search count in Appwrite
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

      // Scroll to top of results
      window.scrollTo({ top: 20, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      setErrorMessage("Error fetching movies. Please try again later...");
    } finally {
      setIsLoading(false);
    }
  };

  // Load trending movies from TMDB (not Appwrite)
  const loadTrendingMovies = async () => {
    try {
      const response = await fetch(
        `${API_BASED_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_year=2025&sort_by=vote_count.desc&vote_average.lte=10&vote_count.gte=1`,
        API_OPTIONS
      );
      
      if (!response.ok) throw new Error("Failed to fetch trending movies");
      
      const data = await response.json();
      setTrendingMovies(data.results || []);
    } catch (error) {
      console.error("Error loading trending movies:", error);
      setTrendingMovies([]);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchMovies(debouncedSearchTerm, newPage);
    }
  };

  // Fetch movies on debounced search change (reset to page 1)
  useEffect(() => {
    setCurrentPage(1);
    fetchMovies(debouncedSearchTerm, 1);
  }, [debouncedSearchTerm]);

  // Load trending movies once on mount
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      
        {/* navbar */}
        <Navbar></Navbar>
      <div className="wrapper">
        {/* Hero background */}
        <img
          src="/hero-bg.png"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover opacity-60 -z-10"
        />

          {/* Header with title and search */}
        <header>
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>


        {/* Trending movies carousel - passes movies from TMDB */}
        {trendingMovies.length > 0 && (
          <TrendingCarousel trendingMovies={trendingMovies} />
        )}

        
        
        {/* All movies list */}
        <AllMovies 
          movieList={movieList} 
          isLoading={isLoading} 
          errorMessage={errorMessage} 
        />

        {/* Pagination */}
        {!isLoading && !errorMessage && movieList.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </main>
  );
};

export default App;