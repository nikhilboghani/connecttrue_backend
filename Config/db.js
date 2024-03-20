const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ChatApp');

        console.log('Connected to the database');
    }
    catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}

module.exports = connectDB;