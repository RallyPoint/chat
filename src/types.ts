import {USER_ROLE} from './constants';

export type JwtPayload = {
    pseudo: string;
    email: string;
    id: string;
    roles : USER_ROLE[];
    color: string;
}
