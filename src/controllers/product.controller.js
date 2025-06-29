import * as ProductModel from "../models/product.model.js";
import * as ProductVariantModel from "../models/productVariant.model.js"
import * as CategoryModel from "../models/category.model.js";
import * as SubCategoryModel from "../models/subCategory.model.js";
import * as WishlistModel from "../models/wishlist.model.js";
import * as ReviewModel from "../models/review.model.js";
import {formatProducts} from "../util/format-products.js";
import {calculatePriceAfterDiscount} from "../util/calculate-price-after-discount.js";

export const saveProduct = async (req, res) => {
    const {title, mrp, categoryId, subCategoryId, discount, imageUrl, shortInfo, description, details, specifications, isFeatured} = req.body;
    if (!title || !mrp || !categoryId || !subCategoryId) {
        return res.status(400).json({
            success: false,
            message: "Required fields - title, mrp, categoryId, subCategoryId."
        })
    }
    if (mrp <= 0) {
        return res.status(400).json({
            success: false,
            message: "MRP cannot be 0!"
        })
    }
    if (discount < 0) {
        return res.status(400).json({
            success: false,
            message: "Product discount cannot be negative!"
        })
    }
    try {
        const categoryExists = await CategoryModel.findById(categoryId);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: `No category exists with the given id - ${categoryId}!`
            })
        }
        const subCategoryExists = await SubCategoryModel.findByIdAndCategoryId(subCategoryId, categoryId);
        if (!subCategoryExists) {
            return res.status(400).json({
                success: false,
                message: `No sub-category exists with the given id - ${subCategoryId} and category Id - ${categoryId}!`
            })
        }
        const existing = await ProductModel.findProductByTitleAndCategory({
            title: title,
            category_id: categoryId,
            sub_category_id: subCategoryId
        })
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Product with the category already exists!"
            })
        }
        const [{id}] = await ProductModel.saveProduct({
            title,
            image_url : imageUrl,
            short_info: shortInfo,
            description,
            mrp,
            discount,
            details,
            specifications,
            category_id: categoryId,
            sub_category_id: subCategoryId,
            is_featured: isFeatured
        });
        res.status(200).json({
            success: true,
            message: "New Product inserted with id - " + id
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Server error'});
    }
}

export const getAllProductsByCategory = async(req, res)=>{
    const {category} = req.params;
    const {page =1, limit = 10} = req.query;
    const filters = req.body;
    const userId = req.user?.id;

    if(!category){
        return res.status(400).json({
            success: false,
            message: "Invalid category!"
        })
    }

    try {
        const categoryExists = await CategoryModel.findByName(category);
        if(!categoryExists){
            return res.status(400).json({
                success: false,
                message: "Category does not exist!"
            })
        }
        const offset = (page - 1)*limit;
        const [data, [countResult]] = await Promise.all( [
            ProductModel.findAllProducts({categoryId: categoryExists.id, userId, filters, limit: +limit, offset: +offset}),
            ProductModel.countAllProducts({categoryId: categoryExists.id, userId, filters}),
        ]);

        const totalCount = +(countResult?.count || 0);
        const totalPages = Math.ceil(totalCount/limit);

        return res.status(200).json({
            success: true,
            products: formatProducts(data),
            page,
            limit,
            totalCount,
            totalPages
        })

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Server error'});
    }
}

export const getIdByCategoryAndSubCategory = async(req, res)=>{
    const {category, subCategory} = req.query;
    if(!category || !subCategory){
        return res.status(400).json({
            success: false,
            message: "Invalid category or sub category!"
        })
    }
    try {
        const categoryExists = await CategoryModel.findByName(category);
        if(!categoryExists){
            return res.status(400).json({
                success: false,
                message: "Category does not exist!"
            })
        }
        const subCategoryExists = await SubCategoryModel.findByNameAndCategoryId(subCategory, categoryExists.id);
        if(!subCategoryExists){
            return res.status(400).json({
                success: false,
                message: "Subcategory does not exist!"
            })
        }
        return res.status(200).json({
            success: true,
            categoryId: categoryExists.id,
            subCategoryId: subCategoryExists.id
        })
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Server error'});
    }
}

