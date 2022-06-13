const { response } = require('express');
const dataModel = require('../models/dataModel')
class apiController {

    //users
    users(req, res, next) {
        
    }

    //data
    data(req, res, next) {
        dataModel.find({})
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                console.log('Err: ' + err);
            })
    }

}

module.exports = new apiController