import connectToMongo from "@/middleware/connectToMongo";
import Product from "@/models/Product";

const handler = async (req, res) => {

    if (req.method === 'POST') {

        try {
            for (let i = 0; i < req.body.length; i++) {
                let product = new Product({
                    title: req.body[i].title,
                    desc: req.body[i].desc,
                    img: req.body[i].img,
                    slug: req.body[i].slug,
                    price: req.body[i].price,
                    category: req.body[i].category,
                    size: req.body[i].size,
                    color: req.body[i].color,
                    availableQty: req.body[i].availableQty
                });
                await product.save();
            }

            res.status(200).json({ success: "Products added successfully" });

        } catch (error) {
            res.status(500).json({ error: "Invalid data" });
        }

    }
    else {
        res.status(400).json({ error: "This method is not allowed" });
    }

}

export default connectToMongo(handler);