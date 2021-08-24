const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static('public'))

const PORT = process.env.PORT || 3000

io.on('connection', (socket) => {
    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined')

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })
    
    socket.on('sendLocation', (coords) => {
        io.emit('message', `https://google.com/maps?q=${coords.lat},${coords.long}`)
    })

})

server.listen(PORT, () => console.log(PORT))