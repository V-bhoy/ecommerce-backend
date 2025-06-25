import appConfig from "../index.js";

const {db} = appConfig;

export const getProductById = (id)=>db("products")
    .select("*")
    .where({id})
    .first();

export const findAllLatestProducts = ()=>db("products").select("*")
    .orderBy("created_at", "desc").limit(10);

export const findAllFeaturedProducts = ()=>db("products").select("*")
    .where({is_featured: true}).limit(10);

export const findAllPopularProducts = (categoryId=1)=>db("products").select("*")
    .where({category_id: categoryId}).limit(10);

export const getAllProductsByCategoryAndSubCategory = ({categoryId, subCategoryId})=>db("products").select("*")
    .where({category_id: categoryId, sub_category_id: subCategoryId});

export const saveProduct = (data)=>db("products").insert(data).returning("id");

export const findProductByTitleAndCategory =(data) =>db("products").select("*").where(data).first();

export const findAllProductsByCategory = (id, filters={}, limit, offset)=>{
    const {
        subCategoryIds,
        minPrice,
        maxPrice,
        inStock,
        sizes
    } = filters;
    const query = db("products as p")
        .select("p.*")
        .leftJoin("product_variants as pv", "p.id", "pv.product_id")
        .where("p.category_id", id)
        .groupBy("p.id");
    if (subCategoryIds?.length) {
        query.whereIn("p.sub_category_id", subCategoryIds);
    }
    if (minPrice && maxPrice) {
        query.whereBetween("p.mrp", [minPrice, maxPrice]);
    }
    if (sizes?.length) {
        query.whereIn("pv.size", sizes);
    }
    if (typeof inStock === "boolean") {
        if(inStock){
            query.havingRaw("SUM(pv.qty)>0");
        }else{
            query.havingRaw("SUM(pv.qty)=0");
        }
    }
    return query.limit(limit).offset(offset);
}

export const countAllProductsByCategory = (id, filters={})=>{
    const {
        subCategoryIds,
        minPrice,
        maxPrice,
        inStock,
        sizes
    } = filters;
    const query = db("products as p")
        .countDistinct("p.id as count")
        .leftJoin("product_variants as pv", "p.id", "pv.product_id")
        .where("p.category_id", id);

    if (subCategoryIds?.length) {
        query.whereIn("p.sub_category_id", subCategoryIds);
    }
    if (minPrice && maxPrice) {
        query.whereBetween("p.mrp", [minPrice, maxPrice]);
    }
    if (sizes?.length) {
        query.whereIn("pv.size", sizes);
    }
    if (typeof inStock === "boolean") {
        if(inStock){
            query.havingRaw("SUM(pv.qty)>0");
        }else{
            query.havingRaw("SUM(pv.qty)=0");
        }
    }
    return query;
}
