const express = require('express');
const { signUp } = require('../controllers/signUp');
const { login } = require('../controllers/login');
const {authMiddleware, isStudent, isAdmin} = require('../middleware/authMiddleware');
const router = express.Router();
const User = require('../models/userModel');

// Route for signup
router.post('/new/signup', signUp);

// Route for login
router.post('/login', login);


// Authorize Path
// Protected Route
// use Midleware

// Protected route for only Logged in users
router.get("/auth/test", authMiddleware, (req,res) =>{
    res.status(200).json({
        success:true,
        message:'Yes!! you are recognized as a Authenticated member',
    });
});

// Protected route for only Logged in students
router.get('/student', authMiddleware, isStudent, (req, res)=>{
    res.status(200).json({
        success: true, 
        message: "Welcome to the protected route for student",
    });
})

// Protected route for only Logged in admin
router.get('/admin', authMiddleware, isStudent, isAdmin, (req, res)=>{
    res.status(200).json({
        success: true, 
        message: "Welcome to the protected route for Admin",
    });
})

// if i want to get the authorized user details by id in payload
router.get('/user/details', authMiddleware, async (req, res)=>{
    try{
        const id = req.user.id;
        console.log("id: ", id)
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'Id nehi mila',
            });
        }
        user.password = undefined;
        res.status(200).json({
            success: true,
            userData: user,
            message: 'User mil gaya',
        });
    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message,
            message: "Error while fetching the Id",
        });
    }
})

module.exports = router;