const express = require ('express');
const app = express();
const mongoose = require ('mongoose');
const Listing = require ('../models/listing.js');
const initData = require('./data.js');
 
main()
.then((res) =>{
    console.log('connected to DB');    
})
.catch((err) =>{
    console.log(err);    
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner : "6ac23a3e7293cf4d9cfd40d6"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
        
    }
// initDB();
 

 