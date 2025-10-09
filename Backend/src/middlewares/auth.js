// middleware is nothing just a function which contains route handler
const jwt = require('jsonwebtoken')
const User = require('../models/user')

/**
 * USER AUTHENTICATION MIDDLEWARE
 * 
 * Purpose: This middleware protects routes by verifying that incoming requests 
 * have a valid JWT token and an existing user account.
 * 
 * How it works:
 * 1. Extracts JWT token from cookies
 * 2. Verifies token is valid and not expired
 * 3. Finds the user in database using ID from token
 * 4. Attaches user object to request for use in subsequent route handlers
 * 
 * Usage: Add this middleware to any route that requires authentication
 * Example: router.get('/profile', userAuth, getProfile)
 */

const userAuth = async (req, res, next) => {
    try {
        // STEP 1: Extract token from cookies
        // Gets the 'token' property from request cookies
        // Cookies were set during login (typically with res.cookie('token', jwtToken))
        const cookies = req.cookies
        const {token} = cookies
        
        if(!token){
            throw new Error("token not found")
        }
        
        // STEP 2: Verify token authenticity
        // jwt.verify() checks:
        // - Token signature is valid (wasn't tampered with)
        // - Token hasn't expired
        // - Token was signed with our SECRET_KEY
        // Returns decoded payload (contains user _id)
        const decodedObj = await jwt.verify(token, process.env.SECRET_KEY);
        
        // STEP 3: Find user in database
        // Extract user ID from decoded token payload
        // Query database to ensure user still exists (account not deleted)
        const {_id} = decodedObj
        const user = await User.findById(_id)
        
        if(!user) {
            throw new Error("user not found");
        }
        
        // STEP 4: Attach user to request object
        // Makes authenticated user data available to next middleware/route handler
        // Now you can access req.user in your protected routes
        req.user = user;// passing in the user in the request body
        
        // Pass control to next middleware or route handler
        next()
        
    } catch(error) {
        // Catches errors like:
        // - Missing token
        // - Invalid/expired token
        // - User not found in database
        res.send("Error occured : " + error)
    }
}

module.exports = {
    userAuth
}