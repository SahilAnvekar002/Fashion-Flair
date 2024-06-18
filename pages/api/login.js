import connectToMongo from "@/middleware/connectToMongo";
import User from "@/models/User";
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

const handler = async (req, res) => {

    if (req.method === 'POST') {

        try {
            const { email, password } = req.body;

            let user = await User.findOne({ email });
            if (!user) {
                res.status(400).json({ error: "Invalid Credentials" });
            }

            const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
            const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

            if (decryptedPassword !== password) {
                res.status(400).json({ error: "Invalid Credentials" });
            }

            const token = jwt.sign({id: user._id}, process.env.JWT_KEY, {
                expiresIn : '2d'
            });

            res.status(200).json({ token });

        } catch (error) {
            res.status(400).json({ error: "Invalid Input" });
        }

    }
    else {
        res.status(400).json({ error: "This method is not allowed" });
    }

}

export default connectToMongo(handler);