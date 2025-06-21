import * as SubCategoryModel from "../models/subCategory.model.js";

export const createSubCategory = async(req, res)=>{
    const {name} = req.body;
    if(!name){
        return res.status(400).json({
            success: false,
            message: "Required sub-category name!"
        })
    }
    try {
        const existing = await SubCategoryModel.findByName(name);
        if(existing){
            return res.status(409).json({
                success: false,
                message: "Sub-category already exists!"
            })
        }
        const [{id}] = await SubCategoryModel.save({name: name.toUpperCase()});
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
            subCategories: data
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        })
    }
}