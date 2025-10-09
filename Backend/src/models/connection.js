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
            values: ["like", "pass", "accepted", "rejected"],
            // ignored -> pass & intrested -> like
            message: `value is incorrect status type`
        }
    }
}, {
    timestamps : true,
}
)

const ConnectionModel = new mongoose.model("Connection", connectionSchema)

module.exports = ConnectionModel;