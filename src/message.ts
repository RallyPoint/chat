import {Recieve} from "./recieve";
export class Message extends Recieve{


    constructor(protected message: {txt:string},protected userId: string,protected pseudo: string){
        super(message, userId,pseudo);
    }

    async toSocket(): Promise<any>{
        return {
            uuid: this.uuid,
            pseudo: this.pseudo,
            txt: this.message.txt,
            by: this.userId
        };
    }
}

