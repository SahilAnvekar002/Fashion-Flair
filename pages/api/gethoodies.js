import connectToMongo from "@/middleware/connectToMongo";
import Product from "@/models/Product";

const handler = async (req, res)=> {
    let products = await Product.find({category : 'Hoodie', availableQty: { $gt: 0 }});
    let hoodies = {};

    for(let product of products){
        if(product.title in hoodies){
            if(product.availableQty > 0 && !hoodies[product.title].color.includes(product.color)){
                hoodies[product.title].color.push(product.color);
            }
            if(product.availableQty > 0 && !hoodies[product.title].size.includes(product.size)){
                hoodies[product.title].size.push(product.size);
            }
        }
        else{
            hoodies[product.title] = JSON.parse(JSON.stringify(product));
            if(product.availableQty > 0){
                hoodies[product.title].color = [product.color];
                hoodies[product.title].size = [product.size];
            }
        }
    }

    res.status(200).json(hoodies);
}

export default connectToMongo(handler);