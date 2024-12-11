import {
    getUserOrdersService,
    getAllOrdersService,
    deleteOrderService,
    updateOrderService,
    getOrderService
} from "../services/order.service.js";

export const getUserOrders = async (req, res) => {
    try {
        const orders = await getUserOrdersService(req.user._id);
        res.json(orders);
    } catch (error) {
        console.error("Error in getUserOrders:", error);
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await getAllOrdersService();
        res.json(orders);
    } catch (error) {
        console.error("Error in getAllOrders:", error);
        res.status(500).json({ message: "Error fetching all orders", error: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const response = await deleteOrderService(req.params.id, req.user);
        res.json(response);
    } catch (error) {
        console.error("Error in deleteOrder:", error);
        if (error.message === "Order not found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.status === 403) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: "Error deleting order", error: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await updateOrderService(req.params.id, req.user, {
            products: req.body.products,
            totalAmount: req.body.totalAmount,
            status: req.body.status
        });
        res.json(updatedOrder);
    } catch (error) {
        console.error("Error in updateOrder:", error);
        if (error.message === "Order not found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.status === 403) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: "Error updating order", error: error.message });
    }
};

export const getOrder = async (req, res) => {
    try {
        const order = await getOrderService(req.params.id, req.user);
        res.json(order);
    } catch (error) {
        console.error("Error in getOrder:", error);
        if (error.message === "Order not found") {
            return res.status(404).json({ message: error.message });
        }
        if (error.status === 403) {
            return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: "Error fetching order", error: error.message });
    }
};
