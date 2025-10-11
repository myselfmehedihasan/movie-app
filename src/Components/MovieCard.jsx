import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * MovieCard Component
 * * Shows poster, title, rating, language & year
 * ! Click navigates to MovieDetails
 * @param {Object} movie - Movie data
 */
const MovieCard = ({
  movie: { id, title, vote_average, poster_path, release_date, original_language },
}) => {
  const navigate = useNavigate(); // Router navigation

  return (
    <div
      className="group cursor-pointer transition-all duration-300 hover:scale-105 h-full"
      onClick={() => {
        // Navigate if ID exists
        if (id) navigate(`/movie/${id}`);
        else alert("Invalid movie ID");
      }}
    >
      {/* Card Container - Fixed height */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
        
        {/* Poster image with fallback - Responsive height */}
        <div className="relative overflow-hidden h-[280px] sm:h-[320px] lg:h-[360px] flex-shrink-0">
          <img
            src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "/no-movie.png"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Rating Badge - Responsive size */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-yellow-500 text-black font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-lg">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs sm:text-sm">{vote_average ? vote_average.toFixed(1) : "N/A"}</span>
          </div>

          {/* Gradient Overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>

        {/* Movie info - Responsive padding and spacing */}
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex flex-col flex-grow">
          {/* Title - Responsive text size */}
          <h3 className="text-white font-bold text-base sm:text-lg line-clamp-2 min-h-[2.5rem] sm:min-h-[3.5rem] group-hover:text-yellow-400 transition-colors duration-300">
            {title}
          </h3>

          {/* Meta Information - Smaller on mobile */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
            {/* Language */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-blue-500/20 text-blue-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-blue-500/30">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="font-medium uppercase">{original_language || "N/A"}</span>
            </div>

            {/* Year */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-purple-500/20 text-purple-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-purple-500/30">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{release_date ? release_date.split("-")[0] : "N/A"}</span>
            </div>
          </div>

          {/* Hover indicator - Push to bottom */}
          <div className="flex items-center gap-2 text-gray-400 text-xs group-hover:text-yellow-400 transition-colors duration-300 mt-auto">
            <span>Click to view details</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;