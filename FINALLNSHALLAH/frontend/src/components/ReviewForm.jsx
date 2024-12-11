import React, { useState, useEffect } from "react";

const ReviewForm = ({ productId, onSubmit, onClose, userId }) => {
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

  const handleRatingChange = (rating) => {
    setNewReview((prevReview) => ({
      ...prevReview,
      rating,
    }));
  };

  const handleCommentChange = (e) => {
    setNewReview((prevReview) => ({
      ...prevReview,
      comment: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newReview.comment || newReview.rating === 0) {
      alert("Please provide both a rating and a comment.");
      return;
    }

    if (!userId) {
      alert("You must be logged in to submit a review.");
      return;
    }

    onSubmit({
      ...newReview,
      userId,
      productId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <div className="mb-4">
        <label className="block text-white mb-2">Rating</label>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className={`cursor-pointer text-2xl ${index < newReview.rating ? "text-yellow-400" : "text-gray-500"}`}
              onClick={() => handleRatingChange(index + 1)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-white mb-2">Comment</label>
        <textarea
          value={newReview.comment}
          onChange={handleCommentChange}
          className="w-full p-2 rounded-lg text-gray-800"
          rows="4"
          placeholder="Write your review here..."
        />
      </div>

      <div className="flex justify-between items-center">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
          Submit Review
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
