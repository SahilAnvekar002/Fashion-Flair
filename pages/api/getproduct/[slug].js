import connectToMongo from "@/middleware/connectToMongo";
import Product from "@/models/Product";

const handler = async (req, res) => {
    try {

        let slug = req.query.slug;
        let p = await Product.findOne({ slug: slug });
        if(!p){
            return res.status(404).json({error : "Product not found"});
        }
        let products = await Product.find({ title: p.title , category: p.category, availableQty: { $gt: 0 }});

        let finalProduct = {
            _id: p._id,
            title: p.title,
            desc: p.desc,
            img: p.img,
            price: p.price,
            availableQty: p.availableQty,
            slug: p.slug,
            category: p.category,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            size: [p.size],
            color: []
        };

        let slugs = [];

        for (let product of products) {
            if (product.availableQty > 0 && !finalProduct.color.includes(product.color)) {
                finalProduct.color.push(product.color);
            }
            if (product.availableQty > 0 && !finalProduct.size.includes(product.size) && p.color === product.color) {
                !finalProduct.size.push(product.size);
            }
            slugs.push(product.slug);
        }

        res.status(200).json({ product: finalProduct, slugs: slugs });

    } catch (error) {
        res.status(500).json(error.message);
    }

}

export default connectToMongo(handler);