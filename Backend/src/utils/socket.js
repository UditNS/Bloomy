const socket = require('socket.io')

const initializeSocket = (server) => {
    // this is required to resolve the cors issue while communicating using web sockets
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        }
    })

    // to recieve connection
    io.on("connection", (socket) => {
        //handle events
        socket.on('joinChat', ({userId, targetUserId}) => {
            const roomId = [userId, targetUserId].sort().join("_");// the roomId must be same between the two user who are chatting thats why we do sort 
            socket.join(roomId)
        })

        socket.on('sendMessage', (newMessage) => {
            const roomId = [newMessage.userId, newMessage.targetId].sort().join("_");
            
            io.to(roomId).emit("recieveMessage", {senderUserId: newMessage.userId, targetId: newMessage.targetId, text:newMessage.text, time:newMessage.time});

        })

        socket.on('disconnect', () => {

        })
    })
}

module.exports = initializeSocket