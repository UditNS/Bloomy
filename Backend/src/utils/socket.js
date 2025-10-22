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
        socket.on('joinChat', () => {

        })

        socket.on('sendMessage', () => {

        })

        socket.on('disconnect', () => {
            
        })
    })
}

module.exports = initializeSocket