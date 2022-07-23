const mongoose = require('mongoose')
const Schema = mongoose.Schema

const users=new Schema({
    id: String,
    account: String,
    password: String,
    username: String,
    on: String,
}, {
    timestamps: true,   
})

module.exports = mongoose.model('users', users)