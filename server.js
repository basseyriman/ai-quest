"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var next_1 = __importDefault(require("next"));
var socket_io_1 = require("socket.io");
var dev = process.env.NODE_ENV !== "production";
var hostname = "localhost";
var port = 3001;
var app = (0, next_1.default)({ dev: dev, hostname: hostname, port: port });
var handle = app.getRequestHandler();
app.prepare().then(function () {
    var server = (0, express_1.default)();
    var httpServer = (0, http_1.createServer)(server);
    var io = new socket_io_1.Server(httpServer);
    io.on("connection", function (socket) {
        console.log("Client connected:", socket.id);
        socket.on("join-room", function (roomId) {
            socket.join(roomId);
            console.log("Socket ".concat(socket.id, " joined room ").concat(roomId));
            io.to(roomId).emit("player-joined", { id: socket.id });
        });
        socket.on("play-card", function (data) {
            var roomId = data.roomId, card = data.card;
            console.log("Card played in room ".concat(roomId, ":"), card.name);
            socket.to(roomId).emit("card-played", data);
        });
        socket.on("disconnect", function () {
            console.log("Client disconnected:", socket.id);
        });
    });
    server.all(/.*/, function (req, res) {
        return handle(req, res);
    });
    httpServer.listen(port, function () {
        console.log("> Ready on http://".concat(hostname, ":").concat(port));
        console.log("> Socket.io server running");
    });
});
