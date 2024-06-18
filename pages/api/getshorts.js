import connectToMongo from "@/middleware/connectToMongo";
import Product from "@/models/Product";

const handler = async (req, res) => {
    let products = await Product.find({ category: 'Short' , availableQty: { $gt: 0 }});
    let shorts = {};

    for (let product of products) {
        if (product.title in shorts) {
            if (product.availableQty > 0 && !shorts[product.title].color.includes(product.color)) {
                shorts[product.title].color.push(product.color);
            }
            if (product.availableQty > 0 && !shorts[product.title].size.includes(product.size)) {
                shorts[product.title].size.push(product.size);
            }
        }
        else {
            shorts[product.title] = JSON.parse(JSON.stringify(product));
            if (product.availableQty > 0) {
                shorts[product.title].color = [product.color];
                shorts[product.title].size = [product.size];
            }
        }
    }

    res.status(200).json(shorts);
}

export default connectToMongo(handler);