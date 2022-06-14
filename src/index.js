const path = require('path')
const express = require('express')
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mqtt = require('mqtt')
require('dotenv').config()
const route = require('./routes/routing')
const database = require('./config/connect')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('combined'))
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

route(app)

database.connect()

//handle MQTT
var mqttClient = mqtt.connect('mqtt://broker.hivemq.com:1883')
var topic = '/team15/messages'
const dataModel = require('./models/dataModel')
var message
var count = -1
setInterval(()=>{ 
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    count+=1
    message = { id: count, state: 0, temperature: getRandomArbitrary(30, 35).toFixed(1), humidity: getRandomArbitrary(55,65).toFixed(0), tds: getRandomArbitrary(1000, 1300).toFixed(0), pH: getRandomArbitrary(4 , 5).toFixed(1) }
    message = JSON.stringify(message)
}, 9999)
mqttClient.on('connect', () => {
    setInterval(() => {
        mqttClient.publish(topic, message)
        console.log('Message sent')
    }, 10 * 1000)
    setInterval(() => {
        mqttClient.subscribe(topic)
        console.log('Message received')
    }, 10 * 1000)
})
mqttClient.on('message', function (topic, message) {
    console.log(topic + ' : ' + message)
    const data = new dataModel(JSON.parse(message))
    data.save()
        .then(message => {
            console.log('Message saved : ' + message)
        })
        .catch(err => console.log(err))
})

//listen
const port = process.env.PORT

app.listen(port, function (error) {
    if (error) {
        console.log("Something went wrong");
    }
    console.log("Server is running port:  " + port)
})