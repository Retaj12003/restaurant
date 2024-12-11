import Order from "../models/order.model.js";

export const getUserOrdersService = async (userId) => {
    const orders = await Order.find({ user: userId })
        .populate('user', 'name email')
        .populate('products.product');
    return orders;
};

export const getAllOrdersService = async () => {
    const orders = await Order.find({})
        .populate('user', 'name email')
        .populate('products.product');
    return orders;
};

export const deleteOrderService = async (orderId, user) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error("Order not found");
    }

    if (!user.isAdmin && order.user.toString() !== user._id.toString()) {
        const err = new Error("Not authorized to delete this order");
        err.status = 403;
        throw err;
    }

    await Order.findByIdAndDelete(orderId);
    return { message: "Order deleted successfully" };
};

export const updateOrderService = async (orderId, user, data) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error("Order not found");
    }

    if (!user.isAdmin && order.user.toString() !== user._id.toString()) {
        const err = new Error("Not authorized to update this order");
        err.status = 403;
        throw err;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
            products: data.products,
            totalAmount: data.totalAmount,
            status: data.status
        },
        { new: true }
    )
    .populate('user', 'name email')
    .populate('products.product');

    return updatedOrder;
};

export const getOrderService = async (orderId, user) => {
    const order = await Order.findById(orderId)
        .populate('user', 'name email')
        .populate('products.product');

    if (!order) {
        throw new Error("Order not found");
    }

    if (!user.isAdmin && order.user.toString() !== user._id.toString()) {
        const err = new Error("Not authorized to view this order");
        err.status = 403;
        throw err;
    }

    return order;
};
