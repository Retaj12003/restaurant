import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const cartService = {
    getCartProducts: async (userId, cartItems) => {
        try {
            if (!cartItems || cartItems.length === 0) {
                return [];
            }

            const productIds = cartItems.map(item => {
                const id = item._id || item;
                return new mongoose.Types.ObjectId(id);
            });

            const products = await Product.find({ _id: { $in: productIds } });
            
            return products.map((product) => {
                const item = cartItems.find(cartItem => {
                    const itemId = cartItem._id ? cartItem._id.toString() : cartItem.toString();
                    return itemId === product._id.toString();
                });
                return { 
                    ...product.toJSON(), 
                    quantity: item?.quantity || 1 
                };
            });
        } catch (error) {
            console.error("Error in getCartProducts:", error);
            throw new Error("Failed to fetch cart products");
        }
    },

    addToCart: async (userId, productId) => {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error("User not found");

            const product = await Product.findById(productId);
            if (!product) throw new Error("Product not found");

            const existingItemIndex = user.cartItems.findIndex(item => {
                const itemId = item._id ? item._id.toString() : item.toString();
                return itemId === productId.toString();
            });

            if (existingItemIndex > -1) {
                if (!user.cartItems[existingItemIndex].quantity) {
                    user.cartItems[existingItemIndex] = {
                        _id: user.cartItems[existingItemIndex],
                        quantity: 2
                    };
                } else {
                    user.cartItems[existingItemIndex].quantity += 1;
                }
            } else {
                user.cartItems.push({
                    _id: productId,
                    quantity: 1
                });
            }

            await user.save();
            return user.cartItems;
        } catch (error) {
            console.error("Error in addToCart:", error);
            throw new Error(error.message);
        }
    },

    removeFromCart: async (userId, productId = null) => {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error("User not found");

            if (!productId) {
                user.cartItems = [];
            } else {
                const initialLength = user.cartItems.length;
                user.cartItems = user.cartItems.filter(item => {
                    const itemId = item._id ? item._id.toString() : item.toString();
                    return itemId !== productId.toString();
                });

                if (user.cartItems.length === initialLength) {
                    throw new Error("Product not found in cart");
                }
            }

            await user.save();
            return user.cartItems;
        } catch (error) {
            console.error("Error in removeFromCart:", error);
            throw new Error(error.message);
        }
    },

    updateQuantity: async (userId, productId, quantity) => {
        try {
            if (quantity < 0) throw new Error("Quantity cannot be negative");

            const user = await User.findById(userId);
            if (!user) throw new Error("User not found");

            const existingItemIndex = user.cartItems.findIndex(item => {
                const itemId = item._id ? item._id.toString() : item.toString();
                return itemId === productId.toString();
            });

            if (existingItemIndex === -1) {
                const product = await Product.findById(productId);
                if (!product) {
                    throw new Error("Product not found");
                }
                throw new Error("Product not found in cart");
            }

            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item, index) => 
                    index !== existingItemIndex
                );
            } else {
                if (!user.cartItems[existingItemIndex].quantity) {
                    user.cartItems[existingItemIndex] = {
                        _id: user.cartItems[existingItemIndex],
                        quantity: quantity
                    };
                } else {
                    user.cartItems[existingItemIndex].quantity = quantity;
                }
            }

            await user.save();
            return user.cartItems;
        } catch (error) {
            console.error("Error in updateQuantity:", error);
            throw new Error(error.message);
        }
    },

    getCartTotal: async (userId) => {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error("User not found");

            const productIds = user.cartItems.map(item => 
                new mongoose.Types.ObjectId(item._id || item)
            );

            const products = await Product.find({ _id: { $in: productIds } });

            return user.cartItems.reduce((total, cartItem) => {
                const product = products.find(p => {
                    const itemId = cartItem._id ? cartItem._id.toString() : cartItem.toString();
                    return p._id.toString() === itemId;
                });
                return total + (product ? product.price * (cartItem.quantity || 1) : 0);
            }, 0);
        } catch (error) {
            console.error("Error in getCartTotal:", error);
            throw new Error("Failed to calculate cart total");
        }
    }
};