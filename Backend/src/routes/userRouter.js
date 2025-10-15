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
// A common practice is to define fields to exclude, or an inverse list of fields to include.
// Assuming USER_SECRET is a string like '-password -__v' for excluding fields

userRouter.get('/connections', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // 1. Find all accepted connections involving the logged-in user
        const connections = await Connection.find({
            status: "accepted",
            $or: [
                { toUserId: loggedInUserId },
                { fromUserId: loggedInUserId }
            ]
        })
        .select('toUserId fromUserId') // Only fetch the IDs needed for population
        .populate({
            path: 'toUserId',
            select: USER_SECRET // Use specific projection for the user data
        })
        .populate({
            path: 'fromUserId',
            select: USER_SECRET // Use specific projection for the user data
        })
        .lean(); // Use .lean() for faster execution when data won't be modified

        // 2. Process connections to extract only the partner's details
        const data = connections.map((connection) => {
            // Check which field holds the other user's data
            const otherUser = connection.fromUserId._id.equals(loggedInUserId) 
                ? connection.toUserId 
                : connection.fromUserId;
            
            // Clean up the structure (optional: remove the other user's ID field)
            delete otherUser.password; // Double check if needed, as it should be filtered by select

            return otherUser;
        });

        if (data.length === 0) { // Check the final processed array length
            return res.json({
                message: "No connections",
                data: []
            });
        }

        res.json({
            message: "Connections fetched successfully",
            data
        });
    } catch (error) {
        res.status(500).send("Something went wrong: " + error.message); // Use 500 for server errors
    }
});

// Most important api as firstly we load some profiles to show to the user
// then when user scrolls down we fetch more profiles
// so this api should support pagination
// GET /user/feed?skip=20&limit=20
userRouter.get('/feed', userAuth, async(req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const loggedInUserId = req.user._id;

    // Finding all connections
    const connectionRequest = await Connection.find({
      $or: [
        { fromUserId: loggedInUserId },
        { toUserId: loggedInUserId }
      ]
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    
    // Hide logged-in user's own profile
    hideUserFromFeed.add(loggedInUserId.toString());

    connectionRequest.forEach(request => {
      hideUserFromFeed.add(request.fromUserId.toString());
      hideUserFromFeed.add(request.toUserId.toString());
    });

    const users = await User.find({
      _id: { $nin: Array.from(hideUserFromFeed) }
    })
    .select(USER_SECRET.join(' '))
    .skip(skip)
    .limit(limit);

    res.json({ data: users });
  }
  catch(error) {
    console.error("Feed error:", error);
    res.status(400).send({ message: "Something went wrong: " + error.message });
  }
});

module.exports = userRouter;