const express = require('express')
const multer = require('multer')
const path = require('path')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const User = require('../models/User')
const Post = require('../models/Post')

const router = express.Router()

// middleware multer setting - store the profile image
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/data/profile'))
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploadProfile = multer({ storage: profileStorage })


// API - for '/user'

router.get('/:id', async (req, res) => {

    try {
        const { id } = req.params;

        const userDoc = await User.findById(id, { password: 0 })
        const userPostsDoc = await Post.find({ author: id })
            .populate({ path: 'author', select: 'username avatar email' })
            .sort('-createdAt')

        res.status(200).json({ user: userDoc, userPosts: userPostsDoc })
    } catch (error) {
        console.log( error ,' /user/:id api ')
        res.status(500).json({error : 'bad request'})
    }

})

router.get('/profile/:id', async (req, res) => {

    try {
        const { token } = req.cookies;
        const { id } = req.params;

        if (token) {
            jwt.verify(token, process.env.SECRECT_KEY, {}, async (err, userInfo) => {
                if (err) {
                    console.log(err, 'jwt verfication profile/:id');
                    res.status(422).json({ error: "you are not valid user verfication" })
                }
                const userDoc = await User.findById(id);

                isAuthenticate = JSON.stringify(userDoc._id) === JSON.stringify(userInfo.id);
                if (!isAuthenticate) {
                    res.status(422).json({ error: 'you are not valid user' })
                }
                if (isAuthenticate) {
                    const postsDoc = await Post.find({ author: id }).sort('-createdAt');
                    res.status(200).json({ user: userDoc, userPosts: postsDoc })
                }
            })
        } else {
            res.status(422).json({ error: 'you are not authenticated user to see the user details' })
        }
    } catch (error) {
        console.log(error, 'error in get profile/:id api ')
        res.status(500).json({ error: "server couldn't resolve/executed your request" });
    }
})

router.post('/profile/:id', uploadProfile.single('avatar'), async (req, res) => {

    try {
        const { token } = req.cookies;
        const { id } = req.params;
        const file = req.file;
        const { username, email, bio, company, job, twitter, github, linkedin, portfolio } = req.body;

        if (token) {
            jwt.verify(token, process.env.SECRECT_KEY, {}, async (err, userInfo) => {
                if (err) {
                    console.log(err, 'jwt verification profile edit')
                    res.status(422).json({ error: 'you are not valid user to update data' })
                }
                const userDoc = await User.findById(id);

                const isAuthenticate = JSON.stringify(userDoc._id) === JSON.stringify(userInfo.id)

                if (!isAuthenticate) {
                    res.status(422).json({ error: 'you are not authenticate to update the user data' })
                }
                if (isAuthenticate) {

                    const updateUserDoc = await User.findByIdAndUpdate(id, {
                        username,
                        email,
                        ...(file ? { avatar: file.filename } : {}), // this line prevent to update the avatar if file is not exits
                        bio,
                        company,
                        job,
                        twitter,
                        github,
                        linkedin,
                        portfolio
                    }, { new: true })

                    // as user updated it's profile ,  i have need to change the token so that -
                    // new information can be store in the UserContext while fetch the /profile -> user data
                    // and i can send the updated information by jwt.verify at /profile
                    jwt.sign({ username: updateUserDoc.username, id: updateUserDoc.id, avatar: updateUserDoc.avatar }, process.env.SECRECT_KEY, {}, (jwtErr, newToken) => {
                        if (jwtErr) {
                            console.log(jwtErr, 'new token genration is failed after update the user')
                            res.status(500).json('new token genration is failed after update the user');
                        }

                        res.status(200).cookie('token', newToken).json({ username: updateUserDoc.username, id: updateUserDoc._id, avatar: updateUserDoc.avatar })
                    })

                }

            })
        }
    } catch (error) {
        console.log(error, 'error in user/profile/:id')
        res.status(422).json("your request is bad!")
    }
})










module.exports = router;