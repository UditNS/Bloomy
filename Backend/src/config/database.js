// to connect the app to the database we need to add mongoose

// why mongoose -> Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provide schema defination, model validation, middleware support

// what is schema -> structure in which data will be stored/ identity for that collection object

// correct way to connect to db is first connect to the databse then listen to the server

const mongoose = require('mongoose')

const connectDB = async()=> {
    await mongoose.connect('mongodb+srv://uditn007:oPPKRVthg5HBn5P8@uditscluster.dskk5dk.mongodb.net/Bloomy')
}

module.exports = connectDB