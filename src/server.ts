import {Express} from "express";
import {Socket} from "socket.io";
import {Client} from "./client";

export class Server{

    public io: any;
    constructor(express: Express){
        let http = require("http").Server(express);
        this.io = require("socket.io")(http);

        this.io.on("connection", this.onConnection.bind(this));

        const server = http.listen(3000, function() {
            console.log("listening on *:3000");
        });

    }

    onConnection(socket: Socket){
        try {
            new Client(socket,this);
        }catch (e) {
            socket.disconnect(true);
        }
    }
}
