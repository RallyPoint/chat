import {Express} from "express";
import {Socket} from "socket.io";
import {Client} from "./client";

export class Server{

    public io: any;
    private client : {[index:string]: Set<Socket>} = {};

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

    addClient(userId: string,channel: string, socket: Socket) {
        if(!this.client[userId+'-'+channel]){
            this.client[userId+'-'+channel] = new Set();
        }
        this.client[userId+'-'+channel].add(socket);
        socket.once('disconnect', () => {
            this.client[userId+'-'+channel].delete(socket);
            if(this.client[userId+'-'+channel].size === 0){
                delete this.client[userId+'-'+channel];
            }
        });
    }

    getClient(userId: string, channel: string): Set<Socket>{
        return this.client[userId+'-'+channel];
    }

    removeClient(userId: string, channel: string){
        this.client[userId+'-'+channel].forEach((value)=>{
            value.disconnect(true);
        });
        delete this.client[userId+'-'+channel];
    }
}
