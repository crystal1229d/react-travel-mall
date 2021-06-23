const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
   writer: {
       type: Schema.Types.ObjectId,
       ref: 'User'
   },
   title: {
       type: String,
       maxlength: 50
   },
   description: {
       type: String
   },
   price: {
       type: Number,
       default: 0
   },
   images: {
       type: Array,
       default: []
   },
   sold: {
       type: Number,
       maxlength: 100,
       default:0
   },
   continents: {
       type: Number,
       default: 1
   },
   views: {
       type: Number,
       default: 0
   }
}, { timestamp: true })

// mongo db - control search results with weights
ProductSchema.index({
    title: 'text',
    description: 'text'
}, {
    weights: {
        title: 5,
        description: 1
    }
})

const Product = mongoose.model('Product', ProductSchema);

module.exports = { Product }