import * as express from "express";
import {Server} from "./server";

const app = express();
app.set("port", process.env.PORT || 3000);

new Server(app);
