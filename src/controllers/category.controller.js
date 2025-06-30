import * as CategoryModel from "../models/category.model.js";

export const createCategory = async(req, res, next)=>{
    const {name} = req.body;
    if(!name){
        return res.status(400).json({
            success: false,
            message: "Required category name!"
        })
    }
    try {
        const existing = await CategoryModel.findByName(name);
        if(existing){
            return res.status(409).json({
                success: false,
                message: "Category already exists!"
            })
        }
        const [{id}] = await CategoryModel.save({name: name.toUpperCase()});
        return res.status(200).json({
            success: true,
            message: `Category created successfully with id ${id}`
        })
    }catch(err){
       next(err);
    }
}

export const getAllCategories = async(req,res, next)=>{
    try{
        const data = await CategoryModel.findAll();
        return res.status(200).json({
            success: true,
            categories: data
        })
    }catch(err){
        next(err);
    }
}