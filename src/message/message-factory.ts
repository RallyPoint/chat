//import {IServerMessageFactory} from './server/server-message-factory.interface';
import {IClientMessageFactory} from './client/client-message-factory.interface';
import {Admin} from './client/admin';
import {Code} from './client/code';
import {Message} from './client/message';
import {Vote} from './client/vote';
import {ClientMessage} from './client/client-message';
import {Server} from '../server';
import {MqttMessage} from '../mqtt-message';

export class MessageFactory {

//    private static SERVER_MESSAGE_CLASS: IServerMessageFactory[] = [];
    private static CLIENT_MESSAGE_CLASS: IClientMessageFactory[] = [
        Admin,
        Code,
        Message,
        Vote
    ];


    public static getClientMessage(fromChannel: string, message: MqttMessage, server: Server): ClientMessage{
        const _class = MessageFactory.CLIENT_MESSAGE_CLASS.find((_class) => {
            return _class.EVENT === message.event;
        });
        return new _class(server,fromChannel,message.message,message.jwtPayload);
    }


}
