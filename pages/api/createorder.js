import connectToMongo from "@/middleware/connectToMongo";
import Order from "@/models/Order";

const handler = async (req, res) => {

    if (req.method === 'POST') {

        try {
            
            const {userId, products, address, phone, pincode, state, city, amount, orderId, status, paymentDetails} = req.body;

            let order = new Order({
                userId, products, address, amount, orderId, status, paymentDetails, phone, pincode, state, city
            });

            await order.save();

            res.status(200).json(order);

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Invalid data" });
        }

    }
    else {
        res.status(400).json({ error: "This method is not allowed" });
    }

}

export default connectToMongo(handler);