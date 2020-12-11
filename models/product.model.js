const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    brand: {type: String, required: true},
    description: {type: String, maxLength: 280, required: true},
    price: {type: Number},
    listPrice: {type: Number},
    shippingCost: {type: Number},
    condition: String,
    category: String,
    size: String,
    color: String,
    material: String,
    pattern: String,
    image: {type: String, default:""},
    gender: String,
    shop: {type: Schema.Types.ObjectId, ref:"Shop"},
    user: {type: Schema.Types.ObjectId, ref:"User"}
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
  });


const Product = mongoose.model('Product', productSchema);

module.exports = Product;