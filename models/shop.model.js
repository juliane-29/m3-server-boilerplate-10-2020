const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema({
    shopName: {type: String, unique: true},
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    phoneNumber: {type: String},
    description: {type: String, maxLength: 280}, 
    instagramAccount: {type: String},
    facebookAccount: {type: String},
    typeOfShop: String,
    address: {type:String},
    zipCode:{type:String},
    city:{type:String},
    country: {type: String},
    backgrdoundImage: {type: String, default: ""},
    worldwideShipping: {type: Boolean, default: true},   
    logo: {type: String, default: "https://res.cloudinary.com/daj2fsogl/image/upload/v1607856328/shop_name_gz7tyw.png"},
    reviews: [{type: Schema.Types.ObjectId, ref: "Review"}],
    owner:  {type: Schema.Types.ObjectId, ref:"User"},
    products: [{type: Schema.Types.ObjectId, ref:"Product"}]
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
  });


const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;