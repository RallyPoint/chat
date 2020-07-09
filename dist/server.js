"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("./client");
var Server = /** @class */ (function () {
    function Server(express) {
        var http = require("http").Server(express);
        this.io = require("socket.io")(http);
        this.io.on("connection", this.onConnection.bind(this));
        var server = http.listen(3000, function () {
            console.log("listening on *:3000");
        });
    }
    Server.prototype.onConnection = function (socket) {
        try {
            new client_1.Client(socket, this);
        }
        catch (e) {
            socket.disconnect(true);
        }
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map