import { Router } from "express";
import * as reviewsController from "../controllers/review.controller.js";

const reviewsRouter = Router();

reviewsRouter.get("/products/:dishId", reviewsController.getReviews);
reviewsRouter.post("/products/:dishId", reviewsController.addReview);
reviewsRouter.put("/:reviewId", reviewsController.updateReview);
reviewsRouter.delete("/:reviewId", reviewsController.deleteReview);

export default reviewsRouter;
