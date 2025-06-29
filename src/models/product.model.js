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

export const findAllComplementaryProducts = (product)=>db("products")
    .select("*").where("category_id", product.category_id)
    .andWhere("id", "!=", product.id)
    .orderByRaw("RANDOM()")
    .limit(10)

export const findAllSimilarProducts = (product)=>db("products")
    .select("*").where("sub_category_id", product.sub_category_id)
    .andWhere("id", "!=", product.id)
    .limit(10)

export const findAllProducts = ({categoryId, filters={}, limit, offset})=>{
    const {
        subCategoryIds,
        inStock,
        sizes,
        minPrice,
        maxPrice,
        sortBy,
        search
    } = filters;
    const query = db("products as p")
        .select("p.*",
            db.raw(`CASE WHEN SUM(pv.qty) > 0 THEN true ELSE false END AS "inStock"`)
        )
        .leftJoin("product_variants as pv", "p.id", "pv.product_id")
        .groupBy("p.id");
    if(categoryId){
        query.where("p.category_id", categoryId);
    }
    if (subCategoryIds?.length) {
        query.whereIn("p.sub_category_id", subCategoryIds);
    }
    if(search){
        query.whereILike("p.title", `%${search}%`);
    }
    if (minPrice && maxPrice) {
        query.whereRaw('(p.mrp  - (p.mrp * p.discount / 100)) BETWEEN ? AND ?', [minPrice, maxPrice]);
    }
    if (sizes?.length) {
        query.whereIn("pv.size", sizes);
    }
    if (typeof inStock === "boolean") {
        query.havingRaw(`SUM(pv.qty) ${inStock ? '>' : '='} 0`);
    }
    if(sortBy){
        const value = sortBy.name+"_"+sortBy.value;
        switch (value){
            case "price_asc":
                query.orderByRaw(`(p.mrp - (p.mrp * p.discount / 100)) ASC`);
                break;
            case "price_desc":
                query.orderByRaw(`(p.mrp - (p.mrp * p.discount / 100)) DESC`);
                break;
            case "title_asc":
                query.orderBy("p.title", "asc");
                break;
            case "title_desc":
                query.orderBy("p.title", "desc");
                break;
            default:
                break;
        }
    }
    return query.limit(limit).offset(offset);
}

export const countAllProducts = ({categoryId, filters={}})=>{
    const {
        subCategoryIds,
        inStock,
        minPrice,
        maxPrice,
        sizes,
        search
    } = filters;
    const query = db("products as p")
        .countDistinct("p.id as count")
        .leftJoin("product_variants as pv", "p.id", "pv.product_id");

    if(categoryId){
        query.where("p.category_id", categoryId);
    }
    if (subCategoryIds?.length) {
        query.whereIn("p.sub_category_id", subCategoryIds);
    }
    if(search){
        query.whereILike("p.title",`%${search}%`)
    }
    if (minPrice && maxPrice) {
        query.whereRaw('(p.mrp  - (p.mrp * p.discount / 100)) BETWEEN ? AND ?', [minPrice, maxPrice]);
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
