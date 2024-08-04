const express = require('express')
require('dotenv').config()
const path = require('path')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const { databaseConnection } = require('./Config')
const User = require('./models/User')

// route
const postRouter = require('./route/post')
const userRouter = require('./route/user')
const commentRouter = require('./route/comment')


// create a top level express application
const app = express()


// connect to mongodb( Database )
databaseConnection();

// middlewares
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use('/static', express.static(path.join(__dirname, 'public/data')));
app.use(cookieParser())

// routes
app.use('/post', postRouter)
app.use('/user', userRouter)
app.use('/comment', commentRouter)


// application API

app.post('/register', async (req, res) => {

    try {
        const { username, email, password } = req.body;
        console.log(username, email, password)
        const userDoc = await User.create({
            username,
            email,
            password,
        });

        res.status(200).json(userDoc)

    } catch (error) {
        console.log(error, 'register api')
        res.status(422).json({ error: 'registration failed!' })
    }

})


app.post('/login', async (req, res) => {

    // task - don't send message expcitly like user/password not matched

    try {
        const { username, password } = req.body;
        const userDoc = await User.findOne({ username });

        if (!userDoc) {
            res.status(422).json({ error: 'user is not exits' });
        }

        if (userDoc) {
            const isValidPassword = JSON.stringify(password) === JSON.stringify(userDoc.password);

            if (!isValidPassword) {
                res.status(401).json({ error: 'password are not matched' })
            }
            if (isValidPassword) {
                jwt.sign({ username, id: userDoc._id, avatar: userDoc.avatar }, process.env.SECRECT_KEY, {}, (err, token) => {
                    if (err) {
                        console.log(err, 'jwt token error ')
                        res.json('token is not created')
                    }
                    res.status(200).cookie('token', token).json({ username, id: userDoc._id, avatar: userDoc.avatar })
                })
            }
        }
    } catch (error) {
        console.log(error, 'login api')
        res.status(422).json('This is bad request!')
    }


})


app.post('/logout', async (req, res) => {
    return res.cookie('token', '').json('cokkie is set as empty')
})


app.get('/profile', async (req, res) => {

    try {
        const { token } = req.cookies;
        if (token) {
            jwt.verify(token, process.env.SECRECT_KEY, {}, (err, userInfo) => {
                if (err) {
                    console.log(err, 'jwt token error ')
                    res.status(422).json('token is invalideted!')
                }
                res.status(200).json(userInfo)
            })
        } else {
            res.status(422).json('there is no token in request header')
        }

    } catch (error) {
        console.log(error, 'profile api');
        res.status(422).json({ error: 'there is no any user' });
    }
})




app.listen(process.env.PORT || 3000, () => {
    console.log(`website is running on port http://localhost:${process.env.PORT || 3000}`)
});

