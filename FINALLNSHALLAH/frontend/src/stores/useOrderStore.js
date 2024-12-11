import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useOrderStore = create((set) => ({
    orders: [],
    loading: false,
    error: null,

    getUserOrders: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/orders/my-orders");
            set({ orders: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error(error.response?.data?.message || "Error fetching orders");
            set({ error: error.message, loading: false });
        }
    },

    getAllOrders: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/orders");
            set({ orders: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching all orders:", error);
            toast.error(error.response?.data?.message || "Error fetching orders");
            set({ error: error.message, loading: false });
        }
    },

    deleteOrder: async (orderId) => {
        try {
            await axios.delete(`/orders/${orderId}`);
            set((state) => ({
                orders: state.orders.filter((order) => order._id !== orderId)
            }));
            toast.success("Order deleted successfully");
        } catch (error) {
            console.error("Error deleting order:", error);
            toast.error(error.response?.data?.message || "Error deleting order");
        }
    },

    updateOrder: async (orderId, orderData) => {
        try {
            const response = await axios.put(`/orders/${orderId}`, orderData);
            set((state) => ({
                orders: state.orders.map((order) =>
                    order._id === orderId ? response.data : order
                )
            }));
            toast.success("Order updated successfully");
        } catch (error) {
            console.error("Error updating order:", error);
            toast.error(error.response?.data?.message || "Error updating order");
        }
    }
}));