import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProductsService = async () => {
    const products = await Product.find({});
    return products;
};

export const getFeaturedProductsService = async () => {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
        return JSON.parse(featuredProducts);
    }

    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
        return null;
    }

    await redis.set("featured_products", JSON.stringify(featuredProducts));
    return featuredProducts;
};

export const createProductService = async ({ name, description, price, image, category }) => {
    let imageUrl = "";
    if (image) {
        const cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        imageUrl = cloudinaryResponse.secure_url;
    }

    const product = await Product.create({
        name,
        description,
        price,
        image: imageUrl,
        category,
    });

    return product;
};

export const deleteProductService = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }

    if (product.image) {
        const publicId = product.image.split("/").pop().split(".")[0];
        try {
            await cloudinary.uploader.destroy(`products/${publicId}`);
        } catch (error) {
            console.log("Error deleting image from Cloudinary:", error);
        }
    }

    await Product.findByIdAndDelete(productId);
    return { message: "Product deleted successfully" };
};

export const getRecommendedProductsService = async () => {
    const products = await Product.aggregate([
        {
            $sample: { size: 4 },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                image: 1,
                price: 1,
            },
        },
    ]);
    return products;
};

export const getProductsByCategoryService = async (category) => {
    const products = await Product.find({ category });
    return products;
};

export const toggleFeaturedProductService = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();

    if (updatedProduct.isFeatured) {
        await updateFeaturedProductsCache();
    } else {
        // If it's no longer featured, still update cache to remove it.
        await updateFeaturedProductsCache();
    }

    return updatedProduct;
};

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("Error in updateFeaturedProductsCache:", error);
    }
}

export const updateProductService = async (productId, { name, description, price, image, category }) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }

    let imageUrl = product.image;

    if (image && image !== product.image) {
        // Delete old image if it exists
        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
            } catch (error) {
                console.log("Error deleting old image from Cloudinary:", error);
            }
        }

        // Upload new image
        const cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
        imageUrl = cloudinaryResponse.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            name: name || product.name,
            description: description || product.description,
            price: price || product.price,
            image: imageUrl,
            category: category || product.category,
        },
        { new: true }
    );

    if (updatedProduct.isFeatured) {
        await updateFeaturedProductsCache();
    }

    return updatedProduct;
};

export const searchProductsService = async (query) => {
    const searchRegex = new RegExp(query, 'i');
    const products = await Product.find({
        $or: [
            { name: searchRegex },
            { category: searchRegex },
            { description: searchRegex }
        ]
    });
    return products;
};

export const getProductService = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }
    return product;
};
