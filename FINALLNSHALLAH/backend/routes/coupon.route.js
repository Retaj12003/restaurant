import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
    getCoupon, 
    validateCoupon, 
    createTestCoupon,
    deactivateCoupon,
    generateCoupon,
    applyCoupon 
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCoupon);
router.post("/create-test", protectRoute, createTestCoupon);
router.put("/deactivate", protectRoute, deactivateCoupon);
router.post("/generate", protectRoute, generateCoupon);
router.post("/apply", protectRoute, applyCoupon);

export default router;