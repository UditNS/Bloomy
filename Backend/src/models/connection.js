const mongoose = require('mongoose')

const connectionSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId, // we are storing the _id
        required: true,
        ref: "User", // creating a reference(link) between connection and user collection
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId, // we are storing the _id
        required: true,
        ref: "User"
    },
    status:{
        type: String,
        required: true,
        // you create a enum when you want to restrict the user to some values
        enum: {
            values: ["likes", "pass", "accepted", "rejected"],
            // ignored -> pass & intrested -> like
            message: `value is incorrect status type`
        }
    }
}, {
    timestamps : true,
}
) 
// Adding indexing to reduce .find operation
connectionSchema.index({fromUserId:1, toUserId: 1}) // 1->ascending, -1-> descending

// called when ever a new request created
// this function is kind of a middleware -> calling next()
connectionSchema.pre("save", function(next) {
    const connectionRequest = this
    // now checking when the sender and reciever are the same
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send the connection request to yourself")
    }
    next()
})

const ConnectionModel = new mongoose.model("Connection", connectionSchema)

module.exports = ConnectionModel;