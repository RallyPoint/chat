import {ClientMessage} from './client-message';
import {Server} from '../../server';
import * as Axios from 'axios';
import * as config from 'config';
import {USER_ROLE} from '../../constants';
import {JwtPayload} from '../../types';

export class Admin extends ClientMessage {

    public static EVENT : string = 'admin';

    constructor(protected server: Server,
                protected channel: string,
                protected message: {userId:string,pseudo:string,action: string},
                protected jwtPayload: JwtPayload){
        super(server, channel, message, jwtPayload);
        this.event = Admin.EVENT;
    }

    isAdmin(){
        return (this.jwtPayload.roles && this.jwtPayload.roles.indexOf(USER_ROLE.ADMIN) != -1) || this.jwtPayload.pseudo === this.channel;
    }

    async toSocket(): Promise<any>{
        return {
            pseudo: this.jwtPayload.pseudo,
            forPseudo: this.message.pseudo,
            for: this.message.userId,
            by: this.jwtPayload.id,
            action: this.message.action
        };
    }

    async processFromClient(): Promise<void>{
        if(!this.isAdmin()){ throw new Error(); }
        switch (this.message.action) {
            case "ban":
                return Axios.default.post(config.api.rallypoint.endpoint + 'chat-auth/channel/' + this.channel + '/user/' + this.message.userId)
                    .then(() => this.toSocket())
                    .then((message) => {
                        return super.processFromClient();
                    });
            default :
        }
    }

    public async processFromMqtt() : Promise<void> {
        this.server.getClient(this.jwtPayload.id, this.channel).forEach((socket)=>{
            socket.emit('systeme',{type:"banned"});
        });
        this.server.removeClient(this.jwtPayload.id, this.channel);
        super.processFromMqtt();
    }
}

