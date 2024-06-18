import connectToMongo from "@/middleware/connectToMongo";
import Order from "@/models/Order";

const handler = async (req, res)=> {
    const { userId } = req.query;
    let orders = await Order.find({userId: userId});
    
    res.status(200).json(orders);
}

export default connectToMongo(handler);