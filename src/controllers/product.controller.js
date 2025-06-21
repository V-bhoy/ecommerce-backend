import * as ProductModel from "../models/product.model.js";
import * as CategoryModel from "../models/category.model.js";
import * as SubCategoryModel from "../models/subCategory.model.js";

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
        const subCategoryExists = await SubCategoryModel.findById(subCategoryId);
        if (!subCategoryExists) {
            return res.status(400).json({
                success: false,
                message: `No sub-category exists with the given id - ${subCategoryId}!`
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