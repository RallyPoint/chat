import {Recieve} from "./recieve";
export class Message extends Recieve{


    constructor(protected message: {txt:string},protected userId: string){
        super(message, userId);
    }

    async toSocket(): Promise<any>{
        return {
            uuid: this.uuid,
            txt: this.message.txt,
            by: this.userId
        };
    }
}

