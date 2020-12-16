const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();

const uploader = require("./../config/cloudinary-setup");

const Shop = require("../models/shop.model");
const User = require("../models/user.model");
const Product = require('../models/product.model');

//Cloudinary File Upload
router.post("/upload", uploader.single("image"), (req, res, next) => {
    console.log("file is: ", req.file);
  
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    // get secure_url from the file object and save it in the
    // variable 'secure_url', but this can be any name, just make sure you remember to use the same in frontend
    res.json({ secure_url_logo: req.file.secure_url });
  });

// POST /api/shops
router.post('/shops', (req, res, next) =>{
  const { shopName,
          firstName,
          lastName,
          email,
          phoneNumber,
          description,
          instagramAccount,
          facebookAccount,
          typeOfShop,
          address,
          zipCode,
          city,
          country,
          backgroundImage,
          worldwideShipping, 
          image,
          userId
            } = req.body; 
    Shop.create({...req.body,
                owner: userId 
              })
      .then((createdShop)=> {
        User.findByIdAndUpdate(userId, 
        {shop: createdShop._id, shopOwner: true}, {new:true}
        )
        .then((updatedUser) =>{
          req.session.currentUser = updatedUser;
          res
          .status(201)
          .json(updatedUser);
        })
        .catch((err)=> {
          res
            .status(500)  
            .json(err)
      })
      })
      .catch((err)=> {
        res
          .status(500)  
          .json(err)
})
})

// GET /api/shops
router.get('/shops', (req,res,next) =>{

    Shop
    .find()
    .then( (allShops) => {
        res.status(200).json(allShops);
      })
      .catch(err => {
        res.status(500).json(err);
      })
})

// GET api/shops/:id
router.get('/shops/:id', (req,res,next) =>{
  const {id} = req.params; 

  if (!mongoose.Types.ObjectId.isValid(id)){
      res
      .status(400)
      .json({message: "Specific Id is not found"})
  }

  Shop
  .findById(id)
  .populate('owner')
  .then((foundShop) => {
    console.log('foundShop', foundShop)
    console.log('foundShop.products', foundShop.products)
    foundShop.products.map((productObj, index) =>{
       Product.findById(productObj)
       .then((foundProducts) =>{
        console.log('foundProducts', foundProducts)
         // receive products from the shopowner
    })
    })
    res
    .status(200)
    .json(foundShop);
  })
  .catch((err) => {
    res
    .status(500)
    .json(err)
  })

})

// PUT api/shops/:id
router.put('/shops/:id', (req,res,next) => {
    const { id } = req.params;
    const { shopName,
            firstName,
            lastName,
            email,
            phoneNumber,
            description,
            instagramAccount,
            facebookAccount,
            typeOfShop,
            address,
            zipCode,
            city,
            country,
            backgroundImage,
            worldwideShipping, 
            logo 
    } = req.body
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res
      .status(400)
      .json({ message: 'Specified id is not valid' });
      return;
    }
  
    Shop.findByIdAndUpdate(id, { ...req.body }, {new: true})
      .then((changedShop) => {
        res
        .status(200)
        .send(changedShop);
      })
      .catch(err => {
        res
        .status(500)
        .json(err);
      })
})

// DELETE api/shops/:id
router.delete('/shops/:id', (req,res,next) =>{
    const {id} = req.params; 

    if ( !mongoose.Types.ObjectId.isValid(id)){
      res
      .status(400)
      .json({message: "specified id does not exits"})
      return
    }

    Shop.findByIdAndRemove(id)
    .then((removedShop)=>{
    const userId = removedShop.owner
    User.findByIdAndUpdate(userId, {$set: {shop: null, shopOwner:false}}
    , {new:true})
    .then((updatedUser) =>{
      updatedUser.shopOwner = false; 
      updatedUser.shop = null; 
      req.session.currentUser = updatedUser
    })
    .then((x) => {
    Product.deleteMany({shop: id }, {new:true})
    .then((productsremove) => {
      res
      .status(201)
      .json(productsremove)
    })
    })
    .catch((err)=> {
        res
          .status(500)  
          .json(err)
    })
    })
    .catch((err) => {
      res
      .status(500)
      .json(err)
    })
})

module.exports = router;

