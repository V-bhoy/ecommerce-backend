export function calculatePriceAfterDiscount(mrp, discount){
    const discountPrice = mrp * discount/100;
    return mrp - discountPrice;
}