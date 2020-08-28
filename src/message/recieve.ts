import * as uuid from 'uuid';
import {Server} from "../server";

export class Recieve{

    protected uuid: string;
    protected type : string;

    constructor(protected server: Server,
                protected channel: string,
                protected message: any,
                protected userId: string,
                protected pseudo:string,
                protected role:string[]){
        this.uuid = uuid.v4();
    }

    async toSocket(): Promise<any>{
        return {
            uuid: this.uuid,
            by: this.userId
        };
    }

    async process() : Promise<boolean>{
        this.server.io.to(this.channel).emit(this.type, await this.toSocket());
        return true;
    }
}

