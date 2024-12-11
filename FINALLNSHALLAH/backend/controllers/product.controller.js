import {
    getAllProductsService,
    getFeaturedProductsService,
    createProductService,
    deleteProductService,
    getRecommendedProductsService,
    getProductsByCategoryService,
    toggleFeaturedProductService,
    updateProductService,
    searchProductsService,
    getProductService
} from "../services/product.service.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await getAllProductsService();
        res.json({ products });
    } catch (error) {
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await getFeaturedProductsService();

        if (!featuredProducts) {
            return res.status(404).json({ message: "No featured products found" });
        }

        res.json(featuredProducts);
    } catch (error) {
        console.log("Error in getFeaturedProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;
        const product = await createProductService({ name, description, price, image, category });
        res.status(201).json(product);
    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const response = await deleteProductService(req.params.id);
        res.json(response);
    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        if (error.message === "Product not found") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await getRecommendedProductsService();
        res.json(products);
    } catch (error) {
        console.log("Error in getRecommendedProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await getProductsByCategoryService(category);
        res.json({ products });
    } catch (error) {
        console.log("Error in getProductsByCategory controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const updatedProduct = await toggleFeaturedProductService(req.params.id);
        res.json(updatedProduct);
    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller", error.message);
        if (error.message === "Product not found") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await updateProductService(req.params.id, req.body);
        res.json(updatedProduct);
    } catch (error) {
        console.log("Error in updateProduct controller:", error.message);
        if (error.message === "Product not found") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        const products = await searchProductsService(q);
        res.json({ products });
    } catch (error) {
        console.error("Error in searchProducts:", error);
        res.status(500).json({ message: "Error searching products", error: error.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await getProductService(req.params.id);
        res.json(product);
    } catch (error) {
        console.error("Error in getProduct:", error);
        if (error.message === "Product not found") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};
