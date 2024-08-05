import connectToMongo from "@/middleware/connectToMongo";
import Product from "@/models/Product";

const allowedOrigins = ['https://fashion-flair-chi.vercel.app'];

const handler = async (req, res) => {

    // CORS handling
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    let products = await Product.find({ category: 'T-Shirt', availableQty: { $gt: 0 } });
    let tshirts = {};

    for (let product of products) {
        if (product.title in tshirts) {
            if (product.availableQty > 0 && !tshirts[product.title].color.includes(product.color)) {
                tshirts[product.title].color.push(product.color);
            }
            if (product.availableQty > 0 && !tshirts[product.title].size.includes(product.size)) {
                tshirts[product.title].size.push(product.size);
            }
        }
        else {
            if (product.availableQty > 0) {
                tshirts[product.title] = JSON.parse(JSON.stringify(product));
                tshirts[product.title].color = [product.color];
                tshirts[product.title].size = [product.size];
            }
        }
    }

    res.status(200).json(tshirts);
}

export default connectToMongo(handler);