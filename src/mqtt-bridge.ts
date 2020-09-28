import * as Mqtt from 'mqtt';
import * as config from 'config';
import {MqttClient} from 'mqtt';
import {BehaviorSubject, bindCallback, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {MqttMessage} from './mqtt-message';
import {ISubscriptionGrant} from 'mqtt';

export class MqttBridge {

    public channelsSubject: {[index:string] : Subject<MqttMessage>} = {};
    public channelsObs: {[index:string] : Observable<MqttMessage>} = {};
    public toto: Observable<any>;
    public mqttConnection : MqttClient;

    constructor(cbReady: ()=>void,cbError: ()=>void){
        this.mqttConnection = Mqtt.connect(`mqtt://${config.mqtt.host}`);
        this.mqttConnection.on('message', this.onMqttMessage.bind(this));
        this.mqttConnection.on("connect",()=>{
            this.mqttConnection.subscribe('channel/+/chat',(err: Error, granted: ISubscriptionGrant[]) => {
                err ? cbError():cbReady();
            });
        });
    }

    public getChannelObs(channel: string): Observable<MqttMessage>{
        if(!this.channelsObs[channel]){
            this.channelsSubject[channel] = new Subject<MqttMessage>();
            this.channelsObs[channel] = this.channelsSubject[channel].asObservable().pipe();
        }
        return this.channelsObs[channel];
    }

    private onMqttMessage(topic: string,buffer: Buffer): void{
        const channel = topic.split('/')[1];
        if(this.channelsSubject[channel]){ this.channelsSubject[channel].next(JSON.parse(buffer.toString())); }
    }

    public sendMessage(channel: string, message: MqttMessage): void{
        this.mqttConnection.publish(this.getChannelTopic(channel),message.toJson());
    }

    private getChannelTopic(channel: string): string{
        return `channel/${channel}/chat`;
    }


}
