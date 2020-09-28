import {Server} from '../../server';
import {ClientMessage} from './client-message';
import {JwtPayload} from '../../types';

export interface IClientMessageFactory {
    new ( server: Server,
          channel: string,
          message: { [index:string]: string|boolean|number},
          jwtPayload: JwtPayload): ClientMessage;
    EVENT : string;
}
