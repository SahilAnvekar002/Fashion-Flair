import connectToMongo from "@/middleware/connectToMongo";
import Product from "@/models/Product";

const handler = async (req, res)=> {
    let products = await Product.find();
    res.status(200).json(products);
}

export default connectToMongo(handler);