import * as uuid from 'uuid';
import {Recieve} from "./recieve";
import Axios from "axios";
import * as config from 'config';
import {Server} from "../server";

export class Code extends Recieve{

    private static readonly GITHUB_END_POINT = 'https://api.github.com/';
    constructor(protected socket: Server,
                protected channel: string,
                protected message: any,
                protected userId: string,
                protected pseudo:string,
                protected roles:string[]){
        super(socket, channel, message, userId, pseudo, roles);
        this.type = "code";
    }

    async toSocket(): Promise<any>{
        return Axios.post(Code.GITHUB_END_POINT+'gists',{
            description : this.message.txt,
            public : true,
            files : {
                [this.userId+"."+this.message.language]:{
                    content : this.message.code
                }
            }
        },{
            auth:config.get("OAuth.gistAuth")
        }).then((res) => {
            return {
                pseudo: this.pseudo,
                uuid: this.uuid,
                txt: this.message.txt,
                by: this.userId,
                url: res.data['html_url']
            };
        });
    }
}

