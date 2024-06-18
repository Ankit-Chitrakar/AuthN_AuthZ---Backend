const express = require('express');
const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 5000;

// middleware to parse JSON REquset Body
app.use(express.json());

// cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// start the server
app.listen(PORT, ()=>{
    console.log(`Server started successfully at PORT: ${PORT}`);
})

// base route
app.get('/', (req, res) =>{
    res.send(`Welcome to Base Route of AUTH Chapter`);
})

// mount 
const handleAllRoutes = require('./routes/handleAllRoutes');
app.use('/api/v1/', handleAllRoutes);

// db connect 
const connectDB = require('./config/database');

connectDB();