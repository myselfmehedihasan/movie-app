import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bouncy } from 'ldrs/react';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchMyReviews();
  }, [currentUser]);

  const fetchMyReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/reviews/user/${currentUser.uid}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const result = await Swal.fire({
      title: 'Delete Review?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          Swal.fire('Deleted!', 'Your review has been deleted.', 'success');
          fetchMyReviews();
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        Swal.fire('Error!', 'Failed to delete review.', 'error');
      }
    }
  };

  const StarRating = ({ value }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-2xl ${star <= value ? 'text-yellow-400' : 'text-gray-600'}`}
        >
          ★
        </span>
      ))}
    </div>
  );

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
          ⭐ My Reviews
        </h1>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Bouncy size="45" speed="1.75" color="white" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">
              You haven't written any reviews yet.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          /* Reviews List */
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-800/90 backdrop-blur-lg rounded-xl p-6 hover:bg-gray-700/90 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3
                      className="text-2xl font-bold text-white mb-2 cursor-pointer hover:text-purple-400 transition-colors"
                      onClick={() => navigate(`/movie/${review.movieId}`)}
                    >
                      {review.movieTitle}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-500 hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>

                <StarRating value={review.rating} />

                <p className="mt-4 text-gray-300 leading-relaxed">
                  {review.review}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews;