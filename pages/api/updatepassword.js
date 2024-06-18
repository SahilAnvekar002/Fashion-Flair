import connectToMongo from "@/middleware/connectToMongo";
import User from "@/models/User";
import mongoose from "mongoose";
const CryptoJS = require("crypto-js");

async function handler(req, res) {
    try {
        const { userId } = req.query;
        const { password, cpassword } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = await User.findById(userId);

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

        if(decryptedPassword !== password){
            return res.status(404).json({ error: 'Passwords does not match' });
        }

        const encryptedPassword = CryptoJS.AES.encrypt(cpassword, process.env.SECRET_KEY).toString();

        await User.findByIdAndUpdate(userId, { password: encryptedPassword });

        res.status(200).json("Password updated successfully");
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Internal server error");
    }
}

export default connectToMongo(handler);