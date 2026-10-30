const express = require ('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema, reviewSchema} = require('../schema.js')
 const Review = require ('../models/reviews.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middelware.js');
const reviewController = require ('../controllers/reviews.js');
    
    //Review 
    //Post
    router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

    //Delete Review Route
    //Remove the ID from the listing, then delete the review.
    router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyedReview));

module.exports = router;