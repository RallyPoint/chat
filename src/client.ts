import {Message} from "./message";
import {Socket} from "socket.io";
import * as config from "config";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import {Server} from "./server";
import {Vote} from "./vote";
import {Recieve} from "./recieve";
import {Code} from "./code";


export class Client {

    public static readonly messageDelay : number = 1000*1;
    public channel : string;
    public lastMessage : number;
    public jwtPayload: any;

    constructor(protected readonly socket: Socket,protected readonly server: Server) {
        if(!socket.handshake.query['channel']){
            throw new Error('Invalide params');
        }
        if(!socket.handshake.query['auth_token'] || socket.handshake.query['auth_token'] === "null"){
            socket.join(socket.handshake.query['channel']);
            return;
        }
        if(!jwt.verify(socket.handshake.query['auth_token'], new Buffer(config.get('cert.jwt.public'), 'base64').toString('binary'),{ algorithms: ['RS256'] })){
            throw new Error('Invalid token');
        }
        this.jwtPayload = jwt.decode(socket.handshake.query['auth_token']);
        this.channel = socket.handshake.query['channel'];
        socket.join(socket.handshake.query['channel'])
            .on('message',this.onReceive('message', Message).bind(this))
            .on('vote',this.onReceive('vote', Vote).bind(this))
            .on('code',this.onReceive('code', Code).bind(this));
    }

    onReceive(type:string, model:new (message: any, userId: string,pseudo:string)=>Recieve){
        return (message)=> {
            console.log("onReceive",message);
            const time = Date.now();
            if (this.lastMessage > time - Client.messageDelay) {
                return;
            }
            this.lastMessage = time;
            try {
                new model(message, this.jwtPayload.userId,this.jwtPayload.pseudo).toSocket().then((message) => {
                    this.server.io.to(this.channel).emit(type, message);
                });
            } catch (e) {
                console.error(e);
            }
        }
    }

    onMessage(message: {txt:string}){
        console.log("message:",message);
        const time = Date.now();
        if(this.lastMessage > time - Client.messageDelay){return;}
        this.lastMessage = time;
        try{
            this.server.io.to(this.channel).emit("message", new Message(message,this.jwtPayload.userId,this.jwtPayload.pseudo).toSocket());
        }catch (e) {
            console.error(e);
        }
    }

    onVote(message: {uuid:string,vote:boolean}){
        const time = Date.now();
        console.log("message:",message);
        if(this.lastMessage > time - Client.messageDelay){
            return;
        }
        this.lastMessage = time;
        try{
            this.server.io.to(this.channel).emit("vote", new Vote(message,this.jwtPayload.userId,this.jwtPayload.pseudo).toSocket());
        }catch (e) {
        }
    }

    send(){

    }
}
