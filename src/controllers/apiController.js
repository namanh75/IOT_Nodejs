const { response } = require('express');
const dataModel = require('../models/dataModel')
const jwt = require('jsonwebtoken')
const key = process.env.JWT_KEY
class apiController {

    //users
    users(req, res, next) {

    }

    //data
    data(req, res, next) {
        if (req.cookies.tokenLogin) {
            jwt.verify(req.cookies.tokenLogin, key, function (err, data) {
                dataModel.where({}).sort({ "_id": -1 }).find({account: data.account})
                    .then(data => {
                        res.json(data)
                    })
                    .catch(err => {
                        console.log('Err: ' + err);
                    })
            })

        }
        else {
            var data = ['0', '0', '0', '0', '0', '0', '0']
            res.json(data)
        }

    }

}

module.exports = new apiController