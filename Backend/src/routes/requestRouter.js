const express = require("express")
const {userAuth} = require("../middlewares/auth");
const Connection  = require("../models/connection");
const User = require("../models/user");
const mongoose = require('mongoose')
const requestRouter = express.Router()

// how we will handle the connection request
// Should we put it in db -> No, keep it away from the db. We don't want it mess up with user collection
// We will create a new collection for it

requestRouter.post('/send/:status/:toUserId', userAuth, async (req, res) => {
  try {
    const allowedStatus = ["likes", "pass"];
    const fromUserId = req.user._id;
    const { toUserId, status } = req.params;

    // Validate status
    if (!allowedStatus.includes(status)) {
      return res.status(400).send({ message: `Invalid status type: ${status}` });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).send({ message: "Invalid user ID format" });
    }

    // Check if trying to send request to self
    if (fromUserId.toString() === toUserId) {
      return res.status(400).send({ message: "Cannot send request to yourself" });
    }

    // Check if toUser exists (more efficient)
    const toUserExists = await User.exists({ _id: toUserId });
    if (!toUserExists) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check for existing connection (with proper error messages)
    const existingConnection = await Connection.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (existingConnection) {
      // Provide specific feedback based on the existing connection
      if (existingConnection.fromUserId.toString() === fromUserId.toString()) {
        return res.status(400).send({ message: "You already sent a request to this user" });
      } else {
        return res.status(400).send({ message: "This user already sent you a request. Please respond to it first" });
      }
    }

    // Create connection
    const connection = new Connection({
      fromUserId,
      toUserId,
      status
    });

    const data = await connection.save();
    
    // Get user details after successful save (optional optimization)
    const toUser = await User.findById(toUserId, 'firstName');
    
    res.json({
      message: `${req.user.firstName}, you ${status} ${toUser.firstName}`,
      data,
    });

  } catch (error) {
    console.error('Connection request error:', error);
    res.status(500).send({ message: "Something went wrong: " + error.message });
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

// remove a connection request
requestRouter.delete('/remove/:removeId', userAuth, async (req,res) => {
  try{
    const logUserId = req.user._id;
    const removeUserId = req.params.removeId

    const deleteConnection = await Connection.findOneAndDelete({
      $or: [
        { fromUserId: logUserId, toUserId: removeUserId },
        { fromUserId: removeUserId, toUserId: logUserId }
      ]
    });
    if (!deleteConnection) {
      return res.status(404).send("No connection found to delete");
    }

    res.send("Connection deleted successfully");
  }
  catch(error){
    res.status(500).send("error while deleting connection")
  }
})


module.exports = requestRouter;