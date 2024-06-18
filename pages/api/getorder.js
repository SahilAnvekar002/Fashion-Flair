import connectToMongo from "@/middleware/connectToMongo";
import Order from "@/models/Order";
import mongoose from "mongoose";

const handler = async (req, res)=> {
    try{
        const { id } = req.query;      

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Order not found' });
        }

        let order = await Order.findById(id);
        
        if(!order){
            return res.status(404).json({error : 'Order not found'});
        }
    
        res.status(200).json(order);
    }catch(error){
        res.status(500).json("Internal server error");
    }
}

export default connectToMongo(handler);