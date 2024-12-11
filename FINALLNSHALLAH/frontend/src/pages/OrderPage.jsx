import { useEffect } from "react";
import { useOrderStore } from "../stores/useOrderStore";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const OrderPage = () => {
    const { orders, loading, getUserOrders } = useOrderStore();

    useEffect(() => {
        getUserOrders();
    }, [getUserOrders]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4 py-8"
        >
            <h1 className="text-3xl font-bold text-gray-100 mb-8">My Orders</h1>
            
            {orders.length === 0 ? (
                <p className="text-gray-400 text-center">No orders found</p>
            ) : (
                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-gray-800 rounded-lg p-6 shadow-lg"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Order ID: {order._id}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Date: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <p className="text-xl font-semibold text-emerald-500">
                                    ${order.totalAmount.toFixed(2)}
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                {order.products.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center gap-4 border-t border-gray-700 pt-4"
                                    >
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-gray-100">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                Quantity: {item.quantity}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Price: ${item.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default OrderPage;