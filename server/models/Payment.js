const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const PaymentSchema = mongoose.Schema({
    user: {
        type: Array,
        default: []
    },
    data: {
        type: Array,
        default: []
    },
    product: {
        type: Array,
        default: []
    }
}, { timestamp: true })

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = { Payment }