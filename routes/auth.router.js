const express = require("express");
const router = express.Router();
const createError = require("http-errors"); // creates an error object
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/user.model");
const mongoose = require('mongoose');


// HELPER FUNCTIONS
// MIDDLEWARE FUNCTIONS TO VALIDATE
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLogin,
  validationSignup
} = require("../helpers/middlewares");

// POST '/auth/signup'
router.post('/signup', isNotLoggedIn, validationSignup, (req, res, next) => {
  const { username, password, email } = req.body;
  User.findOne({ username })
    .then( (foundUser) => {

      if (foundUser) {
        // If username is already taken, then return error response
        return next( createError(400) ); // Bad Request
      }
      else {
        // If username is available, go and create a new user
        const salt = bcrypt.genSaltSync(saltRounds);
        const encryptedPassword = bcrypt.hashSync(password, salt);

        User.create( { username, password: encryptedPassword, email })
          .then( (createdUser) => {
            console.log('createdUser', createdUser)
            // set the `req.session.currentUser` using newly created user object, to trigger creation of the session and cookie
            createdUser.password = "*";
            req.session.currentUser = createdUser; // automatically logs in the user by setting the session/cookie
            console.log('req.session.currentUser', req.session.currentUser)

            res
              .status(201) // Created
              .json(createdUser); // res.send()

          })
          .catch( (err) => {
            next( createError(err) );  //  new Error( { message: err, statusCode: 500 } ) // Internal Server Error
          });
      }
    })
    .catch( (err) => {
      next( createError(err) );
    });


})
// POST '/auth/login'
router.post('/login', isNotLoggedIn, validationLogin, (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then( (user) => {
      if (! user) {
        // If user with that username can't be found, respond with an error
        return next( createError(404)  );  // Not Found
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password); //  true/false

      if (passwordIsValid) {
        // set the `req.session.currentUser`, to trigger creation of the session
        user.password = "*";
        req.session.currentUser = user;
        res
          .status(200)
          .json(user);

      }
      else {
        next( createError(401) ); // Unauthorized
      }

    })
    .catch( (err) => {
      next( createError(err)  );
    });
})
// GET '/auth/logout'
router.get('/logout',  isLoggedIn, (req, res, next) => {
  req.session.destroy( function(err){
    if (err) {
      return next(err);
    }

    res
      .status(204)  //  No Content
      .send();
  } )
})
// GET '/auth/me' --> if user is logged in or not
router.get('/me', isLoggedIn, (req, res, next) => {
  const currentUserSessionData = req.session.currentUser;
  res
    .status(200)
    .json(currentUserSessionData);

})

// GET 'auth/user' update user information
router.get('/user', isLoggedIn, (req,res,next) => {
  const userId = req.session.currentUser._id
  console.log('userId', userId)
  if(!mongoose.Types.ObjectId.isValid(userId)){
    res
    .status(400)
    .json({message: "specified id is not valid"})
    return
  }
  User.findById( userId )
  .then((foundUser) =>{
    res
    .status(200)
    .json(foundUser)
  })
  .catch((err) =>{
    next( createError(err)  );
  })
})

router.put('/user/:id', (req,res,next) =>{
  const {id} = req.params;
  const { username,
          email,
          firstName,
          lastName, 
          image,
          bio} = req.body

  if(!mongoose.Types.ObjectId.isValid(id)){
    res
    .status(400)
    .json({message: "specified id is not valid"})
    return
  }

  User.findByIdAndUpdate(id, { username, 
                               email,
                               firstName,
                               lastName, 
                               image,
                               bio}, {new: true} )
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


module.exports = router;
