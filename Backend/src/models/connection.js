const mongoose = require('mongoose')

const connectionSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId, // we are storing the _id
        required: true,
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId, // we are storing the _id
        required: true,
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