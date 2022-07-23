const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const mqtt = require('mqtt')
const key = process.env.JWT_KEY

var mqttClient = mqtt.connect('mqtt://broker.hivemq.com:1883')
var topicControl = '/team15/control'
var messageControl
class siteController {

    //home
    index(req, res, next) {
        res.render('home')
    }
    //login
    login(req, res, next) {
        res.render('login', {
            layout: false
        })
    }
    //login post
    loginPost(req, res, next) {
        if (req.cookies.tokenLogin) {
            // jwt.verify(req.cookies.tokenLogin, key, function (err, data) {
            //     if (err) res.json('Xác thực thất bại')
            //     else {
            //         userModel.findOne({ account: data.account })
            //             .then(user => {
            //                 res.clearCookie('tokenLogin')
            //                 jwt.sign({ account: user.account }, key, function (err, tokenLogin) {
            //                     res.cookie('tokenLogin', tokenLogin)
            //                         .then(() => {
            //                             console.log('set up cookie successfully')
            //                             res.render('home')
            //                         })
            //                         .catch(err => console.log('error setting up cookie'))
            //                 })

            //             })
            //             .catch(err => {
            //                 console.log(err)
            //             })
            //     }
            // })
            res.redirect('/')
        }
        else {
            userModel.findOne({ account: req.body.account, password: req.body.password })
                .then(user => {
                    if (user) {
                        jwt.sign({ account: user.account }, key, function (err, tokenLogin) {
                            if (err) {
                                console.log(err)

                            }
                            else {
                                res.cookie('tokenLogin', tokenLogin).json({
                                    message: 'success'
                                })
                            }
                        })
                    }
                    else {
                        res.json({ message: "Sai tên đăng nhập hoặc mật khẩu. Vui lòng nhập lại" })
                    }

                })
        }
    }

    //logout
    logout(req, res, next) {
        res.clearCookie('tokenLogin').redirect('/')
    }
    //information
    info(req, res, next) {
        res.render('information')
    }

    //check login
    check(req, res, next) {
        if (req.cookies.tokenLogin) {
            jwt.verify(req.cookies.tokenLogin, key, function (err, data) {
                if (err) console.log(err)
                else {
                    console.log(data)
                    userModel.findOne({ account: data.account })
                        .then(userdata => {
                            // if (err) return console.log(err)
                            console.log(userdata)
                            userdata = userdata ? userdata.toObject() : userdata
                            res.json({
                                login: 'true',
                                account: userdata
                            })
                        })
                }
            })

        }
        else {
            res.json({
                login: 'false'
            })
        }
    }
    history(req, res, next) {
        res.render('history')
    }

    //check on / off system
    checkOn(req, res, next) {
        console.log(req.body)
        var id
        jwt.verify(req.cookies.tokenLogin, key, function (err, data) {
            if (err) return console.error(err)
            userModel.findOne({ account: data.account }, function (err, user) {
              if(err) return console.error(err)
              else{
                id=user.id
              }  
            })
            userModel.updateOne({ account: data.account }, req.body, function (err, data) {
                console.log(data)
                res.json({ message: 'Đã thay đổi hệ thống' })                
                messageControl={id: id, on: req.body.on}
                var messageSend=JSON.stringify(messageControl)
                mqttClient.publish(topicControl, messageSend)
                console.log('Message sent:'+ messageSend)
            })
        })


    }
}

module.exports = new siteController