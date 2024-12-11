import {
    getCouponService,
    validateCouponService,
    createTestCouponService,
    deactivateCouponService,
    generateCouponService,
    applyCouponService
} from "../services/coupon.service.js";

export const getCoupon = async (req, res) => {
    try {
        const coupon = await getCouponService(req.user._id);
        res.json(coupon || null);
    } catch (error) {
        console.log("Error in getCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const result = await validateCouponService(req.user._id, code);
        res.json(result);
    } catch (error) {
        console.log("Error in validateCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const createTestCoupon = async (req, res) => {
    try {
        const { code, discountPercentage } = req.body;
        const coupon = await createTestCouponService(req.user._id, code, discountPercentage);
        res.status(201).json(coupon);
    } catch (error) {
        console.log("Error creating test coupon:", error.message);
        res.status(500).json({ message: "Error creating coupon" });
    }
};

export const deactivateCoupon = async (req, res) => {
    try {
        const { code, userId } = req.body;
        const result = await deactivateCouponService(userId, code);
        res.json(result);
    } catch (error) {
        console.log("Error deactivating coupon:", error.message);
        res.status(500).json({ message: "Error deactivating coupon", error: error.message });
    }
};

export const generateCoupon = async (req, res) => {
    try {
        const { userId } = req.body;
        const newCoupon = await generateCouponService(userId);
        res.status(201).json({ message: "New coupon generated", coupon: newCoupon });
    } catch (error) {
        console.log("Error generating coupon:", error.message);
        res.status(500).json({ message: "Error generating coupon", error: error.message });
    }
};

export const applyCoupon = async (req, res) => {
    try {
        const { code, userId, amount } = req.body;
        const result = await applyCouponService(userId, code, amount);
        res.json(result);
    } catch (error) {
        console.log("Error applying coupon:", error.message);
        res.status(500).json({ message: "Error applying coupon", error: error.message });
    }
};
