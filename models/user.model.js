const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  email: String,
  password:{type: String, required:true},
  firstName: {type: String},
  lastName: {type: String}, 
  image: {type: String, default:""},
  bio: {type: String, maxLength: 280},
  birthday: {type: Date},
  gender: {type:String, enum: ["women", "men"]},
  shippingAddress: [{type: Schema.Types.ObjectId, ref:"Address"}], 
  favoriteProducts: [{type: Schema.Types.ObjectId, ref:"Product"}],
  reviews: [{type: Schema.Types.ObjectId, ref:"Review"}],
  orders:  [{type: Schema.Types.ObjectId, ref:"Order"}],
  shopOwner: {type: Boolean, default: false},
  shop:{type: Schema.Types.ObjectId, ref:"Shop"},
  newsletter: {type:Boolean}, 
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
});


const User = mongoose.model('User', userSchema);

module.exports = User;