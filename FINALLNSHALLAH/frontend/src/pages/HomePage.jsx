import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import SearchBar from "../components/SearchBar";

const categories = [
    { href: "/burgers", name: "Burgers", imageUrl: "/burger.jpg" },
    { href: "/desserts", name: "Desserts", imageUrl: "/dessert.jpg" },
    { href: "/drinks", name: "Drinks", imageUrl: "/drink.jpg" },
    { href: "/pastas", name: "Pastas", imageUrl: "/pasta.jpg" },
    { href: "/pizzas", name: "Pizzas", imageUrl: "/pizza.jpg" },
    { href: "/healthy", name: "Healthy", imageUrl: "/salad.jpg" },
    { href: "/soups", name: "Soups", imageUrl: "/soup.jpg" },
];

const HomePage = () => {
    const { fetchFeaturedProducts, products = [], isLoading } = useProductStore();

    useEffect(() => {
        fetchFeaturedProducts();
    }, [fetchFeaturedProducts]);

    return (
        <div className='relative min-h-screen text-white overflow-hidden'>
            <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
                    Explore Our Categories
                </h1>
                <p className='text-center text-xl text-gray-300 mb-12'>
                    Discover the latest dishes from our menu
                </p>

                <SearchBar />

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {categories.map((category) => (
                        <CategoryItem category={category} key={category.name} />
                    ))}
                </div>

                {!isLoading && Array.isArray(products) && products.length > 0 && (
                    <FeaturedProducts featuredProducts={products} />
                )}
            </div>
        </div>
    );
};

export default HomePage;
