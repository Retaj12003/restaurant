import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
    getUserOrders,
    getAllOrders,
    deleteOrder,
    updateOrder,
    getOrder
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/my-orders", protectRoute, getUserOrders);
router.get("/:id", protectRoute, getOrder);
router.put("/:id", protectRoute, updateOrder);
router.delete("/:id", protectRoute, deleteOrder);
router.get("/", protectRoute, adminRoute, getAllOrders);

export default router;