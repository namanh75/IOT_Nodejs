const dataModel = require('../models/dataModel')
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const key = process.env.JWT_KEY
class accountController {
    info(req, res, next) {
        if (req.cookies.tokenLogin) {
            jwt.verify(req.cookies.tokenLogin, key, function (err, data) {
                if (err) return console.error(err)
                userModel.findOne({ account: data.account })

                    .then(function (user) {
                        user = user ? user.toObject() : user
                        res.render('account', {
                            user
                        })
                    })
                    .catch(err => console.error(err))

            })

        }
        else {
            res.redirect('/login')
        }

    }
    change(req, res, next) {
        console.log(req.body)
        jwt.verify(req.cookies.tokenLogin, key, function (err, data){
            if (err) return res.json({message: "Không thể lưu thông tin"})
            else{
                console.log('Đã lưu')
                userModel.updateOne({account: data.account }, req.body, function (err, data){
                    res.json({ message: 'Đã lưu thành công' })
                })
            }
        })
        
    }

}

module.exports = new accountController