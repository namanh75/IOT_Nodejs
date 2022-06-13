const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const key = process.env.JWT_KEY
class siteController {

    //home
    index(req, res, next) {
        res.render('home')
    }

    //login
    login(req, res, next) {
        res.render('login')
    }
    //login post
    loginPost(req, res, next) {
        if (req.cookies.tokenLogin) {
            jwt.verify(req.cookies.tokenLogin, key, function (err, data) {
                if (err) res.json('Xác thực thất bại')
                else {
                    userModel.findOne({ account: data.account })
                        .then(user => {
                            res.clearCookie('tokenLogin')
                            jwt.sign({ account: user.account }, key, function (err, tokenLogin) {
                                res.cookie('tokenLogin', tokenLogin)
                                    .then(() => {
                                        console.log('set up cookie successfully')
                                        res.render('home')
                                    })
                                    .catch(err => console.log('error setting up cookie'))
                            })

                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            })
        }
        else {
            userModel.findOne({ account: req.body.account, password: req.body.password })
                .then(user => {
                    jwt.sign({ account: user.account }, key, function (err, tokenLogin) {
                        if (err) console.log(err)
                        else {
                            res.cookie('tokenLogin', tokenLogin).redirect('/')
                        }
                    })
                })
        }
    }

    //logout
    logout(req, res, next) {
        res.clearCookie('tokenLogin').redirect('/')
    }

    //register
    register(req, res, next) {
        res.render('register')
    }

    //register post
    registerPost(req, res, next) {
        if(!req.body){
            let formData =req.body
            const userData = new userController(formData)
            userData.save((err)=>{
                if(err) console.log(err)
                else console.log('User data is saved')
            })
        }
        else{
            console.log('Cant not recieved from client')
        }
        res.redirect('/')
    }
}

module.exports = new siteController