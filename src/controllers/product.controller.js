import * as ProductModel from "../models/product.model.js";
import * as CategoryModel from "../models/category.model.js";
import * as SubCategoryModel from "../models/subCategory.model.js";
import {formatProducts} from "../util/format-products.js";

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
            ProductModel.findAllProductsByCategory(categoryExists.id, filters, +limit, +offset),
            ProductModel.countAllProductsByCategory(categoryExists.id, filters)
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

export const getAllProductsByCategoryAndSubCategory = async(req, res)=>{
    const {category, subCategory} = req.params;
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
        const data = await ProductModel.getAllProductsByCategoryAndSubCategory({
            categoryId: categoryExists.id,
            subCategoryId: subCategoryExists.id
        });
        return res.status(200).json({
            success: true,
            products: formatProducts(data)
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
