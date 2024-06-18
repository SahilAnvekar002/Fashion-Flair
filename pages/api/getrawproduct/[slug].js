import connectToMongo from "@/middleware/connectToMongo";
import Product from "@/models/Product";

const handler = async (req, res) => {
    try {

        let slug = req.query.slug;
        let product = await Product.findOne({ slug: slug });

        res.status(200).json({ product: product });

    } catch (error) {
        res.status(500).json(error.message);
    }

}

export default connectToMongo(handler);