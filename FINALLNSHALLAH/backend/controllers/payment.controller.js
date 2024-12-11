import { createCheckoutSessionService, checkoutSuccessService } from "../services/payment.service.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array" });
        }

        const sessionData = await createCheckoutSessionService({
            products,
            couponCode,
            userId: req.user._id,
            cookie: req.headers.cookie
        });

        res.json(sessionData);
    } catch (error) {
        console.error("Error in createCheckoutSession:", error);
        res.status(500).json({ error: error.message });
    }
};

export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const result = await checkoutSuccessService({
            sessionId,
            cookie: req.headers.cookie
        });
        res.json(result);
    } catch (error) {
        console.error("Error in checkoutSuccess:", error);
        res.status(500).json({ error: error.message });
    }
};