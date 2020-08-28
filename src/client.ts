import {Message} from "./message/message";
import {Socket} from "socket.io";
import * as config from "config";
import * as jwt from "jsonwebtoken";
import {Server} from "./server";
import {Vote} from "./message/vote";
import {Recieve} from "./message/recieve";
import {Code} from "./message/code";
import {Admin} from "./message/admin";
import * as Axios from 'axios';


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
        let verify = null;
        try {
            verify = !!jwt.verify(socket.handshake.query['auth_token'], new Buffer(config.get('cert.jwt.public'), 'base64').toString('binary'),{ algorithms: ['RS256'] })
        }catch (e) {
            console.log(e);
        }
        if(!verify){
            throw new Error('Invalid token');
        }
        this.jwtPayload = jwt.decode(socket.handshake.query['auth_token']);
        Axios.default.get(config.api.rallypoint.endpoint+'chat-auth/channel/'+socket.handshake.query['channel']+'/user/'+this.jwtPayload.id)
            .catch(()=>{
                return {data:{status:false}};
            })
            .then((res)=>{
                if(res.data.status) {
                    this.jwtPayload = jwt.decode(socket.handshake.query['auth_token']);
                    this.channel = socket.handshake.query['channel'];
                    this.server.addClient(this.jwtPayload.id,this.channel,socket);
                    socket.join(socket.handshake.query['channel'])
                        .on('message', this.onReceive('message', Message).bind(this))
                        .on('vote', this.onReceive('vote', Vote).bind(this))
                        .on('admin', this.onReceive('admin', Admin).bind(this))
                        .on('code', this.onReceive('code', Code).bind(this));
                }else{
                    socket.emit('systeme',{type:"banned"});
                    socket.disconnect(true);
                }
            });
    }

    onReceive(type:string, model:new (socket: Server, channel: string,message: any, userId: string,pseudo:string, roles: string[])=>Recieve){
        return (message)=> {
            const time = Date.now();
            if (this.lastMessage > time - Client.messageDelay) {
                return;
            }
            this.lastMessage = time;
            try {
                new model(this.server, this.channel, message, this.jwtPayload.id,this.jwtPayload.pseudo,this.jwtPayload.role)
                    .process().catch(console.error);
            } catch (e) {
                console.error(e);
            }
        }
    }

    send(){

    }
}
