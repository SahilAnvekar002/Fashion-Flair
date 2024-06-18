import connectToMongo from '@/middleware/connectToMongo';
import Product from '@/models/Product';

const Razorpay = require('razorpay');

async function handler(req, res) {
   
    try {

        // check cart integrity
        for(let slug in req.body.cart){
            const product = await Product.findOne({slug : slug});
            if(!product){
                return res.status(400).json({error: "Your cart has been tempered. Retry again with new cart"});
            }
            if(product.title !== req.body.cart[slug].name){
                return res.status(400).json({error: "Your cart has been tempered. Retry again with new cart"});
            }
            if(product.price !== req.body.cart[slug].price){
                return res.status(400).json({error: "Your cart has been tempered. Retry again with new cart"});
            }
            if(product.size !== req.body.cart[slug].size){
                return res.status(400).json({error: "Your cart has been tempered. Retry again with new cart"});
            }
            if(product.color.toLowerCase() !== req.body.cart[slug].variant.toLowerCase()){
                return res.status(400).json({error: "Your cart has been tempered. Retry again with new cart"});
            }
            if(product.availableQty < req.body.cart[slug].qty){
                return res.status(400).json({error: "Your cart has been tempered. Retry again with new cart"});
            }
        }

        const key_id = process.env.NEXT_PUBLIC_RAZOR_PAY_KEY;
        const key_secret = process.env.NEXT_PUBLIC_RAZOR_PAY_SECRET;

        if (!key_id || !key_secret) {
            console.error("Razorpay API keys are not set.");
            res.status(500).json("Razorpay API keys are not set.");
        }

        const instance = new Razorpay({
            key_id,
            key_secret
        });

        const options = {
            amount: req.body.total * 100,
            currency: "INR",
            receipt: String(req.body.receipt),
            notes: {
                cart:  JSON.stringify(req.body.cart)
            }
        };

        const order = await instance.orders.create(options);
        
        res.status(200).json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json("Internal server error");
    }
    
}

export default connectToMongo(handler);