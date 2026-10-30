const   mongoose  = require("mongoose");
const Schema = mongoose.Schema;
const defalut_img = "https://www.cntraveller.in/story/8-beautiful-airbnb-villas-near-mumbai-to-book-this-monsoon/";
const Review = require('./reviews.js')

const listingSchema = new Schema ({
    title : {
        type : String,
        required : true,
    },
    description : String,

    image : {
        
        // filename :{
        //     type : String,
        //     default : "listingimages",
        // },

        // url :{
        //     type : String,
        //     default : defalut_img,
        //     set: (v) => v=== "" ? defalut_img : v,
        // },    
        
        filename : {
            type : String
        },
        url :{
            type : String
        },
    },

    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Review',
        },
    ],
    owner : {
        type :Schema.Types.ObjectId,
        ref : 'User',
    },
    geometry : {
      type :{
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },      
     
    coordinates: {
      type: [Number],
      required: true
    },
},
category : {
    type :String,
    enum : ['Trending', 'Room', 'Iconic Cities', 'Mountains', 'Castless', 'Amazing Pool','Champing', 'Farm', 'Arctic','Dome','Boats'],
     
},
});

listingSchema.post ('findOneAndDelete', async(listing) =>{
    if(listing) {
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
});
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;