const express = require("express")
const {userAuth} = require("../middlewares/auth");
const Connection  = require("../models/connection");

const requestRouter = express.Router()

// how we will handle the connection request
// Should we put it in db -> No, keep it away from the db. We don't want it mess up with user collection
// We will create a new collection for it

requestRouter.post('/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        // if i pass in accepted as status -> this mean that toUser accepted the request but it isn't the case.
        // we need to add more strict checks
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        
        const connection = new Connection({
            fromUserId,
            toUserId,
            status
        });
        
        const data = await connection.save();
        
        res.json({
            message: "Connection request sent successfully",
            data,
        });

    } catch(error) {
        res.status(400).send("Something went wrong: " + error.message);
    }
});


module.exports = requestRouter;