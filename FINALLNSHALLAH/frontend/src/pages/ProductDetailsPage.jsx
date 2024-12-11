import React, { useState, useEffect } from "react";
import axios from "../lib/axios";
import { useParams } from "react-router-dom"; 
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";

const ProductDetailsPage = () => {
  const { id } = useParams(); 
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/reviews/products/${id}`);
        setReviews(response.data);
      } catch (err) {
        setError("Error fetching reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const handleAddReview = async (newReview) => {
    if (!userId) {
      setError("User is not logged in");
      return;
    }

    try {
      const reviewData = {
        userId: userId,
        dishId: id, 
        rating: newReview.rating,
        comment: newReview.comment,
      };
      
      console.log(reviewData);
      
      await axios.post(`/reviews/products/${id}`, reviewData);
      const response = await axios.get(`/reviews/products/${id}`);
      setReviews(response.data);
      setIsFormOpen(false);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Error adding review. Please try again later.");
    }
  };

  const handleUpdateReview = (updatedReview) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review._id === updatedReview._id ? updatedReview : review
      )
    );
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`/reviews/${reviewId}`);
      setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
    } catch (err) {
      setError("Error deleting review. Please try again later.");
    }
  };

  if (loading) return <p className="text-lg text-white">Loading reviews...</p>;
  if (error) return <p className="text-lg text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Product Reviews</h1>

      {/* Add Review Button */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        Add Review
      </button>

      {/* Show Review Form if it's open */}
      {isFormOpen && (
        <ReviewForm
          productId={id}
          userId={userId} 
          onSubmit={handleAddReview}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {reviews.length === 0 ? (
        <p className="text-lg text-gray-400">No reviews yet</p>
      ) : (
        <ul className="space-y-8">
          {reviews.map((review) => (
            <li key={review._id}>
              <ReviewCard 
                review={review} 
                currentUserId={userId}
                onReviewUpdate={handleUpdateReview}
              />
              {/* If the current user is the author of the review, show the delete button */}
              {userId === review.userId._id && (
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
                >
                  Delete Review
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductDetailsPage;
