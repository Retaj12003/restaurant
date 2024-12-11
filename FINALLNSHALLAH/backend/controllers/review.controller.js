import * as reviewService from "../services/review.service.js";

export const getReviews = async (req, res) => {
  try {
    const { dishId } = req.params;
    const reviews = await reviewService.getReviewsByDishId(dishId);

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error in getReviews controller:", error.message); 
    res.status(500).json({ message: `Error fetching reviews: ${error.message}` });
  }
};

export const addReview = async (req, res) => {
  try {
    const review = await reviewService.addReview(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateReview = async (req, res) => {
  console.log("AAAAAAAAAAAAAAAA");

  const { reviewId } = req.params;
  const { rating, comment, userId } = req.body;

  try {
    const existingReview = await reviewService.getReviewById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    const updatedReview = await reviewService.updateReview(reviewId, { rating, comment });
    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  try {
    const result = await reviewService.deleteReview(reviewId);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
