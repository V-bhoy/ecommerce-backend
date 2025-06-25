import {calculatePriceAfterDiscount} from "./calculate-price-after-discount.js";

export function formatProducts(products){
    return products?.map((product)=>({
        ...product,
        priceAfterDiscount: calculatePriceAfterDiscount(product.mrp, product.discount)
    }))
}