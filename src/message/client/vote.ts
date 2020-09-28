import {ClientMessage} from "./client-message";
import {Server} from "../../server";
import {JwtPayload} from '../../types';

export class Vote extends ClientMessage{

    public static EVENT : string = 'vote';

    constructor(protected server: Server,
                protected channel: string,
                protected message: {uuid:string,vote:boolean},
                protected jwtPayload: JwtPayload){
        super(server, channel, message, jwtPayload);
        this.event = Vote.EVENT;
    }

    async toSocket(): Promise<any>{
        return {
            uuid: this.message.uuid,
            vote: this.message.vote,
            by: this.jwtPayload.id
        };
    }
}

