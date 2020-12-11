const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();
const Shop = require("../models/shop.model");
const User = require("../models/user.model");

// POST /api/shops
router.post('/shops', (req, res, next) =>{
  //const userId = req.session.currentUser._id; 
  //console.log('req.session.currentUser', req.session.currentUser)
  //  req.session.currentUser.shopOwner / 
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
          logo,
          userId
            } = req.body; 

    console.log('req.body', req.body)
    console.log('userId', userId)

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
  .then((foundShop) => {
    res.status(200).json(foundShop);
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
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
  
    Shop.findByIdAndUpdate(id, { shopName,
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
                                  logo }, {new: true})
      .then(() => {
        res
        .status(200)
        .send();
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
      res
      .status(202)
      .send(`Shop ${removedShop.shopName} was removed`)
    })
    .catch((err) => {
      res
      .status(500)
      .json(err)
    })
})

module.exports = router; 
