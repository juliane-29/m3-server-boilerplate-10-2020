const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();

const uploader = require("./../config/cloudinary-setup");

const Shop = require("../models/shop.model");
const User = require("../models/user.model");

//Cloudinary File Upload
router.post("/upload", uploader.single("image"), (req, res, next) => {
    console.log("file is: ", req.file);
  
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }
    // get secure_url from the file object and save it in the
    // variable 'secure_url', but this can be any name, just make sure you remember to use the same in frontend
    res.json({ secure_url: req.file.secure_url });
  });

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
  .populate('owner')
  .then((foundShop) => {
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
    console.log('removedShop.owner', removedShop.owner)
    
    User.findByIdAndUpdate(owner, 
    {shop: "", shopOwner: false}, {new:true})
    .then((updatedUser) =>{

          req.session.currentUser = updatedUser;
          console.log('updatedUser', updatedUser)

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
    .catch((err) => {
      res
      .status(500)
      .json(err)
    })
})

module.exports = router;
