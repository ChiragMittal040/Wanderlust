    const express = require ('express');
    const wrapAsync = require('../utils/wrapAsync');
    const User = require ('../models/user.js');
const passport = require('passport');
const {saveRedirectUrl} = require ('../middelware.js');
const userController = require ('../controllers/users.js')

    const router = express.Router();


    router.route('/signup')
    // Signup 
    router.get('/signup', userController.renderSignupForm)
    // Signup - Post
    router.post('/signup',wrapAsync(userController.signup));
    
 
    router.route('/login')
     //  login Get
      .get( userController.renderLoginForm)
    // login Post
      .post(saveRedirectUrl,passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login );    
  
    // logout GET 
     router.get('/logout',userController.logout)
         
     
    module.exports = router;