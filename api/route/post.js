const express = require('express')
const multer = require('multer')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const path = require('path')

const Post = require('../models/Post')
const Comment = require('../models/Comment')

const router = express.Router()

// multer setting for loactions of the file
const postStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/data/post'))
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploadPost = multer({ storage: postStorage })


// API - /post/

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate({ path: 'author', select: 'username avatar' })
            .sort('-createdAt')
            .limit(20)

        res.status(200).json(posts)

    } catch (error) {
        console.log(error, 'fecth all posts from database')
        res.json({ error: "couldn't fecth posts" })
    }
})

router.post("/", uploadPost.single('thumbnail'), async (req, res) => {

    try {
        const file = req.file;
        const { token } = req.cookies;
        if (file && token ) {
            const { title, summary, content } = req.body;

                jwt.verify(token, process.env.SECRECT_KEY, {}, async (err, userInfo) => {
                    if (err) {
                        console.log(err, 'inside the post create jwt verfiy')
                        res.status(422).json({ error: "your token is invalid" })
                    }
                    const postDoc = await Post.create({
                        title,
                        summary,
                        content,
                        thumbnail: file.filename,
                        author: userInfo.id,
                    });
    
                    res.status(200).json({ post: postDoc })
    
                })
            
            
        } else {
            res.status(402).json({ error: 'must include a thumbnail' })
        }
    } catch (error) {
        console.log(error, 'inside create post api')
        res.json({ error: "couldn't create a post" })
    }
})


router.get("/:id", async (req, res) => {

    try {
        const { id } = req.params;
        const postDoc = await Post.findById(id).populate({ path: 'author', select: 'username avatar' });
        if (!postDoc) {
            res.status(404).json({ error: 'post is null , There is no such post' })
        }

        if (postDoc) {
            res.status(200).json(postDoc)
        }
    } catch (error) {
        console.log(error, 'error inside the get post base on id')
        res.status(500).json({ error: 'An error occurred while processing your request.Query to find post base on id is not wrong' })
    }

})

router.post("/:id", uploadPost.single('thumbnail'), async (req, res) => {


    try {
        const { id } = req.params;
        const file = req.file;
        const { token } = req.cookies;
        const { title, summary, content } = req.body;

        if (file && token) {
            const postDoc = await Post.findById(id).populate({ path: 'author', select: '_id' });

            jwt.verify(token, process.env.SECRECT_KEY, {}, async (err, userInfo) => {
                if (err) {
                    console.log(err, 'token is not verified')
                    res.status(422).json({ error: 'you are not author of this post' })
                }

                isAuthor = JSON.stringify(userInfo.id) === JSON.stringify(postDoc.author._id);

                if (!isAuthor) {
                    res.status(422).json({ error: 'you are not valid author of this post' })
                }

                if (isAuthor) {
                    await Post.findByIdAndUpdate(id, {
                        title,
                        summary,
                        content,
                        thumbnail: file.filename,
                    }).exec()

                    res.status(200).json('update is successfull')
                }
            })

        }
    } catch (error) {
        console.log(error, 'update a post')
        res.status(500).json({ error: "Server couldn't not updated the post" })
    }
})

router.post("/:id/delete", async (req, res) => {

    try {
        const { id } = req.params;
        const { token } = req.cookies;

        if (token) {
            const postDoc = await Post.findById(id).populate({ path: 'author', select: '_id' })

            jwt.verify(token, process.env.SECRECT_KEY, {}, async (err, userInfo) => {
                if (err) {
                    console.log(err, 'jwt inside delte api')
                    res.status(422).json({ error: 'invalid author ' })
                }
                isAuthor = JSON.stringify(postDoc.author._id) === JSON.stringify(userInfo.id);

                if (!isAuthor) {
                    res.status(422).json({ error: 'you are not author of this post' })
                }
                if (isAuthor) {

                    await Post.findByIdAndDelete(id);
                    await Comment.deleteMany({ post : id })
                    res.status(200).json('post is successfully delted!')
                }
            })
        }
        // no need to provide the else part because if there is no token - { token } = req.cookies will generate the error
    } catch (error) {
        console.log(error, 'error during delete a post')
        res.status(500).json('you request is not proccessed by the server')
    }


})

router.post('/:id/upvote', async (req, res) => {
    try {
        const { id } = req.params;
        const { author } = req.body;
        const postDoc = await Post.findById(id)
        if( !postDoc ){
            res.status(404).json({error  : 'No such post'})
        }
        if( postDoc ){
            const updatePostDoc = await Post.findByIdAndUpdate( id , {
                $push : { upvote : author }
            } , { new : true }) // equal to --> postDoc.upvote.push( author )

            res.status(200).json('successfully upvoted')
        }
        
    } catch (error) {
        console.log(error, 'api - post/:id/upvote')
        res.status(500).json({ error: 'bad request' })
    }
})

router.post("/:id/downvote" , async ( req , res)=>{
    try {
        const { id } = req.params;
        const { author } = req.body;
        const postDoc = await Post.findById( id );
        if( !postDoc ){
            res.status(404).json({ error : 'no such post'})
        }
        if( postDoc ){
            const updatePostDoc = await Post.findByIdAndUpdate( id , {
                $pull : { upvote : author }
            }, { new : true }) // equal to --> postDoc.upvote.pull( author )

            console.log( updatePostDoc )
            res.status(200).json('successfully downvoted')
        }
    } catch (error) {
        console.log(error , 'api /post/:id/downvote')
        res.status(500).json({error : 'bad request'})
    }
})

module.exports = router;