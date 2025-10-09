// App.jsx
import React, { useState } from "react";
import Search from "./Components/Search";
import "ldrs/react/Bouncy.css";
import { useDebounce } from "react-use";
import TrendingCarousel from "./Components/TrendingCarousel";
import AllMovies from "./Components/AllMovies";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search input by 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  return (
    <main>
      <div className="wrapper">
        {/* Hero background image */}
        <img
          src="/hero-bg.png"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover opacity-60 -z-10"
        />

        {/* Header section with title and search */}
        <header >
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* Trending movies carousel */}
        <TrendingCarousel 
          apiBaseUrl={API_BASED_URL}
          apiOptions={API_OPTIONS}
        />

        {/* All movies list with search results */}
        <AllMovies 
          searchTerm={debouncedSearchTerm}
          apiBaseUrl={API_BASED_URL}
          apiOptions={API_OPTIONS}
        />
      </div>
    </main>
  );
};

export default App;




