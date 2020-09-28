import {ClientMessage} from "./client-message";
import {Server} from "../../server";
import {JwtPayload} from '../../types';
export class Message extends ClientMessage{

    public static EVENT : string = 'message';

    constructor(protected server: Server,
                protected channel: string,
                protected message: {txt:string},
                protected jwtPayload: JwtPayload){
        super(server, channel, message, jwtPayload);
        this.event = Message.EVENT;
    }

    async toSocket(): Promise<any>{
        return {
            uuid: this.uuid,
            pseudo: this.jwtPayload.pseudo,
            color: this.jwtPayload.color,
            txt: this.message.txt,
            by: this.jwtPayload.id
        };
    }
}

