import { Bouncy } from "ldrs/react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import ReviewSection from "./ReviewSection";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const API_BASED_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BACKEND_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export default function MovieDetails() {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

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
        console.log("Fetching movie with ID:", id);
        
        const res = await fetch(
          `${API_BASED_URL}/movie/${id}?language=en-US`,
          API_OPTIONS
        );
        
        console.log("Response status:", res.status);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch movie: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Movie data:", data);
        
        setMovie(data);
        setError("");
      } catch (err) {
        console.error("Error fetching movie:", err);
        setMovie(null);
        setError("Movie not found or invalid ID.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovie();
  }, [id]);

  // Check if movie is in favorites
  useEffect(() => {
    if (currentUser && id) {
      checkFavorite();
    }
  }, [currentUser, id]);

  const checkFavorite = async () => {
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/api/favorites/check/${currentUser.uid}/${id}`
      );
      const data = await response.json();
      
      if (data.success) {
        setIsFavorite(data.isFavorite);
        setFavoriteId(data.favoriteId);
      }
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!currentUser) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add favorites",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3085d6",
      });

      if (result.isConfirmed) {
        // Navigate to login with return URL
        navigate("/login", { state: { from: location.pathname } });
      }
      return;
    }

    if (!movie) return;

    setIsFavoriteLoading(true);

    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(
          `${BACKEND_API_URL}/api/favorites/${favoriteId}`,
          { method: "DELETE" }
        );
        const data = await response.json();
        
        if (data.success) {
          setIsFavorite(false);
          setFavoriteId(null);
          
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          
          Toast.fire({
            icon: "success",
            title: "Removed from favorites",
          });
        }
      } else {
        // Add to favorites
        const response = await fetch(`${BACKEND_API_URL}/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.uid,
            movieId: id,
            movieTitle: movie.title,
            posterPath: movie.poster_path,
            rating: movie.vote_average,
          }),
        });
        const data = await response.json();
        
        if (data.success) {
          setIsFavorite(true);
          setFavoriteId(data.favorite._id);
          
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          
          Toast.fire({
            icon: "success",
            title: "Added to favorites",
          });
        } else {
          throw new Error(data.message);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      console.error("Full error details:", error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Bouncy size="45" speed="1.75" color="white" />
      </div>
    );
  }

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

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <img
        src="/hero-bg.png"
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover opacity-60 -z-10"
      />
      
      <div className="relative z-10 p-6 text-white max-w-6xl mx-auto">
        {/* Back button and Favorite button */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ← Back to Home
          </button>

          {/* Favorite Button - Always show */}
          <button
            onClick={toggleFavorite}
            disabled={isFavoriteLoading}
            className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
              isFavorite
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isFavorite ? "fill-current" : ""
              }`}
            />
            {isFavoriteLoading
              ? "Loading..."
              : isFavorite
              ? "Remove from Favorites"
              : "Add to Favorites"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-h-fit">
          {/* Movie poster */}
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/no-movie.png"
            }
            alt={movie.title || "Movie Poster"}
            className="w-64 rounded-lg shadow-lg"
          />

          {/* Movie info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{movie.title || "Unknown"}</h1>
            <p className="text-gray-400 mb-4">
              {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
            </p>
            <p className="text-gray-300 leading-relaxed">
              {movie.overview || "No description available."}
            </p>
            <p className="mt-4 text-yellow-400 font-semibold">
              ⭐ Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} / 10
            </p>
            <p className="text-sm mt-2 text-gray-500">
              Original language:{" "}
              {movie.original_language ? movie.original_language.toUpperCase() : "N/A"}
            </p>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-400 font-semibold mb-2">Genres:</p>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Runtime */}
            {movie.runtime && (
              <p className="mt-4 text-gray-400">
                Runtime: <span className="text-white">{movie.runtime} minutes</span>
              </p>
            )}
          </div>
        </div>

        {/* Review Section */}
        <ReviewSection movieId={id} movieTitle={movie.title} />
      </div>
    </div>
  );
}