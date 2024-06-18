import User from "@/models/User";
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
    try {
        const { token } = req.query;        

        const decodedToken = jwt.decode(token, { complete: true });
        const exp = decodedToken.payload.exp;
        
        if (exp) {
            const currentTime = Math.floor(Date.now() / 1000);  
            if(currentTime > exp){
                res.status(400).json({error : "Token is expired"});
            }
        } 

        const data = jwt.verify(token, process.env.JWT_KEY);
        const id = data.id;
        const user = await User.findById(id);

        res.status(200).json(user);
    }
    catch(error){
        console.log(error);
        res.status(500).json("Internal server error");
    }
}