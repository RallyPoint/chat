import * as express from "express";
import * as cors from "cors";
import {Server} from "./server";

const app = express();
var allowedOrigins = ['http://localhost:4200',
    'http://127.0.0.1:4200',
    'https://rallypoint.tech'];
app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.set("port", process.env.PORT || 3000);

new Server(app);
