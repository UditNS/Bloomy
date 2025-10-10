const express = require("express")
const {userAuth} = require("../middlewares/auth");
const Connection  = require("../models/connection");
const User = require("../models/user");

const requestRouter = express.Router()

// how we will handle the connection request
// Should we put it in db -> No, keep it away from the db. We don't want it mess up with user collection
// We will create a new collection for it

requestRouter.post('/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        // if i pass in accepted as status -> this mean that toUser accepted the request but it isn't the case.
        // we need to add more strict checks
        const allowedStatus = ["likes", "pass"]

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // status should be like/ pass
        if(!allowedStatus.includes(status)){
            throw new Error(`Invalid status type : ${status}`)
        }
        // checking the toUserId should present in db
        const checkToUser = await User.findById(toUserId);// this is an expensive operation. 
        if(!checkToUser){
            return res.status(400).send({message : "User not exist to which you are trying to send the connection request"})
        }

        // checking for if there is an existing connection  
        // a->b already -> show requested
        // b->a already present -> acccept/ reject

        const alreadyPresent = await Connection.findOne({
            $or:[ // this is "OR" in mongodb
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        })

        // also checking a->a. User can't send the request to itself -> schema level using pre

        if(alreadyPresent){
            return res.status(400).send({message : "request already send/ please accept or reject the request"})
        }
        
        const connection = new Connection({
            fromUserId,
            toUserId,
            status
        });
        
        const data = await connection.save();
        
        res.json({
            message: req.user.firstName + ' you ' + status + " " + checkToUser.firstName,
            data,
        });

    } catch(error) {
        res.status(400).send("Something went wrong: " + error.message);
    }
});

requestRouter.post('/recieve/:status/:requestId', userAuth, async (req, res) => {
    try{
        const logUser = req.user;
        const status = req.params.status;
        const requestId = req.params.requestId;

        // status check
        const allowedStatus = ["accepted", "rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "Status is not allowed"
            })
        }

        // finding the request onto the db
        const requests = await Connection.findOne({
            _id : requestId,
            toUserId : logUser._id,
            status : 'likes'
        });

        if(!requests){
            return res.status(404).json({message: "Request Not found"})
        }

        requests.status = status; //from params

        const data = await requests.save();

        res.json({message : "connection request is " + status});

        // we only list the request which has status as like. We don't show if it is pass.
        // other case can be the request id is invalid

    }catch(error){
        res.status(400).send("Something went wrong : " + error.message)
    }
    

})


module.exports = requestRouter;