import Razorpay from 'razorpay';
import crypto from 'crypto';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const key_secret = process.env.NEXT_PUBLIC_RAZOR_PAY_SECRET;

        const generated_signature = crypto.createHmac('sha256', key_secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            res.status(200).json({ status: 'success', message: 'Payment signature verified successfully' });
        } else {
            res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }
    } catch (error) {
        console.error("Error verifying payment signature:", error);
        res.status(500).json("Internal server error");
    }
}
