const express = require("express")
const userRouter = express.Router()
const User = require("../models/user");
const Connection = require("../models/connection")
const { userAuth } = require("../middlewares/auth");
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
        }).populate("fromUserId", "firstName lastName photo age gender skill description") // space seperated

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
        }).populate("toUserId", "firstName lastName photo age gender skill description")
        .populate("fromUserId", "firstName lastName photo age gender skill description")
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

userRouter.get('/feed', userAuth, async(req, res) => {
    // I don't want that the loggedIn user to show his profile

})

module.exports = userRouter;