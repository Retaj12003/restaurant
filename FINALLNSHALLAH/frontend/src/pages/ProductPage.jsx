import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ProductPage = () => {
    const { category, id } = useParams();
    const [product, setProduct] = useState(null);
    const { loading, getProduct } = useProductStore();
    const { addToCart } = useCartStore();

    useEffect(() => {
        const fetchProduct = async () => {
            const fetchedProduct = await getProduct(id);
            setProduct(fetchedProduct);
        };
        fetchProduct();
    }, [id, getProduct]);

    if (loading || !product) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square relative">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl font-bold text-gray-100">{product.name}</h1>
                    <p className="text-xl text-emerald-400 mt-2">${product.price.toFixed(2)}</p>
                    <p className="text-gray-400 mt-4">{product.description}</p>
                    <div className="mt-8">
                        <button
                            onClick={() => {
                                addToCart(product);
                                toast.success("Added to cart!");
                            }}
                            className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 
                                     transition-colors w-full md:w-auto"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;