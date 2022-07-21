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
const mqttconfig = require('./mqtt/mqttconfig')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('combined'))
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json())

route(app)

database.connect()

//handle MQTT
mqttconfig.init()
mqttconfig.connect()
mqttconfig.message()

//listen
const port = process.env.PORT

app.listen(port, function (error) {
    if (error) {
        console.log("Something went wrong");
    }
    console.log("Server is running port:  " + port)
})