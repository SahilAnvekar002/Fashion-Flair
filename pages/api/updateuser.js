import connectToMongo from "@/middleware/connectToMongo";
import User from "@/models/User";
import mongoose from "mongoose";

async function handler(req, res) {
    try {
        const {userId} = req.query;
        const {name, address, pincode, phone} = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ error: 'User not found' });
        }
        await User.findByIdAndUpdate(userId, {name: name, address: address, pincode: pincode, phone: phone});
        const user = await User.findById(userId);

        res.status(200).json(user);
    }
    catch(error){
        console.log(error);
        res.status(500).json("Internal server error");
    }
}

export default connectToMongo(handler);