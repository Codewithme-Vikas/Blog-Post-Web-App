const mongoose = require('mongoose')
const User = require("./User")

const postSchema = new mongoose.Schema({
    title : { type : String , required: true },
    summary : { type : String , required: true },
    thumbnail : { type : String , required: true },
    content : { type : String , required: true },
    upvote : [ { type: mongoose.Schema.Types.ObjectId , ref : 'user' }],
    author : { type : mongoose.Schema.Types.ObjectId , ref : 'User' , required: true }
},{
    timestamps : true,
})

const Post = mongoose.model('Post',postSchema);

module.exports = Post;