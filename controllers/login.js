const User = require('../models/userModel');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.login = async (req, res) =>{
    try{
        // get the req.body
        const {email, password} = req.body;
        
        // check values are null or not
        if(!email || !password) {
            return res.status(500).json({
                success: false,
                message: 'Plaese fill all the fields',
            });
        }

        // all fields are filled 
        // now check email is valid email or not 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format.',
            });
        }

        // check this email exist in the DB or not
        let user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // email exists in the DB 
        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        // verify password and generate a Json web token (JWT)
        const verifyPw = await bcrypt.compare(password, user.password);
        if(!verifyPw){
            return res.status(404).json({
                success: false,
                message: 'Incorrect password',
            });
        }

        // Use JWT for Auth

        // all are correct now geberate jwt and passes to the user object 
        const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY);
        
        // insert into payload
        user = user.toObject();
        user.token = token;
        user.password = undefined;

        // res.status(200).json({
        //     success: true,
        //     userData: user,
        //     message: 'User logged in successfully with JWT',
        // });

        // Now use cookies for Auth 
        res.cookie('authCookie', token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true,
        }).status(201).json({
            success: true,
            userData: user,
            message: "User Logged in with cookie"
        })

    }catch(err){
        res.status(501).json({
            success: false,
            error: err.message,
            message: 'Internal Server Issue',
        });
    }
}