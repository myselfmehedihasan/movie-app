import React from 'react';

/**
 * AnimatedButton Component
 * * Button with animated text stroke hover effect
 * @param {string} text - Button text to display
 * @param {Function} onClick - Click handler
 * @param {string} className - Additional CSS classes
 */
const AnimatedButton = ({ text = "PopcornTalks", onClick, className = "" }) => {
  return (
    <div className={`animated-button-wrapper ${className}`}>
      <button className="animated-button" onClick={onClick}>
        <span className="actual-text">&nbsp;{text}&nbsp;</span>
        <span aria-hidden="true" className="hover-text">&nbsp;{text}&nbsp;</span>
      </button>

      <style jsx>{`
        .animated-button-wrapper {
          display: inline-block;
        }

        /* Remove default button style */
        .animated-button {
          margin: 0;
          height: auto;
          background: transparent;
          padding: 0;
          border: none;
          cursor: pointer;
          position: relative;
        }

        /* Button styling */
        .animated-button {
          --border-right: 4px;
          --text-stroke-color: rgba(255, 255, 255, 0.6);
          --animation-color: #37ff8b;
          --fs-size: 1.2em;
          letter-spacing: 3px;
          text-decoration: none;
          font-size: var(--fs-size);
          font-family: "Arial", sans-serif;
          position: relative;
          text-transform: uppercase;
          color: transparent;
          -webkit-text-stroke: 1px var(--text-stroke-color);
          font-weight: bold;
        }

        /* Actual text */
        .actual-text {
          display: inline-block;
        }

        /* Hover text overlay */
        .hover-text {
          position: absolute;
          box-sizing: border-box;
          content: attr(data-text);
          color: var(--animation-color);
          width: 0%;
          inset: 0;
          border-right: var(--border-right) solid var(--animation-color);
          overflow: hidden;
          transition: 0.5s;
          -webkit-text-stroke: 1px var(--animation-color);
        }

        /* Hover effect */
        .animated-button:hover .hover-text {
          width: 100%;
          filter: drop-shadow(0 0 23px var(--animation-color));
        }

        /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
          .animated-button {
            --text-stroke-color: rgba(255, 255, 255, 0.8);
          }
        }

        /* Responsive sizing */
        @media (max-width: 768px) {
          .animated-button {
            --fs-size: 1em;
            letter-spacing: 2px;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedButton;