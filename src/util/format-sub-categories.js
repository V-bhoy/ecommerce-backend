export function formatSubCategories(subCategories){
    const result = {};
    subCategories.forEach((subCategory)=>{
        if(result[subCategory.categoryName] === undefined){
            result[subCategory.categoryName] = [{
                id: subCategory.id,
                name: subCategory.name
            }];
        }else{
            result[subCategory.categoryName].push({
                id: subCategory.id,
                name: subCategory.name
            })
        }
    })
    return result;
}