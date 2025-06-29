import appConfig from "../index.js";
import * as OrdersModel from "../models/orders.model.js";
import * as OrderItemsModel from "../models/order_items.model.js";
import * as ProductVariantModel from "../models/productVariant.model.js";
import { createHmac } from "crypto";

const {razorpay} = appConfig;

export const createOrder = async(req, res)=>{
    const {items, billingDetails} = req.body;
    const userId = req.user.id;
    const gstAmount = 20;

    const {totalAmount, discount} = items.reduce((acc, item)=>{
        const totalMrp = acc.totalAmount + (item.mrp * item.cartQty);
        const totalDiscount =  acc.discount + (item.mrp * (item.discount/100) * item.cartQty);
        return {
            totalAmount: totalMrp,
            discount : totalDiscount,
        }
    }, {
        totalAmount: 0,
        discount: 0,
    })

    const finalAmount =  totalAmount  - discount;

    const options = {
        amount: (finalAmount + gstAmount) * 100,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
    }

    try{
       const razorpayOrder = await razorpay.orders.create(options);
       const [orderId] = await OrdersModel.createOrder({
           customer_id: userId,
           total_amount: totalAmount,
           discount: discount,
           final_amount: finalAmount + gstAmount,
           gst: gstAmount,
           razorpay_order_id: razorpayOrder.id,
           status: "created",
           billing_details: billingDetails
       })

        const orderItems = items.map((item)=>({
            order_id: orderId.id,
            sku_id: item.sku_id,
            product_id: item.id,
            mrp: item.mrp,
            discount: item.discount,
            item_price: item.priceAfterDiscount,
            qty: item.cartQty
        }))

        await OrderItemsModel.addOrderItems(orderItems);

        return res.status(200).json({
            success: true,
            orderId: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
            status: razorpayOrder.status,
            receipt: razorpayOrder.receipt,
            createdAt: razorpayOrder.created_at
        })


    }catch (err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const verifyOrderPayment = async(req, res)=>{
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try{
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");
        if(expectedSignature === razorpay_signature){
           await OrdersModel.updateOrder({
               payment_id: razorpay_payment_id,
               status: "paid",
               paid_at: new Date()
           }, {razorpay_order_id})

            const {id: orderId} = await OrdersModel.getOrderId(razorpay_order_id);
            const orderedItems = await OrderItemsModel.getOrderedItemsById(orderId);
            const decrementPromises = orderedItems.map(item =>
                ProductVariantModel.updateSkuQty(item.sku_id, item.qty)
            );
            await Promise.all(decrementPromises);

            return res.status(200).json({
                success: true,
                message: "Payment successful!"
            })
        }

        await OrdersModel.updateOrder({
            status: "payment_failed"
        }, {razorpay_order_id});

        return res.status(400).json({
            success: false,
            message: "Invalid signature!"
        })
    }catch (err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const updateOrderPaymentFailed = async(req, res)=>{
    const {orderId} = req.body;
    if(!orderId){
        return res.status(400).json({
            success: false,
            message: "Invalid orderId"
        })
    }
    try{
       await OrdersModel.updateOrder({
           status: "payment_failed"
       }, {razorpay_order_id: orderId});

       return res.status(200).json({
           success: true,
           message: "Order update successful!"
       })

    }catch (err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const getAllOrdersByUserId = async(req, res)=>{
    const userId = req.user.id;
    try{
      const orders = await OrdersModel.getAllOrders(userId);
      return res.status(200).json({
          success: true,
          orders
      })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}