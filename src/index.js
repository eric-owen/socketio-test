const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const { generateMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static('public'))

const PORT = process.env.PORT || 3000

io.on('connection', (socket) => {

    socket.emit('message', generateMessage('Welcome to the chat!'))
    socket.broadcast.emit('message', generateMessage('A new user has joined'))

    socket.on('sendMessage', (message, callback) => {
        io.emit('message', generateMessage(message))
        callback('delivered')
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left'))
    })
    
    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.lat},${coords.long}`)
        callback()
    })

})

server.listen(PORT, () => console.log(PORT))