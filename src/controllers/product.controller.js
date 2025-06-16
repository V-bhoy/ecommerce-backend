import * as ProductModel from "../models/product.model.js";

export const saveProduct = async(req, res)=>{
   try{
     const {data} = req.body;
     const id = await ProductModel.saveProduct(data);
     res.status(200).json({
         message: "New Product inserted with id - "+id
     })
   }catch (err){
       console.log(err);
       res.status(500).json({ error: 'Server error' });
   }
}