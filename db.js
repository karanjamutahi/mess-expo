//Setting up the db

const mongoose = require('mongoose');
mongoose.connect(process.env.DBURL);

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
