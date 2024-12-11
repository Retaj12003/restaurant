import React, { useState } from 'react';
import axios from '../lib/axios';

const ReviewCard = ({ review, currentUserId, onReviewUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState({
    rating: review.rating,
    comment: review.comment
  });

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(`/reviews/${review._id}`, {
        ...editedReview,
        userId: currentUserId
      });
      onReviewUpdate(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating review:', error);
      alert(error.response?.data?.message || 'Error updating review');
    }
  };

  if (isEditing) {
    return (
      <li className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="mb-4">
          <label className="block text-white mb-2">Rating</label>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                className={`cursor-pointer text-2xl ${
                  index < editedReview.rating ? "text-yellow-400" : "text-gray-500"
                }`}
                onClick={() => setEditedReview({ ...editedReview, rating: index + 1 })}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Comment</label>
          <textarea
            value={editedReview.comment}
            onChange={(e) => setEditedReview({ ...editedReview, comment: e.target.value })}
            className="w-full p-2 rounded-lg text-gray-800"
            rows="4"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleEditSubmit}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <p className="text-xl font-semibold text-white">{review.userId.name}</p>
        <div className="ml-4 flex items-center text-yellow-400">
          {Array.from({ length: review.rating }).map((_, index) => (
            <span key={index} className="text-xl">★</span>
          ))}
          {Array.from({ length: 5 - review.rating }).map((_, index) => (
            <span key={index} className="text-xl text-gray-500">★</span>
          ))}
        </div>
      </div>

      <p className="text-gray-300 text-lg mb-4">{review.comment}</p>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          <small>Posted on: {new Date(review.createdAt).toLocaleDateString()}</small>
        </p>
        {currentUserId === review.userId._id && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-emerald-400 hover:text-emerald-300"
          >
            Edit Review
          </button>
        )}
      </div>
    </li>
  );
};

export default ReviewCard;
