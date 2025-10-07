import { Bouncy } from "ldrs/react";
import { div } from "motion/react-client";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASED_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// API options with Bearer token (consistent with App.jsx)
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

/**
 * MovieDetails Component
 * * Shows detailed info of a single movie
 * ! Requires valid movie ID in URL
 */
export default function MovieDetails() {
  const [movie, setMovie] = useState(null); // Movie data
  const [error, setError] = useState("");   // API error
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const { id } = useParams();               // Movie ID from URL
  const navigate = useNavigate();           // Navigation

  // Fetch movie details on mount or when ID changes
  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) {
        setError("Movie not found or invalid ID.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        console.log("Fetching movie with ID:", id); // Debug log
        
        const res = await fetch(
          `${API_BASED_URL}/movie/${id}?language=en-US`,
          API_OPTIONS
        );
        
        console.log("Response status:", res.status); // Debug log
        
        if (!res.ok) {
          throw new Error(`Failed to fetch movie: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Movie data:", data); // Debug log
        
        setMovie(data);
        setError("");
      } catch (err) {
        console.error("Error fetching movie:", err); // Debug log
        setMovie(null);
        setError("Movie not found or invalid ID.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovie();
  }, [id]);

  // Show loading spinner while fetching
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Bouncy size="45" speed="1.75" color="white" />
      </div>
    );
  }

  // Show error message if movie not found
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-center text-red-500 text-lg font-semibold">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  // Show movie details
  return (
    <div>
      <img
          src="/hero-bg.png"
          alt="Hero background"
          className="absolute inset-0 max-h-screen max-w-screen object-cover opacity-80 -z-10"
        />
       <div className="p-6 text-white max-w-4xl mx-auto min-h-screen">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        ← Back to Home
      </button>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Movie poster */}
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-movie.png"}
          alt={movie.title || "Movie Poster"}
          className="w-64 rounded-lg shadow-lg"
        />

        {/* Movie info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{movie.title || "Unknown"}</h1>
          <p className="text-gray-400 mb-4">{movie.release_date ? movie.release_date.split("-")[0] : "N/A"}</p>
          <p className="text-gray-300 leading-relaxed">{movie.overview || "No description available."}</p>
          <p className="mt-4 text-yellow-400 font-semibold">
            ⭐ Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} / 10
          </p>
          <p className="text-sm mt-2 text-gray-500">
            Original language: {movie.original_language ? movie.original_language.toUpperCase() : "N/A"}
          </p>
          
          {/* Additional movie details */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-400 font-semibold mb-2">Genres:</p>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {movie.runtime && (
            <p className="mt-4 text-gray-400">
              Runtime: <span className="text-white">{movie.runtime} minutes</span>
            </p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}