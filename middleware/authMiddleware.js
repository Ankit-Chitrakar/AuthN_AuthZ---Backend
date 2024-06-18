const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authMiddleware = async (req, res, next)=>{
    try{
        // get data from req.body

        // there are 3 upay 
        // 1. req.body.user    // less secure
        // 2. req.cookies.token  // mid secure
        // 3. req.header("Authorization").replace("Bearer ", "")  // high secure

        console.log("Body: ", req.body.token)  // 1. 
        console.log("Cookie: ", req.cookies.authCookie);  // 2. 
        console.log("Header: ", req.header("Authorization")); // 3. 


        const token = req.body.token || req.cookies.authCookie || req.header("Authorization").replace("Bearer ", "");



        // check the token are null or not
        if(!token || token === undefined){
            return res.status(400).json({
                success: false,
                message: 'Token is not verified',
            });
        }

        // verify the token 
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = payload;
        }catch(err){
            res.status(400).json({
                success: false,
                message: 'Token was not a verified token'
            })
        }
        next();

    }catch(err){
        res.status(501).json({
            success: false,
            error: err.message,
            message: 'Something went wrong, while verifying the token',
        });
    }
}

exports.isStudent = async (req, res, next) =>{
    try{
        if(req.user.role !== "Student"){
            return res.status(403).json({
                success: false,
                message: "You are not an authorized member for this route",
            });
        }
        next();
    }catch(err){
        res.status(501).json({
            success: false,
            error: err.message,
            message: 'This is Student portal',
        });
    }
}

exports.isAdmin = async (req, res) =>{
    try{
        if(req.user.role !== "Admin"){
            return res.status(403).json({
                success: false,
                message: "You are not an authorized member for this route",
            });
        }
    }catch(err){
        res.status(501).json({
            success: false,
            error: err.message,
            message: 'This is Admin portal',
        });
    }
}