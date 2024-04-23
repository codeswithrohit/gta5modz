const https = require('https');
import Order from "../../models/Order1"
import connectDb from "../../middleware/mongoose"



const handler = async (req, res) => {
    let order;
    if (req.method === 'POST') {
        try {
            // Check if the details are valid
            if (req.body.phone.length !== 10 || !Number.isInteger(Number(req.body.phone))) {
                return res.status(200).json({ success: false, error: "Please enter your 10 digit phone number", cartClear: false });
            }

            // Initiate an Order corresponding to this order id
            order = new Order({
                name: req.body.name,
                email: req.body.email,
                orderId: req.body.orderId,
                address: req.body.address,
                phone: req.body.phone,
                amount: req.body.amount,
                products: req.body.products,
            });

            await order.save();

            // Log the order ID
            console.log("Order ID:", order._id);

            // Send a JSON response with the redirect URL
            return res.status(200).json({ success: true, redirectUrl: `/order?clearCart=1&id=${order._id}` });
        } catch (error) {
            console.error('Error submitting order to MongoDB:', error);
            return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
};

export default connectDb(handler);