export const getAllHomePageProducts = async(req, res)=>{
    try {
        const latestProducts = await ProductModel.findAllLatestProducts();
        const featuredProducts = await ProductModel.findAllFeaturedProducts();

        return res.status(200).json({
            success: true,
            data: {
                latestProducts: formatProducts(latestProducts),
                featuredProducts: formatProducts(featuredProducts)
            }
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getAllPopularProducts = async(req, res)=>{
    const {categoryId} = req.params;
    if(!categoryId || isNaN(categoryId)){
        res.status(400).json({
            success: false,
            message: "Invalid category!"
        })
    }
    try{
        const data = await ProductModel.findAllPopularProducts(categoryId)
        return res.status(200).json({
            success: true,
            data: formatProducts(data)
        })
    }catch(err){
       console.log(err);
       return res.status(500).json({
           success: false,
           message: "Server Error"
       })
    }
}

export const getProductDetailsById = async(req, res)=>{
    const {productId} = req.params;
    const {viewOnly} = req.query;
    const userId = req.user?.id;
    if(!productId || isNaN(productId) ){
        return res.status(400).json({
            success: false,
            message: "Invalid Product Id"
        })
    }
    try{
        const product = await ProductModel.getProductById(productId);
        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            })
        }
        const category = CategoryModel.findById(product.category_id);
        const countReviews= ReviewModel.countProductReviews(productId);
        const avgRating = ReviewModel.getProductAverageRating(productId);
        const variants = ProductVariantModel.findInStockVariantsByProductId(productId);
        const similarProducts = ProductModel.findAllSimilarProducts(product);
        const complementaryProducts = ProductModel.findAllComplementaryProducts(product);
        let isWishlisted = !!userId;
        if(userId){
            const exist = await WishlistModel.findWishlist(userId, productId);
            isWishlisted = !!exist;
        }

        const [categoryResult, variantsResult, [total], rating] = await Promise.all([category, variants, countReviews, avgRating]);
        const productDetails = {
            ...product,
            isWishlisted,
            rating: Math.round(+rating.average_rating),
            totalReviews: total.count || 0,
            category: categoryResult.name,
            inStock: variantsResult.length > 0,
            priceAfterDiscount: calculatePriceAfterDiscount(product.mrp, product.discount),
            variants: variantsResult
        }
        if(viewOnly){
            return res.status(200).json({
                success: true,
                productDetails
            })
        }
        const [similarProductsResult, complementaryProductsResult] = await Promise.all([similarProducts, complementaryProducts]);
        return res.status(200).json({
            success: true,
            productDetails,
            similarProducts: formatProducts(similarProductsResult),
            complementaryProducts: formatProducts(complementaryProductsResult)
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getAllProducts = async(req, res)=>{
    const {page =1, limit = 10} = req.query;
    const filters = req.body;
    const userId = req.user?.id;
    const onlyWishlisted = req.originalUrl.startsWith("/api/wishlist/all");
    const offset = (page - 1)*limit;
   try {
       const [data, [countResult]] = await Promise.all( [
           ProductModel.findAllProducts({ filters, userId, limit: +limit, offset: +offset, onlyWishlisted}),
           ProductModel.countAllProducts({filters, userId, onlyWishlisted}),
       ]);

       const totalCount = +(countResult?.count || 0);
       const totalPages = Math.ceil(totalCount/limit);

       return res.status(200).json({
           success: true,
           products: formatProducts(data),
           page,
           limit,
           totalCount,
           totalPages
       })

   }catch(err){
       console.log(err);
       res.status(500).json({error: 'Server error'});
   }
}
