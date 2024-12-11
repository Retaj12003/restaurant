import Coupon from "../models/coupon.model.js";

export const getCouponService = async (userId) => {
    return await Coupon.findOne({ userId, isActive: true });
};

export const validateCouponService = async (userId, code) => {
    const coupon = await Coupon.findOne({ code, userId, isActive: true });

    if (!coupon) {
        throw new Error("Coupon not found");
    }

    if (coupon.expirationDate < new Date()) {
        coupon.isActive = false;
        await coupon.save();
        throw new Error("Coupon expired");
    }

    return {
        message: "Coupon is valid",
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
    };
};

export const createTestCouponService = async (userId, code, discountPercentage) => {
    return await Coupon.create({
        code,
        discountPercentage,
        expirationDate: new Date("2024-12-31"),
        isActive: true,
        userId,
    });
};

export const deactivateCouponService = async (userId, code) => {
    const deactivatedCoupon = await Coupon.findOneAndUpdate(
        { code, userId },
        { isActive: false },
        { new: true }
    );

    if (!deactivatedCoupon) {
        throw new Error("Coupon not found");
    }

    return {
        message: "Coupon deactivated successfully",
        coupon: deactivatedCoupon,
    };
};

export const generateCouponService = async (userId) => {
    await Coupon.findOneAndDelete({ userId });

    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId,
        isActive: true,
    });

    await newCoupon.save();
    return newCoupon;
};

export const applyCouponService = async (userId, code, amount) => {
    const coupon = await Coupon.findOne({ code, userId, isActive: true });

    if (!coupon) {
        throw new Error("Coupon not found");
    }

    const discountedAmount = amount - Math.round((amount * coupon.discountPercentage) / 100);

    return {
        originalAmount: amount,
        discountedAmount,
        discount: amount - discountedAmount,
        coupon,
    };
};
