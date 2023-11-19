const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username : { type : String , unique : true , required : true },
    email : { type : String, },
    avatar : { type : String , default : 'avatar.jpg' },
    password : { type : String , required : true },
    bio : { type : String },
    company : { type : String },
    job : { type : String },
    twitter : { type : String },
    github  : { type : String },
    linkedin : { type : String },
    portfolio : { type : String },
},{
    timestamps : true,
});


const User = mongoose.model('User', userSchema);

module.exports = User;