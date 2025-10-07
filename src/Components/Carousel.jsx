import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"; // 🟢 INFO: Used for animations and drag gestures

/* ======================================================
   🔹 ICON COMPONENTS
   ====================================================== */

// ✨ Sparkles icon (currently unused, but available for effects)
const SparklesIcon = ({ className }) => (
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
    <path d="M9.93 2.25 12 7.5l2.07-5.25a.5.5 0 0 1 .9 0L17.25 8.5l4.16.34a.5.5 0 0 1 .29.88l-3.2 3.1.95 4.5a.5.5 0 0 1-.73.53L12 14.5l-3.72 2.33a.5.5 0 0 1-.73-.53l.95-4.5-3.2-3.1a.5.5 0 0 1 .29-.88l4.16-.34Z" />
  </svg>
);

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
   🎠 MAIN CAROUSEL COMPONENT
   ====================================================== */

export default function Carousel() {
  // 🟢 STATE: Holds fetched movie cards
  const [cardData, setCardData] = useState([]);

  // 🟢 STATE: Tracks currently active slide index
  const [activeIndex, setActiveIndex] = useState(0);

  // 🟢 STATE: Whether carousel autoplay is paused (e.g. on hover)
  const [isPaused, setIsPaused] = useState(false);

  // 🟢 REF: Stores autoplay interval so we can clear it
  const autoplayIntervalRef = useRef(null);

  // 🟢 CONFIG: Autoplay interval delay in ms
  const autoplayDelay = 3000;

  /* ======================================================
     🌐 FETCH MOVIE DATA FROM TMDB API
     ====================================================== */
  useEffect(() => {
    const fetchTrending = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`, // 🔑 Uses TMDB API key from env
        },
      };

      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
          options
        );
        const data = await res.json();

        // 🟢 SUCCESS: Store only top 9 movies with essential data
        if (data.results) {
          setCardData(
            data.results.slice(0, 9).map((m) => ({
              id: m.id,
              imageUrl: `https://image.tmdb.org/t/p/original${
                m.backdrop_path || m.poster_path
              }`,
              title: m.title || m.name,
            }))
          );
        }
      } catch (err) {
        console.error("❌ Error fetching trending movies:", err);
      }
    };

    fetchTrending();
  }, []);

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

  // 🟠 NOTE: Render nothing until movie data is loaded
  if (cardData.length === 0) return null;

  /* ======================================================
     🖼️ RENDER CAROUSEL UI
     ====================================================== */
  return (
    <section className="relative w-full flex-col items-center justify-center font-sans overflow-hidden">
      <div
        className="relative w-full max-w-5xl mx-auto p-4"
        onMouseEnter={() => setIsPaused(true)} // ⏸️ Pause autoplay on hover
        onMouseLeave={() => setIsPaused(false)} // ▶️ Resume autoplay
      >
        <div className="relative flex w-full flex-col rounded-3xl bg-transparent backdrop-blur-md border border-white/10 p-4 pt-6 md:p-6">
          {/* 🖼️ MAIN SLIDER AREA */}
          <div className="relative w-full h-[280px] md:h-[400px] flex items-center justify-center overflow-hidden">
            <motion.div
              className="w-full h-full flex items-center justify-center"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={onDragEnd}
            >
              {/* 🔁 Map each movie to a Card */}
              {cardData.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  index={index}
                  activeIndex={activeIndex}
                  totalCards={cardData.length}
                />
              ))}
            </motion.div>
          </div>

          {/* ⚙️ OPTIONAL: Pagination + navigation arrows
              Uncomment if you want visible controls */}
          {/*
          <div className="flex items-center justify-center gap-6 mt-6">
            <button
              onClick={() => changeSlide(activeIndex - 1)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors focus:ring-2 focus:ring-pink-500"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-center gap-2">
              {cardData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index ? "w-6 bg-pink-400" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => changeSlide(activeIndex + 1)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors focus:ring-2 focus:ring-pink-500"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </div>
          */}
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   🧩 CARD COMPONENT
   ====================================================== */
function Card({ card, index, activeIndex, totalCards }) {
  // 🟢 Determine offset from active card
  let offset = index - activeIndex;

  // 🔁 Adjust offset for infinite looping
  if (offset > totalCards / 2) offset -= totalCards;
  else if (offset < -totalCards / 2) offset += totalCards;

  // 🟢 Only show cards near the active one
  const isVisible = Math.abs(offset) <= 1;

  // 🟢 Animation setup for Framer Motion
  const animate = {
    x: `${offset * 50}%`,
    scale: offset === 0 ? 1 : 0.8,
    zIndex: totalCards - Math.abs(offset),
    opacity: isVisible ? 1 : 0,
    transition: { type: "spring", stiffness: 260, damping: 30 },
  };

  return (
    <motion.div
      className="absolute w-1/2 md:w-1/3 h-[95%]"
      style={{ transformStyle: "preserve-3d" }}
      animate={animate}
      initial={false}
    >
      <div className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-gray-200 dark:bg-neutral-800">
        {/* 🖼️ Movie Image */}
        <img
          src={card.imageUrl}
          alt={card.title}
          className="w-full h-full object-cover pointer-events-none"
          // 🔴 Fallback if image fails to load
          onError={(e) => {
            e.target.src =
              "https://placehold.co/400x600/1e1e1e/ffffff?text=Image+Missing";
          }}
        />

        {/* 🏷️ Overlay Title Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <h4 className="text-white text-lg font-semibold">{card.title}</h4>
         
        </div>
      </div>
    </motion.div>
  );
}
