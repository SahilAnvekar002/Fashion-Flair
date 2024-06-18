import Razorpay from 'razorpay';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { payment_id } = req.body;

        const instance = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY,
            key_secret: process.env.NEXT_PUBLIC_RAZOR_PAY_SECRET
        });

        const paymentDetails = await instance.payments.fetch(payment_id);
        res.status(200).json(paymentDetails);
    } catch (error) {
        console.error("Error fetching payment details:", error);
        res.status(500).json("Internal server error");
    }
}