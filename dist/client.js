"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message_1 = require("./message");
var jwt = require("jsonwebtoken");
var fs = require("fs");
var vote_1 = require("./vote");
var code_1 = require("./code");
var publicKey = fs.readFileSync('./ci/cert/local.pub', "utf-8");
var Client = /** @class */ (function () {
    function Client(socket, server) {
        this.socket = socket;
        this.server = server;
        if (!socket.handshake.query['auth_token'] || !socket.handshake.query['auth_token']) {
            throw new Error('Invalide params');
        }
        if (!jwt.verify(socket.handshake.query['auth_token'], publicKey, { algorithms: ['RS256'] })) {
            throw new Error('Invalid token');
        }
        this.jwtPayload = jwt.decode(socket.handshake.query['auth_token']);
        this.channel = socket.handshake.query['channel'];
        console.log("hello");
        socket.join(socket.handshake.query['channel'])
            .on('message', this.onReceive('message', message_1.Message).bind(this))
            .on('vote', this.onReceive('vote', vote_1.Vote).bind(this))
            .on('code', this.onReceive('code', code_1.Code).bind(this));
    }
    Client.prototype.onReceive = function (type, model) {
        var _this = this;
        return function (message) {
            var time = Date.now();
            if (_this.lastMessage > time - Client.messageDelay) {
                return;
            }
            _this.lastMessage = time;
            try {
                new model(message, _this.jwtPayload.userId).toSocket().then(function (message) {
                    _this.server.io.to(_this.channel).emit(type, message);
                });
            }
            catch (e) {
                console.error(e);
            }
        };
    };
    Client.prototype.onMessage = function (message) {
        console.log("message:", message);
        var time = Date.now();
        if (this.lastMessage > time - Client.messageDelay) {
            return;
        }
        this.lastMessage = time;
        try {
            console.log(this.channel);
            this.server.io.to(this.channel).emit("message", new message_1.Message(message, this.jwtPayload.userId).toSocket());
        }
        catch (e) {
            console.error(e);
        }
    };
    Client.prototype.onVote = function (message) {
        var time = Date.now();
        console.log("message:", message);
        if (this.lastMessage > time - Client.messageDelay) {
            return;
        }
        this.lastMessage = time;
        try {
            this.server.io.to(this.channel).emit("vote", new vote_1.Vote(message, this.jwtPayload.userId).toSocket());
        }
        catch (e) {
        }
    };
    Client.prototype.send = function () {
    };
    Client.messageDelay = 1000 * 1;
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=client.js.map