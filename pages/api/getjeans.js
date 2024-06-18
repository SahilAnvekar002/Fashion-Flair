import connectToMongo from "@/middleware/connectToMongo";
import Product from "@/models/Product";

const handler = async (req, res)=> {
    let products = await Product.find({category : 'Jean', availableQty: { $gt: 0 }});
    let jeans = {};

    for(let product of products){
        if(product.title in jeans){
            if(product.availableQty > 0 && !jeans[product.title].color.includes(product.color)){
                jeans[product.title].color.push(product.color);
            }
            if(product.availableQty > 0 && !jeans[product.title].size.includes(product.size)){
                jeans[product.title].size.push(product.size);
            }
        }
        else{
            jeans[product.title] = JSON.parse(JSON.stringify(product));
            if(product.availableQty > 0){
                jeans[product.title].color = [product.color];
                jeans[product.title].size = [product.size];
            }
        }
    }

    res.status(200).json(jeans);
}

export default connectToMongo(handler);