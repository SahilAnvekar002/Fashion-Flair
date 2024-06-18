import connectToMongo from "@/middleware/connectToMongo";
import User from "@/models/User";
const CryptoJS = require("crypto-js");

const handler = async (req, res) => {

    if (req.method === 'POST') {

        try {
            const {name, email, password} = req.body;

            const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();

            let user = new User({name, email, password: encryptedPassword});
            await user.save();

            res.status(200).json({success: 'success'});

        } catch (error) {
            res.status(200).json({ error: "Invalid Input" });
        }

    }
    else {
        res.status(400).json({ error: "This method is not allowed" });
    }

}

export default connectToMongo(handler);