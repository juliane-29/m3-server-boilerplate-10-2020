const createError = require("http-errors");

// has the user a session - it will call next 
exports.isLoggedIn = (req, res, next) => {
  // Check if user request has a cookie/session.
  if (req.session.currentUser) next();
  else next(createError(401)); 
};


exports.isNotLoggedIn = (req, res, next) => {
  // Check if the user request came without a cookie and isn't logged in
  // if session is not there --> go next 
  if ( ! req.session.currentUser ) next();
  else next( createError(403) );   // new Error({message: '', statusCode: 403})
};

//
exports.validationSignup = (req,res,next) => {
  const { username, password, email } = req.body;
// if you don't provide username, password, email
  if (!username || !password || !email){
    next(createError(400));
  } 
  else next();
};


exports.validationLogin = (req, res, next) => {
  const { username, password } = req.body;
// if you don't provide username or password
  if (!username || !password){
    next(createError(400));
  } 
  else next();
};



// Above exporting is same as what we did before:
// exports = {
//   isLoggedIn,
//   isNotLoggedIn,
//   validationLogin,
// }