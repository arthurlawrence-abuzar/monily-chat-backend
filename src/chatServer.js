// const path = require('path');
const express = require("express");
const app = express();
const http = require("http");
const serverless = require("serverless-http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});
app.get("/*", function (req, res) {
  res.send("Hello");
});
io.on("connection", (socket) => {
  console.log("a user connected :D");
  socket.on("message", (message) => {
    const obj = JSON.stringify(message);
    io.emit("message", `${obj}`);
    socket.broadcast.to(message.recieverId).emit("message", `${obj}`);
    console.log(message);
  });
  socket.on("delete", (message) => {
    const obj = JSON.stringify(message);
    io.emit("delete", `${obj}`);
    socket.broadcast.to(message.recieverId).emit("delete", `${obj}`);
    console.log(message);
  });
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
