import {MQTT_MESSAGE_EVENTS} from './constants';
import {JwtPayload} from './types';

export class MqttMessage {

    constructor(public type: MQTT_MESSAGE_EVENTS,
                public event: string,
                public message: any,
                public jwtPayload: JwtPayload){

    }

    public toJson() : string{
        return JSON.stringify(this);
    }

}
