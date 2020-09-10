import {Recieve} from "./recieve";
import {Server} from "../server";
export class Message extends Recieve{


    constructor(protected socket: Server,
                protected channel: string,
                protected message: {txt:string},
                protected userId: string,
                protected pseudo: string,
                protected roles:string[],
                protected color: string){
        super(socket, channel, message, userId, pseudo, roles, color);
        this.type = "message";
    }

    async toSocket(): Promise<any>{
        return {
            uuid: this.uuid,
            pseudo: this.pseudo,
            color: this.color,
            txt: this.message.txt,
            by: this.userId
        };
    }
}

