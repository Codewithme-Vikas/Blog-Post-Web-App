const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const Post = require('../models/Post');
const Comment = require('../models/Comment');


const router = express.Router()

// API  - /comment/

router.get('/:postId', async (req, res) => {

    try {
        const { postId } = req.params;

        const commentsDoc = await Comment.find({ post: postId })
            .populate({ path: 'author', select: 'username' })
            .sort('-createdAt')

        if (!commentsDoc) {
            res.status(422).json(null)
        }
        if (commentsDoc) {
            res.status(200).json(commentsDoc)
        }
    } catch (error) {
        console.log(error, '/comment/:postId api goes wrong')
        res.status(500).json({ error: 'server issue or bad request' })
    }
});


router.post('/', async (req, res) => {

    try {
        const { comment, authorId, postId } = req.body;

        const commentDoc = await Comment.create({
            comment: comment,
            post: postId,
            author: authorId
        })

        res.status(200).json(commentDoc)
    } catch (error) {
        console.log(error, '/comment api ')
        res.status(500).json({ error: "couldn't create a comment! bad request" })
    }
});


router.delete('/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const { token } = req.cookies;

        if (token) {
            jwt.verify(token, process.env.SECRECT_KEY, {}, async (err, userInfo) => {
                if (err) {
                    console.log(err, 'delete comment')
                    res.status(422).json({ error: 'your token is not verified' })
                }
                const commentDoc = await Comment.findById(id);
                isAuthenticate = JSON.stringify(userInfo.id) === JSON.stringify(commentDoc.author);

                if (!isAuthenticate) {
                    res.status(422).json({ error: 'you are not author of this comment' })
                }

                if (isAuthenticate) {
                    const deleteCommentDoc = await Comment.findByIdAndDelete(id);
                    res.status(200).json( deleteCommentDoc )
                }

            })
        } else {
            res.status(422).json({ error: 'There is not any authentication token' })
        }
    } catch (error) {
        console.log(error, 'bad request , API - /comment/:id -- for delete')
        res.status(422).json({ error: "Bad/Wrong request" })
    }
})


module.exports = router;