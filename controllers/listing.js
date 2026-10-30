const { object } = require('joi');
const Listing = require('../models/listing.js');
const reviews = require('../models/reviews.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


// Index
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs', {allListings})
}


//  New Route
    module.exports.renderNewForm =   (req, res) => {        
    const categories = Listing.schema.path('category').enumValues;    
    res.render('listings/create.ejs', {categories});
}


// Show Route
module.exports.showListing = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path : "reviews",
       populate : {
        path : 'author',
       },       
    })
    .populate('owner');

    // ADD THIS CHECK: If the database returns null, flash error and redirect
    if (!listing) {
        req.flash('error', 'The listing you requested does not exist!');
        return res.redirect('/listings'); // The 'return' stops the rest of the code from running
    }
    console.log(req.file);
    
    // console.log (reviews.author);  to now clicky person 
     
    
    res.render('listings/show.ejs', { listing });
})

//  Create Route
module.exports.createListing = (async (req, res, next) =>{

 let response = await geocodingClient.forwardGeocode({
     query: req.body.listing.location,
     limit: 1,
})
  .send();
  console.log(response.body.features[0].geometry)
    console.log(response)
     
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "....", filename);  
    console.log(req.file)

    req.flash('success', 'New Listing Created');
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;  // owner name after login while creating an Listings
    newListing.image ={url, filename};
    newListing.geometry =  response.body.features[0].geometry    
    let savedListing = await newListing.save();
    console.log(newListing.category);
    
    console.log(savedListing);
    
    res.redirect('/listings');               
    })
 
// Edit Route
module.exports.renderEditForm = async(req, res) =>{ 
    let {id} = req.params;
    console.log(req.file);
    const listing = await Listing.findById(id);

       if (!listing) {
        req.flash('error', 'The listing you requested does not exist!');
        return res.redirect('/listings'); // The 'return' stops the rest of the code from running
    }
    
    // &ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=7&blur=100
    // &ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=5
    
    let originalImgeUrl = listing.image.url;
    originalImgeUrl = originalImgeUrl.replace('/upload', '/upload/h_300,w_250');

    const categories = Listing.schema.path('category').enumValues;
    res.render('listings/edit.ejs', { listing, originalImgeUrl, categories });   
}

// Update Route 
module.exports.updateListing = async(req, res) => {
    let {id} = req.params;    
    console.log(req.file);
    const listing = req.body.listing;
    
    const editlisting = await Listing.findByIdAndUpdate(id,listing);
    if(typeof req.file !=="undefined") {
    let url = req.file.path;
    let filename = req.file.filename; 
    editlisting.image = {url, filename};
    await editlisting.save();
  }
    req.flash('success', 'Listing Updated!')
    res.redirect(`/listings/${id}`);  
} 

// Delete Route -
module.exports.destroyed = async(req, res) =>{
    let {id} = req.params;    
    const listing = await Listing.findByIdAndDelete(id)
    req.flash('success', 'Listing Deleted!')
    res.redirect('/listings');
}

// Filter by Category Route
module.exports.filterByCategory = async (req, res) => {
    let { category } = req.params;
       const allListings = await Listing.find({});
       const filteredListings = allListings.filter((listing) => listing.category === category);
    res.render('listings/category.ejs', { filteredListings, category });
};

// app.get('/category/:category',async,wrapAsync(req, res)) =>({

//     let { category } = req.params;
//        const allListings = await Listing.find({});
//        const filteredListings = allListings.filter((listing) => listing.category === category);
//     res.render('listings/category.ejs', { filteredListings, category });
// })

     
     

