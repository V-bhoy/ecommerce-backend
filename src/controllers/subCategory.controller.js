import * as SubCategoryModel from "../models/subCategory.model.js";
import * as CategoryModel from "../models/category.model.js"
import {formatSubCategories} from "../util/format-sub-categories.js";

export const createSubCategory = async(req, res)=>{
    const {name, categoryId} = req.body;
    if(!name || !categoryId){
        return res.status(400).json({
            success: false,
            message: "Required sub-category name & category Id!"
        })
    }
    try {
        const existingCategory = await CategoryModel.findById(categoryId);
        if(!existingCategory){
            return res.status(400).json({
                success: false,
                message: "Category does not exist"
            })
        }
        const existing = await SubCategoryModel.findByNameAndCategoryId(name, categoryId);
        if(existing){
            return res.status(409).json({
                success: false,
                message: "Sub-category already exists!"
            })
        }
        const [{id}] = await SubCategoryModel.save({name: name.toUpperCase(), category_id: categoryId});
        return res.status(200).json({
            success: true,
            message: `Sub category created successfully with id ${id}`
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        })
    }
}

export const getAllSubCategories = async(req, res)=>{
    try{
        const data = await SubCategoryModel.findAll();
        return res.status(200).json({
            success: true,
            subCategories: formatSubCategories(data)
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        })
    }
}