import {Recieve} from "./recieve";
import {Server} from "../server";

export class Vote extends Recieve{

    constructor(protected socket: Server,
                protected channel: string,
                protected message: {uuid:string,vote:boolean},
                protected userId: string,
                protected pseudo:string,
                protected roles:string[]){
        super(socket, channel, message, userId, pseudo, roles);
        this.type = "vote";
    }

    async toSocket(): Promise<any>{
        return {
            uuid: this.message.uuid,
            vote: this.message.vote,
            by: this.userId
        };
    }
}

