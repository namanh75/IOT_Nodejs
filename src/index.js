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
var topic = 'testAPI'
var message = { id: 11, packet_no: 126, temperature: 30, humidity: 60, tds: 1100, pH: 5.0 }
message = JSON.stringify(message)
const dataModel = require('./models/dataModel')
mqttClient.on('connect', () => {
    console.log('Mqtt connected')
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