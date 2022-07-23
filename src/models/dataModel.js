const mongoose = require('mongoose')
const Schema = mongoose.Schema

const data=new Schema({
    id: String,
    account: String,
    warn: String,
    humidity: String,
    temperature: String,
    tds: String,
    pH: String,
    
}, {
    timestamps: true,
})

module.exports = mongoose.model('data', data)