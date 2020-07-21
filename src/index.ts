import * as express from "express";
import * as cors from "cors";
import {Server} from "./server";

const app = express();
app.use(cors());
app.set("port", process.env.PORT || 3000);

new Server(app);
