import connectToMongo from "@/middleware/connectToMongo";
import Product from "@/models/Product";

const handler = async (req, res) => {

    if (req.method === 'POST') {

        try {
            for (let i = 0; i < req.body.length; i++) {
                let product = await Product.findByIdAndUpdate(req.body[i]._id, req.body[i]);
            }

            res.status(200).json({ success: "Products updated successfully" });

        } catch (error) {
            res.status(200).json({ error: "Invalid data" });
        }

    }
    else {
        res.status(400).json({ error: "This method is not allowed" });
    }

}

export default connectToMongo(handler);