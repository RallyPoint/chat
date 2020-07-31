import * as uuid from 'uuid';
import {Recieve} from "./recieve";
import Axios from "axios";
export class Code extends Recieve{

    private static readonly GITHUB_END_POINT = 'https://api.github.com/';
    constructor(protected message: any,protected userId: string,protected pseudo:string){
        super(message,userId,pseudo );
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
            auth:{
                username: 'franckrst',
                password: 'b9f23b9abb5d06baab8d28964ad529db00e50ff1'
            }
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

