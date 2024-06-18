import connectToMongo from "@/middleware/connectToMongo";
import User from "@/models/User";

const handler = async (req, res)=> {
    let users = await User.find({});
    
    res.status(200).json(users);
}

export default connectToMongo(handler);