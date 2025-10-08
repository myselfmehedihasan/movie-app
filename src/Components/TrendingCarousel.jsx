import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ======================================================
   🔹 ICON COMPONENTS
   ====================================================== */

// ⬅️ Chevron Left icon for previous navigation
const ChevronLeftIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

// ➡️ Chevron Right icon for next navigation
const ChevronRightIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

/* ======================================================
   🎠 TRENDING CAROUSEL COMPONENT
   ====================================================== */

export default function TrendingCarousel({ trendingMovies = [] }) {
  const navigate = useNavigate();
  
  // 🟢 STATE: Tracks currently active slide index
  const [activeIndex, setActiveIndex] = useState(0);

  // 🟢 STATE: Whether carousel autoplay is paused (e.g. on hover)
  const [isPaused, setIsPaused] = useState(false);

  // 🟢 REF: Stores autoplay interval so we can clear it
  const autoplayIntervalRef = useRef(null);

  // 🟢 CONFIG: Autoplay interval delay in ms
  const autoplayDelay = 3000;

  // Transform movie data to card format
  const cardData = trendingMovies.slice(0, 9).map((movie) => ({
    id: movie.id,
    imageUrl: movie.poster_path 
      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
      : movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : "/no-movie.png",
    title: movie.title || movie.name || "Unknown Title",
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
    year: movie.release_date ? movie.release_date.split("-")[0] : "N/A",
  }));

  /* ======================================================
     🔁 AUTOPLAY & SLIDE CONTROLS
     ====================================================== */

  // 🟢 FUNCTION: Go to next slide (wraps around)
  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % cardData.length);
  };

  // 🟢 EFFECT: Handles autoplay logic
  useEffect(() => {
    if (!isPaused && cardData.length > 0) {
      autoplayIntervalRef.current = setInterval(goToNext, autoplayDelay);
    }
    // 🧹 Cleanup: Clear interval when paused/unmounted
    return () => clearInterval(autoplayIntervalRef.current);
  }, [isPaused, activeIndex, cardData]);

  // 🟡 FUNCTION: Change slide manually
  const changeSlide = (newIndex) => {
    setActiveIndex((newIndex + cardData.length) % cardData.length);
  };

  // 🟢 FUNCTION: Detect drag/swipe direction and trigger slide
  const onDragEnd = (event, info) => {
    const dragThreshold = 75; // Minimum swipe distance
    const dragOffset = info.offset.x;

    if (dragOffset > dragThreshold) changeSlide(activeIndex - 1); // Swipe right → previous
    else if (dragOffset < -dragThreshold) changeSlide(activeIndex + 1); // Swipe left → next
  };

  // Handle card click
  const handleCardClick = (movieId) => {
    if (movieId) {
      navigate(`/movie/${movieId}`);
    }
  };

  // 🟠 NOTE: Render nothing until movie data is loaded
  if (cardData.length === 0) return null;

  /* ======================================================
     🖼️ RENDER CAROUSEL UI
     ====================================================== */
  return (
    <section className="relative w-full flex-col items-center justify-center font-sans overflow-hidden py-12">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white">
          Trending Movies
        </h1>
      </header>

      <div
        className="relative w-full max-w-6xl mx-auto px-4"
        onMouseEnter={() => setIsPaused(true)} // ⏸️ Pause autoplay on hover
        onMouseLeave={() => setIsPaused(false)} // ▶️ Resume autoplay
      >
        <div className="relative flex w-full flex-col rounded-3xl bg-transparent backdrop-blur-md border border-white/10 p-4 pt-6 md:p-6">
          {/* 🖼️ MAIN SLIDER AREA */}
          <div className="relative w-full h-[320px] md:h-[450px] flex items-center justify-center overflow-hidden">
            <motion.div
              className="w-full h-full flex items-center justify-center"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={onDragEnd}
            >
              {/* 🔁 Map each movie to a Card */}
              {cardData.map((card, index) => (
                <MovieCard
                  key={card.id}
                  card={card}
                  index={index}
                  activeIndex={activeIndex}
                  totalCards={cardData.length}
                  onClick={() => handleCardClick(card.id)}
                />
              ))}
            </motion.div>
          </div>

          {/* ⚙️ Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <button
              onClick={() => changeSlide(activeIndex - 1)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors focus:ring-2 focus:ring-violet-500"
              aria-label="Previous slide"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>

            {/* Pagination dots */}
            <div className="flex items-center justify-center gap-2">
              {cardData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index ? "w-8 bg-violet-500" : "w-2 bg-white/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => changeSlide(activeIndex + 1)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors focus:ring-2 focus:ring-violet-500"
              aria-label="Next slide"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   🧩 MOVIE CARD COMPONENT
   ====================================================== */
function MovieCard({ card, index, activeIndex, totalCards, onClick }) {
  // 🟢 Determine offset from active card
  let offset = index - activeIndex;

  // 🔁 Adjust offset for infinite looping
  if (offset > totalCards / 2) offset -= totalCards;
  else if (offset < -totalCards / 2) offset += totalCards;

  // 🟢 Only show cards near the active one
  const isVisible = Math.abs(offset) <= 2;

  // 🟢 Animation setup for Framer Motion
  const animate = {
    x: `${offset * 55}%`,
    scale: offset === 0 ? 1 : 0.85,
    zIndex: totalCards - Math.abs(offset),
    opacity: isVisible ? (offset === 0 ? 1 : 0.6) : 0,
    transition: { type: "spring", stiffness: 260, damping: 30 },
  };

  return (
    <motion.div
      className="absolute w-[70%] sm:w-1/2 md:w-[40%] lg:w-[35%] h-[95%] cursor-pointer"
      style={{ transformStyle: "preserve-3d" }}
      animate={animate}
      initial={false}
      onClick={offset === 0 ? onClick : undefined}
      whileHover={offset === 0 ? { scale: 1.02 } : {}}
    >
      <div className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-gray-800">
        {/* 🖼️ Movie Image */}
        <img
          src={card.imageUrl}
          alt={card.title}
          className="w-full h-full object-cover pointer-events-none"
          onError={(e) => {
            e.target.src = "/no-movie.png";
          }}
        />

        {/* Rating Badge - Top Right */}
        <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg z-10">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm">{card.rating}</span>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

        {/* 🏷️ Overlay Title Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <h4 className="text-white text-xl font-bold mb-2 line-clamp-2">
            {card.title}
          </h4>
          <div className="flex items-center gap-2 text-gray-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">{card.year}</span>
          </div>
          
          {/* Click indicator for active card */}
          {offset === 0 && (
            <div className="mt-3 flex items-center gap-2 text-violet-400 text-sm">
              <span>Click to view details</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}