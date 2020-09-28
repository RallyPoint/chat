import {Express} from "express";
import {Socket} from "socket.io";
import {Client} from "./client";
import {MqttBridge} from './mqtt-bridge';
import {Subscription} from 'rxjs';
import {MessageFactory} from './message/message-factory';
import * as SocketIO from 'socket.io';

export class Server{

    public io: SocketIO.Server;
    public mqttBridge: MqttBridge;
    private client : {[index:string]:{[index:string]: Set<Socket>}} = {};
    private roomsOpen: {[index: string]: Subscription} = {};

    constructor(express: Express){
        let http = require("http").Server(express);
        this.io = require("socket.io")(http);
        this.mqttBridge = new MqttBridge(()=>this.listen(http),()=>{ process.exit(1); });
        this.io.on("connection", this.onConnection.bind(this));
    }

    listen(http): void{
        http.listen(3000, function() {
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
        if(!this.client[channel]){
            // Create channel Obj for client
            this.client[channel] = {};
            // Link channel to MQTT
            this.roomsOpen[channel] = this.joinMqttToSocket(channel);
        }
        // Create client Set for all socket of client in channel
        if(!this.client[channel][userId]){ this.client[channel][userId] = new Set(); }
        // Save client
        this.client[channel][userId].add(socket);
        //On disconnect clean data
        socket.once('disconnect', () => {
            // Delte socket in SET
            this.client[channel][userId].delete(socket);
            // remove set if was alone
            if(this.client[channel][userId].size === 0) {
                delete this.client[channel][userId];
                // delete and unlink to mqtt channel if is empty
                if(Object.keys(this.client[channel]).length === 0) {
                    this.roomsOpen[channel].unsubscribe();
                    delete this.client[channel];
                    delete this.roomsOpen[channel];
                }
            }
        });
    }

    getClient(userId: string, channel: string): Set<Socket>{
        return this.client[channel][userId];
    }

    removeClient(userId: string, channel: string): void{
        if(!this.client[channel] || !this.client[channel][userId]){ return; }
        this.client[channel][userId].forEach((value)=>{
            value.disconnect(true);
        });
    }

    private joinMqttToSocket(channel: string) : Subscription {
        console.log("JOIN CHANNEL",channel);
        return  this.mqttBridge.getChannelObs(channel).subscribe((message) => {
            MessageFactory.getClientMessage(channel, message, this).processFromMqtt();
        });
    }
}
