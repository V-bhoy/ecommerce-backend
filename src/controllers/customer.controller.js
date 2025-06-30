import * as CustomerModel from "../models/customer.model.js";
import bcrypt from "bcryptjs";

export const fetchCustomerAddress = async(req, res)=>{
    const email = req.user.email;
    try{
        const customer = await CustomerModel.findByEmail(email);
        if(!customer){
            return res.status(404).json({
                success: false,
                message: "Customer not found!"
            })
        }

        return res.status(200).json({
            success: true,
            address: {
                street: customer?.address,
                area: customer?.landmark,
                city: customer?.city,
                state: customer?.state,
                pincode: customer?.pincode
            }
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success: true,
            message: "Server error"
        })
    }
}

export const updateCustomerAddress = async(req, res)=>{
    const email = req.user.email;
    const {address} = req.body;
    if(!address){
        return res.status(400).json({
            success: false,
            message: "Address details are required!"
        })
    }
    try{
        const customer = await CustomerModel.findByEmail(email);
        if(!customer){
            return res.status(404).json({
                success: false,
                message: "Customer not found!"
            })
        }

        await CustomerModel.updateAddress({
            address: address?.street,
            landmark: address?.area,
            city: address?.city,
            state: address?.state,
            pincode: address?.pincode
        }, email)

        return res.status(200).json({
            success: true,
            message: "Updated address successfully!"
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success: true,
            message: "Server error"
        })
    }
}

export const resetPassword = async(req, res)=>{
    const email = req.user.email;
    const {password} = req.body;
    try{
        const customer = await CustomerModel.findByEmail(email);
        if(!customer){
            return res.status(404).json({
                success: false,
                message: "Customer not found!"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await CustomerModel.updatePassword({
            email,
            password: hashedPassword
        })

        return res.status(200).json({
            success: true,
            message: "Updated Password successfully!"
        })

    }catch (err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}