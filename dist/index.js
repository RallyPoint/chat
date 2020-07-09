"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var server_1 = require("./server");
var app = express();
app.set("port", process.env.PORT || 3000);
new server_1.Server(app);
//# sourceMappingURL=index.js.map