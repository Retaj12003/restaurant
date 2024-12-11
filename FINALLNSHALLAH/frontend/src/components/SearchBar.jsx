import { useState, useEffect, useRef } from "react";
import { useProductStore } from "../stores/useProductStore";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const { searchProducts, searchResults, loading } = useProductStore();
    const searchRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query) {
                searchProducts(query);
                setShowResults(true);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, searchProducts]);

    return (
        <div className="relative w-full max-w-xl mx-auto mb-8" ref={searchRef}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products by name or category..."
                    className="w-full px-4 py-2 pl-10 pr-10 bg-gray-800 border border-gray-700 rounded-lg 
                             text-gray-200 placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setShowResults(false);
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                                 hover:text-gray-200 transition-colors"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showResults && searchResults.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg 
                                 shadow-lg overflow-hidden z-50"
                    >
                        <div className="max-h-96 overflow-y-auto">
                            {searchResults.map((product) => (
                                <Link
                                    key={product._id}
                                    to={`/category/${product.category}/${product._id}`}
                                    onClick={() => setShowResults(false)}
                                    className="flex items-center gap-4 p-4 hover:bg-gray-700 transition-colors"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                        <h3 className="text-gray-200 font-medium">{product.name}</h3>
                                        <p className="text-gray-400 text-sm">{product.category}</p>
                                        <p className="text-emerald-400 font-medium">
                                            ${product.price.toFixed(2)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;