const mongoose = require('mongoose');
require('dotenv').config();


const connectDB = ()=>{
    mongoose.connect(process.env.DATABASE_URL).then(()=>{
        console.log("Connected to DB Successfully");
    }).catch((err) =>{
        console.error(err);
        console.log("Issue in Connecting DB");
        process.exit(1);
    })
}

module.exports = connectDB;