//Setting up the db

const mongoose = require('mongoose');
mongoose.connect('mongodb://KaranjaMutahi:12menofGod@ds135624.mlab.com:35624/karanja-test');

let db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection Error"));
db.once('open', function(){
    console.log("Connection to MongoDB established");
});

let schema = mongoose.Schema;
let userSchema = new schema ({
    chatID: String,
    username : String,
    personalDetails: {
        email : String,
        firstName: String,
        lastName: String        
        },
    verifiedStatus: Boolean    
});

let users = mongoose.model('users', userSchema, 'userData');