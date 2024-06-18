import connectToMongo from "@/middleware/connectToMongo";
import User from "@/models/User";
import mongoose from "mongoose";
const CryptoJS = require("crypto-js");

async function handler(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email : email});

        const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();

        await User.findByIdAndUpdate(user._id, { password: encryptedPassword });

        res.status(200).json({success: "Password updated successfully"});
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Internal server error");
    }
}

export default connectToMongo(handler);