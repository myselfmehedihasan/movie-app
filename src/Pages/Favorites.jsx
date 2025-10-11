import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bouncy } from 'ldrs/react';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [currentUser]);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/favorites/${currentUser.uid}`);
      const data = await response.json();
      
      if (data.success) {
        setFavorites(data.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId, movieTitle) => {
    const result = await Swal.fire({
      title: 'Remove from Favorites?',
      text: `Remove "${movieTitle}" from your favorites?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/api/favorites/${favoriteId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          Swal.fire('Removed!', 'Movie removed from favorites.', 'success');
          fetchFavorites();
        }
      } catch (error) {
        console.error('Error removing favorite:', error);
        Swal.fire('Error!', 'Failed to remove favorite.', 'error');
      }
    }
  };

  if (!currentUser) {
    return null;
  }

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
        <h1 className="text-4xl font-bold text-white mb-8">
          ❤️ My Favorites
        </h1>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Bouncy size="45" speed="1.75" color="white" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">
              You haven't added any favorites yet.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favorites.map((favorite) => (
              <div
                key={favorite._id}
                className="group relative cursor-pointer"
              >
                {/* Movie Poster */}
                <div
                  onClick={() => navigate(`/movie/${favorite.movieId}`)}
                  className="relative overflow-hidden rounded-lg"
                >
                  <img
                    src={
                      favorite.posterPath
                        ? `https://image.tmdb.org/t/p/w500${favorite.posterPath}`
                        : '/no-movie.png'
                    }
                    alt={favorite.movieTitle}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Rating Badge */}
                  {favorite.rating && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black font-bold px-2 py-1 rounded-full text-sm">
                      ⭐ {favorite.rating}
                    </div>
                  )}

                  {/* Remove Button (on hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(favorite._id, favorite.movieTitle);
                    }}
                    className="absolute bottom-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>

                {/* Movie Title */}
                <h3 className="text-white font-semibold mt-2 line-clamp-2">
                  {favorite.movieTitle}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;