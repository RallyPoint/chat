import {ClientMessage} from "./client-message";
import Axios from "axios";
import * as config from 'config';
import {Server} from "../../server";
import {JwtPayload} from '../../types';

export class Code extends ClientMessage{

    public static EVENT : string = 'code';
    private static readonly GITHUB_END_POINT = 'https://api.github.com/';

    constructor(protected server: Server,
                protected channel: string,
                protected message: { [index:string]: string|boolean|number},
                protected jwtPayload: JwtPayload){
        super(server, channel, message, jwtPayload);
        this.event = Code.EVENT;
    }

    async toSocket(): Promise<any>{
        return {
            pseudo: this.jwtPayload.pseudo,
            uuid: this.uuid,
            txt: this.message.txt,
            by: this.jwtPayload.id,
            url: this.message.url
        };
    }

    public async processFromClient() : Promise<void>{
        if(this.message.url){
            await Axios.post(Code.GITHUB_END_POINT+'gists',{
                description : this.message.txt,
                public : true,
                files : {
                    [this.jwtPayload.id+"."+this.message.language]:{
                        content : this.message.code
                    }
                }
            },{
                auth:config.get("OAuth.gistAuth")
            }).then((res)=>{
                this.message.url = res.data['html_url'];
            });
        }
        return super.processFromClient();
    }


    public async processFromMqtt() : Promise<void>{
        return super.processFromMqtt();
    }
}
