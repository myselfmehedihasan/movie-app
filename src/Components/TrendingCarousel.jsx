"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * StoryCard Component
 * * Single trending movie card with hover effect
 * * Clickable - navigates to movie details
 * @param {Object} movie - Movie object from TMDB
 * @param {Function} onClick - Click handler
 */
const StoryCard = ({ movie, onClick }) => {
  // Safety checks for undefined values
  if (!movie) return null;

  // Extract year from release_date if available
  const releaseYear = movie?.release_date ? movie.release_date.split("-")[0] : "N/A";
  const rating = movie?.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const title = movie?.title || "Unknown Title";
  const posterPath = movie?.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : "/no-movie.png";

  return (
    <motion.div
      className="relative w-72 h-96 flex-shrink-0 rounded-lg overflow-hidden shadow-xl group cursor-pointer"
      whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
      onClick={onClick}
    >
      {/* Movie poster */}
      <img
        src={posterPath}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 pointer-events-none"
      />
      
      {/* Rating Badge - Top Right */}
      <div className="absolute top-3 right-3 z-20 bg-yellow-500 text-black font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-sm">{rating}</span>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
      
      {/* Movie info */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white space-y-2">
        <h3 className="font-bold text-2xl tracking-wide line-clamp-2">{title}</h3>
        
        {/* Release Date */}
        <div className="flex items-center gap-2 text-gray-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium">{releaseYear}</span>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * TrendingCarousel Component
 * * Draggable carousel of trending movies from TMDB
 * * Cards are clickable and navigate to movie details
 * @param {Array} trendingMovies - Array of movie objects from TMDB API
 */
export default function TrendingCarousel({ trendingMovies = [] }) {
  const trackRef = useRef(null); // Draggable track
  const containerRef = useRef(null); // Carousel container
  const [dragConstraint, setDragConstraint] = useState(0); // Max drag distance
  const navigate = useNavigate(); // Router navigation

  // Calculate drag constraints based on container width
  useEffect(() => {
    const calculateConstraints = () => {
      if (containerRef.current && trackRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const trackWidth = trackRef.current.scrollWidth;
        setDragConstraint(containerWidth - trackWidth);
      }
    };
    calculateConstraints();
    window.addEventListener("resize", calculateConstraints);
    return () => window.removeEventListener("resize", calculateConstraints);
  }, [trendingMovies]);

  /**
   * Handle card click - navigate to movie details
   * @param {number} movieId - TMDB movie ID
   */
  const handleCardClick = (movieId) => {
    if (movieId) {
      navigate(`/movie/${movieId}`);
    } else {
      alert("Invalid movie ID");
    }
  };

  return (
    <div className="font-sans w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Carousel header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white">
            Trending Movies
          </h1>
        </header>

        {/* Draggable carousel */}
        {trendingMovies && trendingMovies.length > 0 ? (
          <motion.div
            ref={containerRef}
            className="overflow-hidden cursor-grab"
            whileTap={{ cursor: "grabbing" }}
          >
            <motion.div
              ref={trackRef}
              className="flex space-x-6 pb-6 px-4"
              drag="x"
              dragConstraints={{ right: 0, left: dragConstraint - 32 }}
              dragElastic={0.15}
            >
              {trendingMovies.map((movie) => (
                <StoryCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => handleCardClick(movie.id)}
                />
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <p className="text-center text-gray-400">Loading trending movies...</p>
        )}
      </div>
    </div>
  );
}