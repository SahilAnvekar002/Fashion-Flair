const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    orderId : {
        type : String,
        required : true
    },
    paymentDetails : {
        type: Object,
        required : true
    },
    products : {
        type: Object,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        default : 'Pending'
    },
    deliveryStatus : {
        type : String,
        default : 'Order processing'
    },
    phone : {
        type : String,
        required : true
    },
    pincode : {
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },

}, {timestamps: true});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);