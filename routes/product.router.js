const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();
const Product = require("../models/product.model");
const Shop = require("../models/shop.model");

// Route for the products data

// GET /api/products
router.get('/products', (req, res, next) =>{
    Product
      .find()
      .then( (allTheProducts) => {
        res.status(200).json(allTheProducts);
      })
      .catch(err => {
        res.status(500).json(err);
      })

})

// POST /api/products
router.post('/products', (req, res, next) => {
  //const shopId = req.session.currentUser.shop; 
  //console.log('req.session.currentUser', req.session.currentUser)
  //console.log('shopId', shopId)
  //const userId = req.session.currentUser._id; 
  //console.log('userId', userId)

    const { brand, 
            description, 
            price, 
            listPrice, 
            shippingCost, 
            condition, 
            size, 
            color, 
            material, 
            pattern, 
            image, 
            gender,
            shopId,
            userId
          } = req.body;
  
    Product.create({ ...req.body,
                     shop: shopId,
                     user: userId
                    })
      .then((createdProduct)=> {
        console.log('createdProduct', createdProduct)
        Shop.findByIdAndUpdate(
        shopId, 
        {$push: {products: createdProduct._id}}, {new:true})
        .then((response)=>{
          res
          .status(201)
          .json(response);
        })
        .catch((err) =>{
          res.status(500).json(err);
        })
      })
      .catch((err)=> {
        res
          .status(500)  // Internal Server Error
          .json(err)
      })
  })

// GET /api/products/:id - to get a specific product
router.get('/products/:id', (req,res,next) =>{
 const {id} = req.params; 
 if (!mongoose.Types.ObjectId.isValid(id)) {
   res
   .status(400)
   .json({message: "the specified id is not valid"})
   return;
 }

 Product
 .findById (id)
 .then((foundProduct) => {
   res.status(200).json(foundProduct);
 })
 .catch((err) => {
   res
   .status(500)
   .json(err)
 })
})

// PUT /api/products/:id - to change a specific product
router.put('/products/:id', (req,res,next) =>{
  const {id} = req.params;
  const { brand, 
          description, 
          price, 
          listPrice, 
          shippingCost, 
          condition, 
          size, 
          color, 
          material, 
          pattern, 
          image, 
          gender} = req.body

  if(!mongoose.Types.ObjectId.isValid(id)){
    res
    .status(400)
    .json({message: "specified id is not valid"})
    return
  }

  Product.findByIdAndUpdate(id, { brand, 
                                  description, 
                                  price, 
                                  listPrice, 
                                  shippingCost, 
                                  condition, 
                                  size, 
                                  color, 
                                  material, 
                                  pattern, 
                                  image, 
                                  gender}, {new: true} )
  .then(() =>{
    res
    .status(200)
    .send();
  })
  .catch((err) => {
    res
    .status(500)
    .json(err)
  })
})

// DELETE /api/products/:id - to delte a specific product
router.delete('/products/:id', (req,res,next) =>{
  const {id} = req.params; 

  if ( !mongoose.Types.ObjectId.isValid(id)){
    res
    .status(400)
    .json({message: "specified id does not exits"})
    return
  }

  Product.findByIdAndRemove(id)
  .then((removedProduct)=>{
    res
    .status(202)
    .send(`Product ${removedProduct.brand} was removed`)
  })
  .catch((err) => {
    res
    .status(500)
    .json(err)
  })
})

module.exports = router; 