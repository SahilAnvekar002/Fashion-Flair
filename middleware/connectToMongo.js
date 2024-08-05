const mongoose  = require("mongoose");

const allowedOrigins = ['https://fashion-flair-chi.vercel.app'];

const connectToMongo = handler => async(req, res)=>{

    // CORS handling
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if(mongoose.connections[0].readyState){
        return handler(req, res);
    }

    await mongoose.connect(process.env.MONGO_URI);
    return handler(req, res);
}

export default connectToMongo;