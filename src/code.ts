import * as uuid from 'uuid';
import {Recieve} from "./recieve";
import Axios from "axios";
export class Code extends Recieve{

    private static readonly GITHUB_END_POINT = 'https://api.github.com/';
    constructor(protected message: any,protected userId: string){
        super(message,userId );
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
                password: 'dd9e5652ad3d72f7b6070e617d0e7177c4688dc0'
            }
        }).then((res) => {
            return {
                uuid: this.uuid,
                txt: this.message.txt,
                by: this.userId,
                url: res.data['html_url']
            };
        });
    }
}

