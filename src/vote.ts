import {Recieve} from "./recieve";

export class Vote extends Recieve{

    constructor(protected message: {uuid:string,vote:boolean},protected userId: string){
        super(message, userId);
    }

    async toSocket(): Promise<any>{
        return {
            uuid: this.message.uuid,
            vote: this.message.vote,
            by: this.userId
        };
    }
}

