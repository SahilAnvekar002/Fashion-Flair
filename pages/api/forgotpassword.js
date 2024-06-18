import connectToMongo from '@/middleware/connectToMongo';
import User from '@/models/User';

const nodemailer = require('nodemailer');

async function handler(req, res) {

    if (req.method !== 'POST') {
        return res.status(400).json("Method not allowed");
    }

    const user = await User.findOne({email : req.body.email});
    if(!user){
        return res.status(400).json({ error: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    function generateEmailHTML(otp) {
        return `
          <div style="font-family: Arial, sans-serif; text-align: center;">
            <h2 style="color: #4CAF50;">Password Reset</h2>
            <p style="font-size: 18px;">Your one-time password (OTP) to reset your password is:</p>
            <h1 style="font-size: 36px; color: #333;">${otp}</h1>
            <p style="font-size: 16px; color: #777;">Please use this code to proceed with resetting your password. The code is valid for 10 minutes.</p>
          </div>
        `;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sahilanvekar6@gmail.com',
            pass: 'pzlnfngpjurkgyvn'
        }
    });

    const mailOptions = {
        from: 'sahilanvekar6@gmail.com',
        to: req.body.email,
        subject: 'Password Reset',
        html: generateEmailHTML(otp)
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(400).json({ error: "Failed to send email" + error });
        } else {
            return res.status(200).json({ success: "Email has been sent successfully ", info: info.response, otp: otp });
        }
    });
}

export default connectToMongo(handler)