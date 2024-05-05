const express = require("express")
const app = express()
const http = require("http")
const { Server } = require("socket.io")
const server = http.createServer(app)
const cors = require("cors")
const mongoose = require("mongoose")
const routes = require("./src/routes/routes")
require("dotenv").config()
const bodyParser = require("body-parser")

app.use(cors())
app.use(bodyParser.json());
// app.use(multer().any());

const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://192.168.5.104:3000",
            "http://192.168.224.178:3000"
        ],
        methods: ["GET", "POST"]
    }
})

app.use('/', routes)

mongoose.connect('mongodb://127.0.0.1:27017/chat-now-db')
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Error:", err))

io.on("connect", (socket) => {
    // console.log("a user is connected, id:", socket.id)
    socket.on("join_room", (data) => {
        console.log(data, "room joined")
        socket.join(data)
    })

    socket.on("out_from_room", (data) => {
        socket.leave(data)
    })

    socket.on("send_message", (data) => {
        // socket.broadcast.emit("received_message", data)
        console.log(data)
        socket.to(data.to).emit("received_message", data)
    })
})

server.listen(3001, () => {
    console.log("server is running on http://localhost:3001")
})