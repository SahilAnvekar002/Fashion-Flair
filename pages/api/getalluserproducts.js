import connectToMongo from "@/middleware/connectToMongo";
import Product from "@/models/Product";

const handler = async (req, res) => {
    let products = await Product.find({ availableQty: { $gt: 0 }});
    let ps = {};

    for (let product of products) {
        if (product.title in ps) {
            if (product.availableQty > 0 && !ps[product.title].color.includes(product.color)) {
                ps[product.title].color.push(product.color);
            }
            if (product.availableQty > 0 && !ps[product.title].size.includes(product.size)) {
                ps[product.title].size.push(product.size);
            }
        }
        else {
            if (product.availableQty > 0) {
                ps[product.title] = JSON.parse(JSON.stringify(product));
                ps[product.title].color = [product.color];
                ps[product.title].size = [product.size];
            }
        }
    }

    res.status(200).json(ps);
}

export default connectToMongo(handler);