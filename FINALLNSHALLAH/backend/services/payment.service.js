import { stripe } from "../lib/stripe.js";
import axios from "axios";
import Order from "../models/order.model.js";

const BASE_URL = process.env.BASE_URL;

export const createCheckoutSessionService = async ({ products, couponCode, userId, cookie }) => {
    let totalAmount = products.reduce((sum, product) => {
        return sum + Math.round(product.price * 100) * product.quantity;
    }, 0);

    let stripeCouponId = null;
    let finalAmount = totalAmount;

    if (couponCode) {
        try {
            const validateResponse = await axios.post(`${BASE_URL}/api/coupons/validate`, {
                code: couponCode
            }, { headers: { Cookie: cookie } });

            if (validateResponse.data) {
                const applyResponse = await axios.post(`${BASE_URL}/api/coupons/apply`, {
                    code: couponCode,
                    userId,
                    amount: totalAmount
                }, { headers: { Cookie: cookie } });

                if (applyResponse.data) {
                    finalAmount = applyResponse.data.discountedAmount;
                    stripeCouponId = await stripe.coupons.create({
                        percent_off: applyResponse.data.coupon.discountPercentage,
                        duration: "once"
                    });
                }
            }
        } catch (error) {
            console.log("Coupon validation/application failed:", error.message);
        }
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map(product => ({
            price_data: {
                currency: "usd",
                product_data: { name: product.name, images: [product.image] },
                unit_amount: Math.round(product.price * 100)
            },
            quantity: product.quantity || 1
        })),
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
        discounts: stripeCouponId ? [{ coupon: stripeCouponId.id }] : [],
        metadata: {
            userId: userId.toString(),
            couponCode: couponCode || "",
            products: JSON.stringify(products.map(p => ({
                id: p._id || p.id,
                quantity: p.quantity,
                price: p.price,
                name: p.name
            })))
        }
    });

    if (finalAmount / 100 >= 200) {
        try {
            await axios.post(`${BASE_URL}/api/coupons/generate`, { userId }, { headers: { Cookie: cookie } });
            console.log("Gift coupon generated successfully");
        } catch (error) {
            console.log("Error generating gift coupon:", error.message);
        }
    }

    return { id: session.id, totalAmount: finalAmount / 100 };
};

export const checkoutSuccessService = async ({ sessionId, cookie }) => {
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
        return { success: true, orderId: existingOrder._id, isDuplicate: true };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
        if (session.metadata.couponCode) {
            try {
                await axios.post(`${BASE_URL}/api/coupons/deactivate`, {
                    code: session.metadata.couponCode,
                    userId: session.metadata.userId
                }, { headers: { Cookie: cookie } });
                console.log("Coupon deactivated successfully");
            } catch (error) {
                console.log("Error deactivating coupon:", error.message);
            }
        }

        const products = JSON.parse(session.metadata.products);

        try {
            const newOrder = await Order.create({
                user: session.metadata.userId,
                products: products.map(product => ({
                    product: product.id || product._id,
                    quantity: product.quantity,
                    price: product.price
                })),
                totalAmount: session.amount_total / 100,
                stripeSessionId: sessionId
            });

            return { success: true, orderId: newOrder._id, isNew: true };
        } catch (error) {
            const retryExistingOrder = await Order.findOne({ stripeSessionId: sessionId });
            if (retryExistingOrder) {
                return { success: true, orderId: retryExistingOrder._id, isDuplicate: true };
            }
            throw error;
        }
    } else {
        throw new Error(`Payment not successful. Status: ${session.payment_status}`);
    }
};
