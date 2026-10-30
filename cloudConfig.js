const cloudinary = require('cloudinary').v2
const { request } = require('express');
const {CloudinaryStorage} = require('multer-storage-cloudinary');


cloudinary.config( {
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
});


const storage = new CloudinaryStorage ({
    cloudinary :  cloudinary,
    params :{
        folder:'wanderlust',
        // allowerdFormats : async(req, file) =>png //Support promise as well
        // public_id:(req, file) => 'computed-filename-using-request',
        allowerdFormats : ['png', 'jpg', 'jpeg']
        }
    })

module.exports = {
    cloudinary,
    storage
};