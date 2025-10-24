const socket = require('socket.io')
const Chat = require('../models/chat')
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

        socket.on('sendMessage', async (newMessage) => {
    try{
       
        
        const roomId = [newMessage.userId, newMessage.targetId].sort().join("_");
        
        let chat = await Chat.findOne({
            participants: {$all : [newMessage.userId, newMessage.targetId]}
        })
        
        if(!chat){
            chat = new Chat({
                participants: [newMessage.userId, newMessage.targetId],
                messages: []
            })
        }
        
        chat.messages.push({
            senderId: newMessage.userId,
            text: newMessage.text,
            time: newMessage.time
        })
        
        await chat.save()
        
        
        io.to(roomId).emit("recieveMessage", {
            senderUserId: newMessage.userId, 
            targetId: newMessage.targetId, 
            text: newMessage.text, 
            time: newMessage.time
        });
        
    }catch(error){
        console.error('❌ Error in sendMessage:', error);
    }
})

        socket.on('disconnect', () => {

        })
    })
}

module.exports = initializeSocket