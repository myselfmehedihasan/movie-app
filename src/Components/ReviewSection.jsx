import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

// ✅ Backend URL - change this based on your deployment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ReviewSection = ({ movieId, movieTitle }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();

  // Fetch reviews when component mounts
  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  // ✅ Fetch all reviews for this movie
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/reviews/${movieId}`);
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

  // ✅ Submit new review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to submit a review',
      });
      return;
    }

    if (!newReview.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Review',
        text: 'Please write a review before submitting',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId,
          movieTitle,
          userId: currentUser.uid,
          userName: currentUser.displayName || currentUser.email,
          userPhoto: currentUser.photoURL || null,
          rating,
          review: newReview,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Review Submitted!',
          text: 'Thank you for your review',
          timer: 2000,
          showConfirmButton: false,
        });

        setNewReview('');
        setRating(5);
        fetchReviews(); // Refresh reviews
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to submit review. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Delete review
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
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Your review has been deleted.',
            timer: 2000,
            showConfirmButton: false,
          });
          fetchReviews();
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to delete review.',
        });
      }
    }
  };

  // Star rating component
  const StarRating = ({ value, onChange, readOnly = false }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange(star)}
          className={`text-2xl transition-colors ${
            star <= value ? 'text-yellow-400' : 'text-gray-600'
          } ${!readOnly && 'hover:text-yellow-300 cursor-pointer'}`}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>

      {/* Review Form */}
      {currentUser ? (
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Your Rating</label>
              <StarRating value={rating} onChange={setRating} />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Your Review</label>
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows="4"
                placeholder="Share your thoughts about this movie..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6 mb-8 text-center">
          <p className="text-gray-400 mb-4">Please login to write a review</p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-200"
          >
            Login
          </a>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-800 rounded-lg">
            <p className="text-gray-400">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {review.userPhoto ? (
                    <img
                      src={review.userPhoto}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full border-2 border-purple-500"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      {review.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white">{review.userName}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {currentUser && currentUser.uid === review.userId && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>

              <StarRating value={review.rating} readOnly />

              <p className="mt-3 text-gray-300 leading-relaxed">{review.review}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;