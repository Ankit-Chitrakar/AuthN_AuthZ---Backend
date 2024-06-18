const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// controller for signup
exports.signUp = async (req, res) =>{
    try{
        // firts get the data from reqest ka body
        const {name, email, password, role} = req.body;

        // check all require field are field or not 
        if(!name || !email || !password || !role){
            return res.status(401).json({
                success: false,
                message: 'fill the required fields firts',
            });
        }

         // validate email format
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(email)) {
             return res.status(400).json({
                 success: false,
                 message: 'Invalid email format.',
             });
         }

        // check the email already exist or not in the DB 
        const checkEmail_in_DB = await User.findOne({email});
        if(checkEmail_in_DB){
            return res.status(400).json({
                success: false,
                message: 'Email already exist please login',
            });
        }
        // email is not pesent in the DB ready to insert 
        // Fisrt encrypt the passwrd
         
        const hashPassword = await bcrypt.hash(password, 10);
        if(!hashPassword){
            return res.status(500).json({
                success: false,
                message: 'Error in encrypting the password',
            });
        }

        // All set for DB entry
        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            role,
        });

        res.status(200).json({
            success: true,
            userData: newUser,
            message: 'Successfully signup',
        });
        
    }catch(err){
        res.status(501).json({
            success: false,
            error: err.message,
            message: 'Internal Server Issue',
        });
    }
}