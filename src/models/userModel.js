const mongoose = require('mongoose')
const Schema = mongoose.Schema

const users=new Schema({
    id: String,
    account: String,
    password: String,
    username: String,
}, {
    timestamps: true,   
})

module.exports = mongoose.model('users', users)