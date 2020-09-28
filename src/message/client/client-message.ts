import * as uuid from 'uuid';
import {Server} from '../../server';
import {MqttMessage} from '../../mqtt-message';
import {JwtPayload} from '../../types';
import {MQTT_MESSAGE_EVENTS} from '../../constants';

export class ClientMessage{

    protected uuid: string;
    protected event: string;
    protected EVENT : string = "UNDEFINED";

    constructor(protected server: Server,
                protected channel: string,
                protected message: { [index:string]: string|boolean|number},
                protected jwtPayload: JwtPayload){
        this.uuid = uuid.v4();
    }

    async toSocket(): Promise<any>{
        return {
            uuid: this.uuid,
            by: this.jwtPayload.id
        };
    }

    /**
     * Execute on server recieve message from client
     */
    public async processFromClient() : Promise<void>{
        this.server.mqttBridge.sendMessage(this.channel, new MqttMessage(MQTT_MESSAGE_EVENTS.CLIENT, this.event, await this.toSocket(), this.jwtPayload));
    }

    /**
     * Execute on server recieve message from other server cluster
     */
    public async processFromMqtt() : Promise<void>{
        console.log("SEND TO CLIENT");
        this.server.io.to(this.channel).emit(this.event, await this.toSocket());
    }
}

