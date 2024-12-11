import { cartService } from "../services/cart.service.js";

export const getCartProducts = async (req, res) => {
    try {
        const cartItems = await cartService.getCartProducts(req.user._id, req.user.cartItems);
        res.json(cartItems);
    } catch (error) {
        console.log("Error in getCartProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const cartItems = await cartService.addToCart(req.user._id, productId);
        res.json(cartItems);
    } catch (error) {
        console.log("Error in addToCart controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const cartItems = await cartService.removeFromCart(req.user._id, productId);
        res.json(cartItems);
    } catch (error) {
        console.log("Error in removeAllFromCart controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const cartItems = await cartService.updateQuantity(req.user._id, productId, quantity);
        res.json(cartItems);
    } catch (error) {
        if (error.message === "Product not found in cart") {
            return res.status(404).json({ message: error.message });
        }
        console.log("Error in updateQuantity controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};