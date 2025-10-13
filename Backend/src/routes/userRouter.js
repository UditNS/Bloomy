const express = require("express")
const userRouter = express.Router()
const User = require("../models/user");
const Connection = require("../models/connection")
const { userAuth } = require("../middlewares/auth");

const USER_SECRET = ["firstName", "lastName", "age", "gender", "photo", "skill", "description"]
// Tasks
// GET /user/feed -> fetches 20-30 profiles at a time(again fetch more profile)
// GET /user/Connections
// GET /user/Requests
// GET /sent -> fetched all the request that you sent

// get the request that the user recieved
userRouter.get('/requests', userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
    
        const requests = await Connection.find({
            toUserId : loggedInUser._id,
            status : "likes"
        // }).populate("fromUserId", ["firstName", "lastName", "photo"])
        // }).populate("fromUserId", "firstName lastName photo age gender skill description") // space seperated
        }).populate("fromUserId", USER_SECRET)

        // I got the requests details now i want to fetch the details of request sender.
        // I can iterate over the requests.fromUserId and find these fromUserId from the db. -> thats a poor way of handling this.

        //Better way -> building relation b/w two tables/ schema -> ref


        res.json({
            message: "Request fetched successfully",
            data : requests
        })

    
    }
    catch(error){
        res.status(400).send("Something went wrong " + error.message)
    }
})

// getting the connections of a user
userRouter.get('/connections', userAuth, async (req, res) => {
    try{
        const loggedInUserId = req.user._id;

        const connections = await Connection.find({
            $or : [
                {toUserId : loggedInUserId, status: "accepted"},
                {fromUserId : loggedInUserId, status: "accepted"}
            ]   
        }).populate("toUserId", USER_SECRET)
        .populate("fromUserId", USER_SECRET)
        // the connections is giving too much data -> i want to filter it
        // i want to show only the other user details -> if loggedIn user is the sender then show the reciever details vice versa
        
        // if no connections    
        const data = connections.map((connection) =>{
            if(connection.fromUserId._id.equals(loggedInUserId)){
                return connection.toUserId
            }
            return connection.fromUserId
        })

        if(!connections) {
            res.json({
                message : "No connections"
            })
        }
        res.json({
            message: "connections fetched successfully",
            data
        })
    }
    catch(error){
        res.status(400).send("Something went wrong " + error.message)
    }
}) 

// Most important api as firstly we load some profiles to show to the user
// then when user scrolls down we fetch more profiles
// so this api should support pagination
// GET /user/feed?skip=20&limit=20
userRouter.get('/feed', userAuth, async(req, res) => {
    // I don't want that the loggedIn user to show his profile
    // I don't want to show the loggedIn user to show the profiles in which he marked the status as 'rejected' or 'like' or 'accepted'
    try{   
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit; // formula for skip
        limit = limit>50 ? 50 : limit

        const logUser = req.user;
        // finding all connections
        const connectionRequest = await Connection.find({
            $or : [
                {fromUserId : logUser._id},
                {toUserId : logUser._id}
            ]
        }).select("fromUserId toUserId")// this method only selects the fields from the data which i passed in. Space seperated input

        // this also handled the loggedIn user profile
        const hideUserFromFeed = new Set() // only contain unique entries
        connectionRequest.forEach(request => {
            hideUserFromFeed.add(request.fromUserId.toString())
            hideUserFromFeed.add(request.toUserId.toString())
        })  
        // the below code is hiding the id which is present in the hideUserFromFeed 
        const users = await User.find({
            _id : {$nin : Array.from(hideUserFromFeed)} // converting set into array
            // nin -> not in
        }).select(USER_SECRET).skip(skip).limit(limit)

        res.send(users);
    }
    catch(error) {
        res.status(400).send("Something went wrong " + error.message)
    }
})

module.exports = userRouter;