const mongoose = require('mongoose')
const Schema = mongoose.Schema

const users=new Schema({
    id: String,
    account: String,
    password: String,
    name: String,
}, {
    timestamps: true,   
})

module.exports = mongoose.model('users', users)