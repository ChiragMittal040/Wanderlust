const express = require ('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema, reviewSchema} = require('../schema.js')
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const {isLoggedIn, isOwner,validateListing} = require ('../middelware.js');
const reviews = require('../models/reviews.js');
const listingController = require('../controllers/listing.js');
const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage })

router.route('/')
// Index Routes
.get(wrapAsync(listingController.index))
// Create Route
.post(isLoggedIn,
  validateListing,
  upload.single('listing[image]'),
  wrapAsync(listingController.createListing    
  ))

// New Routes
router.get('/create', isLoggedIn ,listingController.renderNewForm)

// Category Filter Route
router.get('/category/:category', wrapAsync(listingController.filterByCategory));

router.route('/:id')
// Show Routes
.get(wrapAsync (listingController.showListing))
// Update Route
.patch(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
// Delete Route
.delete(isOwner,wrapAsync(listingController.destroyed))



// Edit Route
router.get('/:id/edit',
  isLoggedIn,
  isOwner,
  wrapAsync( listingController.renderEditForm

  ))

module.exports = router;