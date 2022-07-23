const mqtt = require('mqtt')
const userModel = require('../models/userModel')
const dataModel = require('../models/dataModel')

var mqttClient = mqtt.connect('mqtt://broker.hivemq.com:1883')
var topic = '/team15/messages'
var topicControl = '/team15/control'
var message

// var count = -1

class mqttconfig {
    init() {
        setInterval(() => {
            function getRandomArbitrary(min, max) {
                return Math.random() * (max - min) + min;
            }
            // dataModel.find({}).count({}, function (err, numbercount) {
            //     if (err) console.log('error: ' + err)
            //     count = numbercount + 1
            // })
            message = { id: 'NV001', warn: 'none', temperature: getRandomArbitrary(30, 35).toFixed(1), humidity: getRandomArbitrary(55, 65).toFixed(0), tds: getRandomArbitrary(1000, 1300).toFixed(0), pH: getRandomArbitrary(4, 5).toFixed(1) }
            message = JSON.stringify(message)
        }, 9999)
    }
    connect() {
        mqttClient.on('connect', () => {
            // setInterval(() => {
            //     mqttClient.publish(topic, message)
            //     console.log('Message sent')
            // }, 5 * 1000)
            setInterval(() => {
                mqttClient.subscribe(topic)
                console.log('Message received')
            }, 5 * 1000)
        })
    }

    message() {
        mqttClient.on('message', function (topic, message) {
            console.log(topic + ' : ' + message)
            var mess = JSON.parse(message)
            userModel.findOne({ id: mess.id })
                .then(userdata => {
                    mess.account = userdata.account
                    var data = new dataModel(mess)
                    data.save()
                        .then(message => {
                            console.log('Message saved!' + message)
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))

        })

    }


}

module.exports = new mqttconfig