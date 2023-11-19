const mongoose = require('mongoose')

require('dotenv').config()

function databaseConnection() {
    mongoose.connect(process.env.URL)
        .then(res => console.log( "successfully connect to the database"))
        .catch(err => console.log(err, "cann't connect to the database"))
}


module.exports = { databaseConnection };