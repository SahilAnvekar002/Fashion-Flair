import connectToMongo from "@/middleware/connectToMongo";
import Order from "@/models/Order";

const handler = async (req, res)=> {
    let orders = await Order.find({});
    
    res.status(200).json(orders);
}

export default connectToMongo(handler);