import {Recieve} from "./recieve";
import {Server} from "../server";
import * as Axios from 'axios';
import * as config from "config";
import {Socket} from "socket.io";

export class Admin extends Recieve{

    constructor(protected socket: Server,
                protected channel: string,
                protected message: {userId:string,pseudo:string,action: string},
                protected userId: string,
                protected pseudo:string,
                protected roles:string[]){
        super(socket, channel, message, userId, pseudo, roles);
        this.type = "admin";
    }

    isAdmin(){
        return (this.roles && this.roles.indexOf('admin') != -1) || this.pseudo === this.channel;
    }

    async toSocket(): Promise<any>{
        return {
            pseudo: this.pseudo,
            forPseudo: this.message.pseudo,
            for: this.message.userId,
            by: this.userId,
            action: this.message.action
        };
    }

    async process(){
        if(!this.isAdmin()){
            return false;
        }
        switch (this.message.action) {
            case "ban":
                return Axios.default.post(config.api.rallypoint.endpoint + 'chat-auth/channel/' + this.channel + '/user/' + this.message.userId)
                    .then(() => this.toSocket())
                    .then((message) => {
                        this.server.io.to(this.channel).emit(this.type, message);
                        this.server.getClient(this.message.userId,this.channel).forEach((socket: Socket)=>{
                            socket.emit('systeme',{type:"banned"});
                        });
                        this.server.removeClient(this.message.userId,this.channel);
                        return true;
                    });
            default :
                return false;
        }
    }
}

