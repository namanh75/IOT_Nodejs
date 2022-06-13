const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com:1883')

client.on('connect', function () {
  setInterval(function () {
    var topic = 'SimpleMQTT'
    var message = { id: 11, packet_no: 126, temperature: 30, humidity: 60, tds: 1100, pH: 5.0 }
    message = JSON.stringify(message)
    client.publish(topic, message)
    console.log('Message sent')
  }, 5000)
})
