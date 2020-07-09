import * as uuid from 'uuid';

export class Recieve{

    protected uuid: string;

    constructor(protected message: any,protected userId: string){
        this.uuid = uuid.v4();
    }

    async toSocket(): Promise<any>{
        return {
            uuid: this.uuid,
            by: this.userId
        };
    }
}

